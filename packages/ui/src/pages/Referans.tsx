import { useState, useEffect } from 'react';
import type { Referans, ReferansRaporu } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function Referans() {
  const [referanslar, setReferanslar] = useState<Referans[]>([]);
  const [raporlar, setRaporlar] = useState<ReferansRaporu[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'rapor'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Referans>>({
    ref_adi: '',
    ref_soyadi: '',
    ref_telefon: '',
    ref_email: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [referansResponse, raporResponse] = await Promise.all([
        fetch(`${API_URL}/referans`).then(r => r.json()),
        fetch(`${API_URL}/referans/rapor/tum`).then(r => r.json()),
      ]);
      setReferanslar(referansResponse);
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
        ? `${API_URL}/referans/${formData.id}`
        : `${API_URL}/referans`;
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      setIsModalOpen(false);
      setFormData({ ref_adi: '', ref_soyadi: '', ref_telefon: '', ref_email: '' });
      await loadData();
    } catch (error) {
      console.error('Error saving referans:', error);
    }
  };

  const filteredReferanslar = referanslar.filter((ref) =>
    `${ref.ref_adi} ${ref.ref_soyadi}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🔗 Referans İşlemleri</h1>
          <p className="text-gray-600">Referans yönetimi ve komisyon takibi</p>
        </div>
        <button
          onClick={() => {
            setFormData({ ref_adi: '', ref_soyadi: '', ref_telefon: '', ref_email: '' });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
        >
          + Yeni Referans
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
          Referans Listesi
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
          <div className="mb-4">
            <input
              type="text"
              placeholder="Referans ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReferanslar.map((ref) => (
              <div
                key={ref.id}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {ref.ref_adi} {ref.ref_soyadi}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  {ref.ref_telefon && <p>📞 {ref.ref_telefon}</p>}
                  {ref.ref_email && <p>✉️ {ref.ref_email}</p>}
                  {ref.ref_kayit_tarihi && (
                    <p>📅 {new Date(ref.ref_kayit_tarihi).toLocaleDateString('tr-TR')}</p>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Düzenle
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Rapor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referans</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursiyer Sayısı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Son Kursiyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {raporlar.map((rapor) => (
                  <tr key={rapor.id_referans} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {rapor.ref_adi} {rapor.ref_soyadi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                        {rapor.kursiyer_sayisi}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {rapor.son_kursiyer_tarihi
                        ? new Date(rapor.son_kursiyer_tarihi).toLocaleDateString('tr-TR')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Detay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Yeni Referans</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                  <input
                    type="text"
                    value={formData.ref_adi}
                    onChange={(e) => setFormData({ ...formData, ref_adi: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                  <input
                    type="text"
                    value={formData.ref_soyadi}
                    onChange={(e) => setFormData({ ...formData, ref_soyadi: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="text"
                  value={formData.ref_telefon}
                  onChange={(e) => setFormData({ ...formData, ref_telefon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input
                  type="email"
                  value={formData.ref_email}
                  onChange={(e) => setFormData({ ...formData, ref_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
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

