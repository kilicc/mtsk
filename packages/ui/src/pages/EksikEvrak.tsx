import { useState, useEffect } from 'react';
import type { EksikEvrakRaporu } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function EksikEvrak() {
  const [rapor, setRapor] = useState<EksikEvrakRaporu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRapor();
  }, []);

  const loadRapor = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/eksik-evrak/rapor`);
      const data = await response.json();
      setRapor(data);
    } catch (error) {
      console.error('Error loading eksik evrak raporu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRapor = rapor.filter((item) =>
    `${item.adi} ${item.soyadi}`.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">📄 Eksik Evrak Takibi</h1>
        <p className="text-gray-600">Eksik evrakları olan kursiyerlerin listesi</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Kursiyer ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-semibold">
              Toplam: {filteredRapor.length} kursiyer
            </div>
          </div>
        </div>

        {filteredRapor.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-gray-600 text-lg">Tüm evraklar tamamlanmış!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kursiyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eksik Evraklar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRapor.map((item) => (
                  <tr key={item.id_kursiyer} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {item.adi} {item.soyadi}
                      </div>
                      {item.tc_kimlik && (
                        <div className="text-sm text-gray-500">TC: {item.tc_kimlik}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.telefon && (
                        <div className="text-sm text-gray-900">📞 {item.telefon}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {item.eksik_evraklar.map((evrak: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                          >
                            {evrak}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Detay
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        SMS Gönder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

