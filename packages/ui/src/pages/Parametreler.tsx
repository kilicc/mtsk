import { useState, useEffect } from 'react';
import { GenelParametreler, SMSParametreleri } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function Parametreler() {
  const [genelParametreler, setGenelParametreler] = useState<GenelParametreler | null>(null);
  const [smsParametreleri, setSMSParametreleri] = useState<SMSParametreleri | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'genel' | 'sms' | 'yetki'>('genel');

  useEffect(() => {
    loadParametreler();
  }, []);

  const loadParametreler = async () => {
    try {
      setLoading(true);
      const [genelResponse, smsResponse] = await Promise.all([
        fetch(`${API_URL}/parametreler/genel`).then(r => r.json()),
        fetch(`${API_URL}/parametreler/sms`).then(r => r.json()),
      ]);
      setGenelParametreler(genelResponse);
      setSMSParametreleri(smsResponse);
    } catch (error) {
      console.error('Error loading parametreler:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenelUpdate = async (updates: Partial<GenelParametreler>) => {
    try {
      const response = await fetch(`${API_URL}/parametreler/genel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      setGenelParametreler(data);
    } catch (error) {
      console.error('Error updating genel parametreler:', error);
    }
  };

  const handleSMSUpdate = async (updates: Partial<SMSParametreleri>) => {
    try {
      const response = await fetch(`${API_URL}/parametreler/sms`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      setSMSParametreleri(data);
    } catch (error) {
      console.error('Error updating SMS parametreleri:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">⚙️ Parametreler & Ayarlar</h1>
        <p className="text-gray-600">Sistem parametreleri ve yetkilendirme ayarları</p>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('genel')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'genel'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Genel Parametreler
        </button>
        <button
          onClick={() => setActiveTab('sms')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'sms'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          SMS Ayarları
        </button>
        <button
          onClick={() => setActiveTab('yetki')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'yetki'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Yetkilendirme
        </button>
      </div>

      {activeTab === 'genel' && genelParametreler && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Genel Parametreler</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Son Referans No</label>
                <input
                  type="number"
                  value={genelParametreler.son_refno || ''}
                  onChange={(e) => handleGenelUpdate({ son_refno: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Tutar</label>
                <input
                  type="text"
                  value={genelParametreler.minimum_tutar || ''}
                  onChange={(e) => handleGenelUpdate({ minimum_tutar: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={genelParametreler.check_minimum || false}
                onChange={(e) => handleGenelUpdate({ check_minimum: e.target.checked })}
                className="w-5 h-5"
              />
              <label className="text-sm font-medium text-gray-700">Minimum Tutar Kontrolü</label>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={genelParametreler.check_maksimum_taksit_say || false}
                onChange={(e) => handleGenelUpdate({ check_maksimum_taksit_say: e.target.checked })}
                className="w-5 h-5"
              />
              <label className="text-sm font-medium text-gray-700">Maksimum Taksit Sayısı Kontrolü</label>
            </div>
            {genelParametreler.check_maksimum_taksit_say && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maksimum Taksit Sayısı</label>
                <input
                  type="number"
                  value={genelParametreler.maksimum_taksit_say || ''}
                  onChange={(e) => handleGenelUpdate({ maksimum_taksit_say: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'sms' && smsParametreleri && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">SMS Ayarları</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={smsParametreleri.sms_bil_yeni_kayit || false}
                  onChange={(e) => handleSMSUpdate({ sms_bil_yeni_kayit: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">Yeni Kayıt Bildirimi</label>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={smsParametreleri.sms_bil_kursiyer_odeme || false}
                  onChange={(e) => handleSMSUpdate({ sms_bil_kursiyer_odeme: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">Kursiyer Ödeme Bildirimi</label>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={smsParametreleri.sms_bil_referans_odeme || false}
                  onChange={(e) => handleSMSUpdate({ sms_bil_referans_odeme: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">Referans Ödeme Bildirimi</label>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={smsParametreleri.sms_bil_gelir || false}
                  onChange={(e) => handleSMSUpdate({ sms_bil_gelir: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">Gelir Bildirimi</label>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={smsParametreleri.sms_bil_gider || false}
                  onChange={(e) => handleSMSUpdate({ sms_bil_gider: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">Gider Bildirimi</label>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={smsParametreleri.sms_kur_dogum_gunu_pazar_durumu || false}
                  onChange={(e) => handleSMSUpdate({ sms_kur_dogum_gunu_pazar_durumu: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="text-sm font-medium text-gray-700">Doğum Günü Bildirimi</label>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'yetki' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Kullanıcı Yetkilendirme</h2>
          <p className="text-gray-600">Kullanıcı yetki yönetimi yakında eklenecek...</p>
        </div>
      )}
    </div>
  );
}

