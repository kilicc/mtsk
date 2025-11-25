import { useState } from 'react';

const API_URL = 'http://localhost:3001/api';

type SMSTab = 'tekli' | 'toplu' | 'borc';

export default function SMS() {
  const [activeTab, setActiveTab] = useState<SMSTab>('tekli');
  const [telefon, setTelefon] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [telefonlar, setTelefonlar] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleSendSingle = async () => {
    if (!telefon || !mesaj) {
      setResult({ success: false, error: 'Telefon ve mesaj zorunludur' });
      return;
    }

    if (mesaj.length > 160) {
      setResult({ success: false, error: 'Mesaj 160 karakterden uzun olamaz' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefon, mesaj }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult({ success: true, message: `SMS başarıyla gönderildi (ID: ${data.messageId})` });
        setTelefon('');
        setMesaj('');
      } else {
        setResult({ success: false, error: data.error || 'SMS gönderilemedi' });
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulk = async () => {
    const telefonList = telefonlar
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (telefonList.length === 0) {
      setResult({ success: false, error: 'En az bir telefon numarası giriniz' });
      return;
    }

    if (!mesaj) {
      setResult({ success: false, error: 'Mesaj zorunludur' });
      return;
    }

    if (mesaj.length > 160) {
      setResult({ success: false, error: 'Mesaj 160 karakterden uzun olamaz' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/sms/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefonlar: telefonList, mesaj }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult({
          success: true,
          message: `${data.success} SMS başarıyla gönderildi, ${data.failed} SMS gönderilemedi`,
        });
        setTelefonlar('');
        setMesaj('');
      } else {
        setResult({ success: false, error: data.error || 'SMS gönderilemedi' });
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSendDebtReminder = async () => {
    if (!confirm('Gecikmiş borcu olan tüm kursiyerlere SMS gönderilecek. Devam etmek istiyor musunuz?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/sms/debt-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (response.ok) {
        setResult({ success: true, message: data.message });
      } else {
        setResult({ success: false, error: data.error || 'SMS gönderilemedi' });
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">SMS Servisi</h1>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('tekli')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'tekli' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Tekli SMS
          </button>
          <button
            onClick={() => setActiveTab('toplu')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'toplu' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Toplu SMS
          </button>
          <button
            onClick={() => setActiveTab('borc')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'borc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Borç Hatırlatma SMS
          </button>
        </div>
      </div>

      {result && (
        <div className={`mb-4 p-4 rounded-lg ${
          result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {result.success ? result.message : result.error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'tekli' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon Numarası
              </label>
              <input
                type="text"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
                placeholder="05XX XXX XX XX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mesaj ({mesaj.length}/160)
              </label>
              <textarea
                value={mesaj}
                onChange={(e) => setMesaj(e.target.value)}
                placeholder="SMS mesajınızı yazın..."
                rows={5}
                maxLength={160}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={handleSendSingle}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Gönderiliyor...' : 'SMS Gönder'}
            </button>
          </div>
        )}

        {activeTab === 'toplu' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon Numaraları (Her satıra bir numara)
              </label>
              <textarea
                value={telefonlar}
                onChange={(e) => setTelefonlar(e.target.value)}
                placeholder="05XX XXX XX XX&#10;05XX XXX XX XX&#10;..."
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mesaj ({mesaj.length}/160)
              </label>
              <textarea
                value={mesaj}
                onChange={(e) => setMesaj(e.target.value)}
                placeholder="SMS mesajınızı yazın..."
                rows={5}
                maxLength={160}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={handleSendBulk}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Gönderiliyor...' : 'Toplu SMS Gönder'}
            </button>
          </div>
        )}

        {activeTab === 'borc' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Bu işlem, gecikmiş borcu olan tüm kursiyerlere otomatik olarak borç hatırlatma SMS'i gönderecektir.
              </p>
            </div>
            <button
              onClick={handleSendDebtReminder}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
            >
              {loading ? 'Gönderiliyor...' : 'Borç Hatırlatma SMS Gönder'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

