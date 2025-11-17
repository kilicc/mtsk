import { useState, useEffect } from 'react';
import { Kursiyer } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function KursiyerList() {
  const [kursiyerler, setKursiyerler] = useState<Kursiyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadKursiyerler();
  }, []);

  const loadKursiyerler = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/kursiyer/active`);
      const data = await response.json();
      setKursiyerler(data);
    } catch (error) {
      console.error('Error loading kursiyerler:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadKursiyerler();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/kursiyer/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setKursiyerler(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Kursiyer Yönetimi</h1>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Ad, soyad veya TC ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ara
          </button>
          <button
            onClick={loadKursiyerler}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Yenile
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Yükleniyor...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad Soyad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TC Kimlik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kursiyerler.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Kursiyer bulunamadı
                  </td>
                </tr>
              ) : (
                kursiyerler.map((kursiyer) => (
                  <tr key={kursiyer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{kursiyer.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {kursiyer.adi} {kursiyer.soyadi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kursiyer.tc_kimlik || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kursiyer.telefon || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {kursiyer.kayit_tarihi ? new Date(kursiyer.kayit_tarihi).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        kursiyer.durum === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {kursiyer.durum === 1 ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

