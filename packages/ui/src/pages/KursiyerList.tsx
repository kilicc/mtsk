import { useState, useEffect } from 'react';
import { Kursiyer } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

interface KursiyerListProps {
  onDetailClick?: (id: number) => void;
}

export default function KursiyerList({ onDetailClick }: KursiyerListProps) {
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
    <div className="p-6 space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">👥 Kursiyer Yönetimi</h1>
          <p className="text-gray-600">Tüm kursiyerlerin listesi ve yönetimi</p>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
        >
          + Yeni Kursiyer Ekle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-2 mb-6">
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔍 Ara
          </button>
          <button
            onClick={loadKursiyerler}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            🔄 Yenile
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📊 Excel
          </button>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            🖨️ Yazdır
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Toplam: <span className="font-bold text-gray-900">{kursiyerler.length}</span> kursiyer
            </span>
            <div className="flex items-center gap-2">
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option>10</option>
                <option>30</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="text-sm text-gray-600">kayıt göster</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad Soyad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TC Kimlik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kursiyerler.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onDetailClick?.(kursiyer.id)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                        >
                          👁️ Detay
                        </button>
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium">
                          ✏️ Düzenle
                        </button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium">
                          🗑️ Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}

