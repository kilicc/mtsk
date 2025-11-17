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
    <div className="p-6 space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">👥 Kursiyer Yönetimi</h1>
          <p className="text-sm text-gray-500">Tüm kursiyerlerin listesi ve yönetimi</p>
        </div>
        <button
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md text-sm"
        >
          + Yeni Ekle
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Ad, soyad veya TC ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            🔍 Ara
          </button>
          <button
            onClick={loadKursiyerler}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            🔄
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            📊
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            🖨️
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              Toplam: <span className="font-semibold text-gray-800">{kursiyerler.length}</span> kursiyer
            </span>
            <div className="flex items-center gap-2">
              <select className="px-2 py-1 border border-gray-300 rounded text-xs bg-white">
                <option>10</option>
                <option>30</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ad Soyad</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">TC Kimlik</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Telefon</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Kayıt Tarihi</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Durum</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">İşlemler</th>
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
                  <tr key={kursiyer.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{kursiyer.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {kursiyer.adi} {kursiyer.soyadi}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{kursiyer.tc_kimlik || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{kursiyer.telefon || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {kursiyer.kayit_tarihi ? new Date(kursiyer.kayit_tarihi).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${
                        kursiyer.durum === 1 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {kursiyer.durum === 1 ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onDetailClick?.(kursiyer.id)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-xs font-medium border border-blue-200"
                        >
                          Detay
                        </button>
                        <button className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors text-xs font-medium border border-gray-200">
                          Düzenle
                        </button>
                        <button className="px-2.5 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-xs font-medium border border-red-200">
                          Sil
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

