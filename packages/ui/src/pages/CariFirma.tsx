import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

interface CariFirma {
  id: number;
  firma_adi: string;
  yetkili_kisi?: string;
  telefon?: string;
  email?: string;
  adres?: string;
  vergi_no?: string;
  vergi_dairesi?: string;
  notlar?: string;
  akt?: number;
}

export default function CariFirma() {
  const [firmalar, setFirmalar] = useState<CariFirma[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CariFirma>>({
    firma_adi: '',
    yetkili_kisi: '',
    telefon: '',
    email: '',
    adres: '',
    vergi_no: '',
    vergi_dairesi: '',
    notlar: '',
  });

  useEffect(() => {
    loadFirmalar();
  }, []);

  const loadFirmalar = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cari-firma`);
      const data = await response.json();
      setFirmalar(data || []);
    } catch (error) {
      console.error('Error loading firmalar:', error);
      setFirmalar([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id 
        ? `${API_URL}/cari-firma/${formData.id}`
        : `${API_URL}/cari-firma`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadFirmalar();
        setShowForm(false);
        setFormData({
          firma_adi: '',
          yetkili_kisi: '',
          telefon: '',
          email: '',
          adres: '',
          vergi_no: '',
          vergi_dairesi: '',
          notlar: '',
        });
      }
    } catch (error) {
      console.error('Error saving firma:', error);
      alert('Kayıt sırasında hata oluştu');
    }
  };

  const filteredFirmalar = firmalar.filter(f =>
    f.firma_adi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.yetkili_kisi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.telefon?.includes(searchTerm) ||
    f.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-gray-800">Cari / Firma Yönetimi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'İptal' : '+ Yeni Firma Ekle'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {formData.id ? 'Firma Düzenle' : 'Yeni Firma Ekle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Firma Adı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firma_adi || ''}
                  onChange={(e) => setFormData({ ...formData, firma_adi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yetkili Kişi
                </label>
                <input
                  type="text"
                  value={formData.yetkili_kisi || ''}
                  onChange={(e) => setFormData({ ...formData, yetkili_kisi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.telefon || ''}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vergi No
                </label>
                <input
                  type="text"
                  value={formData.vergi_no || ''}
                  onChange={(e) => setFormData({ ...formData, vergi_no: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vergi Dairesi
                </label>
                <input
                  type="text"
                  value={formData.vergi_dairesi || ''}
                  onChange={(e) => setFormData({ ...formData, vergi_dairesi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adres
              </label>
              <textarea
                value={formData.adres || ''}
                onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notlar
              </label>
              <textarea
                value={formData.notlar || ''}
                onChange={(e) => setFormData({ ...formData, notlar: e.target.value })}
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
                    firma_adi: '',
                    yetkili_kisi: '',
                    telefon: '',
                    email: '',
                    adres: '',
                    vergi_no: '',
                    vergi_dairesi: '',
                    notlar: '',
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
        <div className="mb-4">
          <input
            type="text"
            placeholder="Firma adı, yetkili kişi, telefon veya e-posta ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firma Adı</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yetkili Kişi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vergi No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFirmalar.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    {firmalar.length === 0 ? 'Henüz firma kaydı bulunmamaktadır.' : 'Arama sonucu bulunamadı.'}
                  </td>
                </tr>
              ) : (
                filteredFirmalar.map((firma) => (
                  <tr key={firma.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{firma.firma_adi}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{firma.yetkili_kisi || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{firma.telefon || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{firma.email || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{firma.vergi_no || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setFormData(firma);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-3"
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

