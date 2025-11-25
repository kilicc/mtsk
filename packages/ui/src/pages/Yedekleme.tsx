import { useState, useEffect } from 'react';
import { YedeklemeAyari, YedeklemeGecmisi } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function Yedekleme() {
  const [ayarlar, setAyarlar] = useState<YedeklemeAyari[]>([]);
  const [gecmis, setGecmis] = useState<YedeklemeGecmisi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ayarlarResponse, gecmisResponse] = await Promise.all([
        fetch(`${API_URL}/yedekleme/ayarlar`).then(r => r.json()),
        fetch(`${API_URL}/yedekleme/gecmis`).then(r => r.json()),
      ]);
      setAyarlar(ayarlarResponse);
      setGecmis(gecmisResponse);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleYedeklemeYap = async () => {
    try {
      await fetch(`${API_URL}/yedekleme/yap`, { method: 'POST' });
      await loadData();
      alert('Yedekleme başlatıldı!');
    } catch (error) {
      console.error('Error performing backup:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const gunler = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💾 Yedekleme & Otomasyon</h1>
          <p className="text-gray-600">Otomatik yedekleme ayarları ve geçmişi</p>
        </div>
        <button
          onClick={handleYedeklemeYap}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
        >
          🔄 Şimdi Yedekle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Zamanlanmış Yedekleme</h2>
          <div className="space-y-3">
            {ayarlar.map((ayar) => (
              <div key={ayar.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={ayar.aktif || false}
                    className="w-5 h-5"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{gunler[ayar.gun]}</p>
                    <p className="text-sm text-gray-600">{ayar.saat}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{ayar.yedekleme_tipi}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Yedekleme Geçmişi</h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {gecmis.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Henüz yedekleme yapılmamış</p>
            ) : (
              gecmis.map((yedek) => (
                <div key={yedek.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-800">
                      {new Date(yedek.yedekleme_tarihi).toLocaleString('tr-TR')}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        yedek.durum === 'basarili'
                          ? 'bg-green-100 text-green-800'
                          : yedek.durum === 'basarisiz'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {yedek.durum}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{yedek.yedekleme_tipi}</p>
                  {yedek.dosya_boyutu && (
                    <p className="text-xs text-gray-500">
                      {(yedek.dosya_boyutu / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

