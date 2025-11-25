import { useState, useEffect } from 'react';
import type { Arac, AracBakim } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

interface AracDetailProps {
  id: string;
  onBack: () => void;
}

export default function AracDetail({ id, onBack }: AracDetailProps) {
  const [arac, setArac] = useState<Arac | null>(null);
  const [bakimlar, setBakimlar] = useState<AracBakim[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'genel' | 'bakim' | 'yakit' | 'ceza'>('genel');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [aracRes, bakimRes] = await Promise.all([
        fetch(`${API_URL}/arac-personel/arac/${id}`),
        fetch(`${API_URL}/arac-personel/arac/${id}/bakimlar`),
      ]);
      setArac(await aracRes.json());
      setBakimlar(await bakimRes.json());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!arac) {
    return (
      <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Araç bulunamadı</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={onBack} className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2">
            ← Geri
          </button>
          <h1 className="text-3xl font-bold text-gray-800">🚗 {arac.plaka || 'Araç #' + arac.id}</h1>
          <p className="text-gray-600">Araç Detay Bilgileri</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-2 mb-6 border-b">
          {[
            { id: 'genel', label: 'Genel Bilgiler', icon: '📋' },
            { id: 'bakim', label: 'Bakımlar', icon: '🔧' },
            { id: 'yakit', label: 'Yakıt', icon: '⛽' },
            { id: 'ceza', label: 'Cezalar', icon: '🚨' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'genel' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Plaka</label>
                <p className="text-lg font-semibold text-gray-800">{arac.plaka || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Araç Tescil Tarihi</label>
                <p className="text-lg font-semibold text-gray-800">
                  {arac.arac_tescil_tar ? new Date(arac.arac_tescil_tar).toLocaleDateString('tr-TR') : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Hizmet Başlangıç Tarihi</label>
                <p className="text-lg font-semibold text-gray-800">
                  {arac.hiz_bas_tar ? new Date(arac.hiz_bas_tar).toLocaleDateString('tr-TR') : '-'}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Muayene Tarihi</label>
                <p className="text-lg font-semibold text-gray-800">
                  {arac.muhayene_tar ? new Date(arac.muhayene_tar).toLocaleDateString('tr-TR') : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Sigorta Bitiş Tarihi</label>
                <p className="text-lg font-semibold text-gray-800">
                  {arac.sigorta_bit_tar ? new Date(arac.sigorta_bit_tar).toLocaleDateString('tr-TR') : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Kasko Bitiş Tarihi</label>
                <p className="text-lg font-semibold text-gray-800">
                  {arac.kasko_bit_tar ? new Date(arac.kasko_bit_tar).toLocaleDateString('tr-TR') : '-'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bakim' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Bakım Geçmişi</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                + Yeni Bakım Ekle
              </button>
            </div>
            {bakimlar.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔧</div>
                <p className="text-gray-600">Henüz bakım kaydı yok</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bakimlar.map((bakim) => (
                  <div key={bakim.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {bakim.bakim_tarihi ? new Date(bakim.bakim_tarihi).toLocaleDateString('tr-TR') : '-'}
                        </p>
                        <p className="text-sm text-gray-600">{bakim.bakim_aciklama || '-'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{bakim.bakim_tutari || '0'} ₺</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'yakit' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⛽</div>
            <p className="text-gray-600">Yakıt kayıtları yakıt takibi sayfasından görüntülenebilir</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Yakıt Takibi Sayfasına Git
            </button>
          </div>
        )}

        {activeTab === 'ceza' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚨</div>
            <p className="text-gray-600">Cezalar yakında eklenecek</p>
          </div>
        )}
      </div>
    </div>
  );
}

