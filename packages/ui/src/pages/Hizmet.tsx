import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

interface Hizmet {
  id: number;
  hizmet_adi: string;
  hizmet_tipi?: string;
  birim_fiyat?: number;
  aciklama?: string;
  akt?: number;
}

export default function Hizmet() {
  const [hizmetler, setHizmetler] = useState<Hizmet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Hizmet>>({
    hizmet_adi: '',
    hizmet_tipi: '',
    birim_fiyat: 0,
    aciklama: '',
  });

  useEffect(() => {
    loadHizmetler();
  }, []);

  const loadHizmetler = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/hizmet`);
      const data = await response.json();
      setHizmetler(data || []);
    } catch (error) {
      console.error('Error loading hizmetler:', error);
      setHizmetler([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id 
        ? `${API_URL}/hizmet/${formData.id}`
        : `${API_URL}/hizmet`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadHizmetler();
        setShowForm(false);
        setFormData({
          hizmet_adi: '',
          hizmet_tipi: '',
          birim_fiyat: 0,
          aciklama: '',
        });
      }
    } catch (error) {
      console.error('Error saving hizmet:', error);
      alert('Kayıt sırasında hata oluştu');
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Hizmet Yönetimi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'İptal' : '+ Yeni Hizmet Ekle'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {formData.id ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hizmet Adı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.hizmet_adi || ''}
                  onChange={(e) => setFormData({ ...formData, hizmet_adi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hizmet Tipi
                </label>
                <input
                  type="text"
                  value={formData.hizmet_tipi || ''}
                  onChange={(e) => setFormData({ ...formData, hizmet_tipi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birim Fiyat
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.birim_fiyat || 0}
                  onChange={(e) => setFormData({ ...formData, birim_fiyat: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                value={formData.aciklama || ''}
                onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {formData.id ? 'Güncelle' : 'Kaydet'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    hizmet_adi: '',
                    hizmet_tipi: '',
                    birim_fiyat: 0,
                    aciklama: '',
                  });
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hizmet Adı</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hizmet Tipi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Birim Fiyat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hizmetler.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Henüz hizmet kaydı bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                hizmetler.map((hizmet) => (
                  <tr key={hizmet.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{hizmet.hizmet_adi}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{hizmet.hizmet_tipi || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {hizmet.birim_fiyat?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{hizmet.aciklama || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setFormData(hizmet);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Düzenle
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

