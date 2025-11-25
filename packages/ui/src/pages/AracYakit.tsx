import { useState, useEffect } from 'react';
import type { AracYakit, AracYakitRaporu } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function AracYakit() {
  const [yakitlar, setYakitlar] = useState<AracYakit[]>([]);
  const [araclar, setAraclar] = useState<any[]>([]);
  const [raporlar, setRaporlar] = useState<AracYakitRaporu[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'rapor'>('list');
  const [formData, setFormData] = useState<Partial<AracYakit>>({
    id_arac: undefined,
    yakit_tarihi: new Date().toISOString().split('T')[0],
    yakit_tutari: 0,
    yakit_miktari: 0,
    yakit_tipi: 'Benzin',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [yakitResponse, aracResponse, raporResponse] = await Promise.all([
        fetch(`${API_URL}/arac-yakit`).then(r => r.json()),
        fetch(`${API_URL}/arac-personel/arac`).then(r => r.json()),
        fetch(`${API_URL}/arac-yakit/rapor/tum`).then(r => r.json()),
      ]);
      setYakitlar(yakitResponse);
      setAraclar(aracResponse);
      setRaporlar(raporResponse);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id
        ? `${API_URL}/arac-yakit/${formData.id}`
        : `${API_URL}/arac-yakit`;
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      setIsModalOpen(false);
      setFormData({
        id_arac: undefined,
        yakit_tarihi: new Date().toISOString().split('T')[0],
        yakit_tutari: 0,
        yakit_miktari: 0,
        yakit_tipi: 'Benzin',
      });
      await loadData();
    } catch (error) {
      console.error('Error saving yakit:', error);
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
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">⛽ Araç Yakıt Takibi</h1>
          <p className="text-gray-600">Yakıt tüketimi ve maliyet takibi</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              id_arac: undefined,
              yakit_tarihi: new Date().toISOString().split('T')[0],
              yakit_tutari: 0,
              yakit_miktari: 0,
              yakit_tipi: 'Benzin',
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
        >
          + Yeni Yakıt Kaydı
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'list'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Yakıt Kayıtları
        </button>
        <button
          onClick={() => setActiveTab('rapor')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'rapor'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Raporlar
        </button>
      </div>

      {activeTab === 'list' ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Araç</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Miktar (L)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">L/100km</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {yakitlar.map((yakit) => (
                  <tr key={yakit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {araclar.find(a => a.id === yakit.id_arac)?.plaka || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(yakit.yakit_tarihi).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {yakit.yakit_tutari?.toFixed(2)} ₺
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{yakit.yakit_miktari} L</td>
                    <td className="px-6 py-4 whitespace-nowrap">{yakit.yakit_tipi}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {yakit.km_fark || '-'} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {yakit.litre_basina_km ? (100 / yakit.litre_basina_km).toFixed(2) : '-'} L/100km
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {raporlar.map((rapor) => (
            <div key={rapor.id_arac} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{rapor.plaka || 'Araç #' + rapor.id_arac}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Tutar:</span>
                  <span className="font-bold">{rapor.toplam_yakit_tutari.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Miktar:</span>
                  <span className="font-bold">{rapor.toplam_yakit_miktari.toFixed(2)} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ortalama Tüketim:</span>
                  <span className="font-bold">
                    {rapor.ortalama_litre_basina_km ? (100 / rapor.ortalama_litre_basina_km).toFixed(2) : '-'} L/100km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kayıt Sayısı:</span>
                  <span className="font-bold">{rapor.kayit_sayisi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Yeni Yakıt Kaydı</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Araç</label>
                <select
                  value={formData.id_arac || ''}
                  onChange={(e) => setFormData({ ...formData, id_arac: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Seçiniz</option>
                  {araclar.map((arac) => (
                    <option key={arac.id} value={arac.id}>
                      {arac.plaka || 'Araç #' + arac.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                <input
                  type="date"
                  value={typeof formData.yakit_tarihi === 'string' ? formData.yakit_tarihi : ''}
                  onChange={(e) => setFormData({ ...formData, yakit_tarihi: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tutar (₺)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.yakit_tutari || ''}
                    onChange={(e) => setFormData({ ...formData, yakit_tutari: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Miktar (L)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.yakit_miktari || ''}
                    onChange={(e) => setFormData({ ...formData, yakit_miktari: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yakıt Tipi</label>
                <select
                  value={formData.yakit_tipi || 'Benzin'}
                  onChange={(e) => setFormData({ ...formData, yakit_tipi: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Benzin">Benzin</option>
                  <option value="Dizel">Dizel</option>
                  <option value="LPG">LPG</option>
                  <option value="Elektrik">Elektrik</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

