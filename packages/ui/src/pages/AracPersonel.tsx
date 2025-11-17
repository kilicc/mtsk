import { useState, useEffect } from 'react';
import { Arac, Personel } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

type Tab = 'arac' | 'personel';

export default function AracPersonel() {
  const [activeTab, setActiveTab] = useState<Tab>('arac');
  const [araclar, setAraclar] = useState<Arac[]>([]);
  const [personel, setPersonel] = useState<Personel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Arac filters
  const [aracFilters, setAracFilters] = useState({
    plaka: '',
    arac_durumu: '',
    durum: '1', // Aktif
  });

  // Personel filters
  const [personelFilters, setPersonelFilters] = useState({
    adi: '',
    soyadi: '',
    personel_no: '',
    gorev: '',
    durum: '1', // Aktif
  });

  // Fetch vehicles
  const fetchAraclar = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (aracFilters.plaka) queryParams.append('plaka', aracFilters.plaka);
      if (aracFilters.arac_durumu) queryParams.append('arac_durumu', aracFilters.arac_durumu);
      if (aracFilters.durum) queryParams.append('akt', aracFilters.durum);

      const response = await fetch(`${API_URL}/arac-personel/arac?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const data = await response.json();
      setAraclar(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch personnel
  const fetchPersonel = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (personelFilters.adi) queryParams.append('adi', personelFilters.adi);
      if (personelFilters.soyadi) queryParams.append('soyadi', personelFilters.soyadi);
      if (personelFilters.personel_no) queryParams.append('personel_no', personelFilters.personel_no);
      if (personelFilters.gorev) queryParams.append('gorev', personelFilters.gorev);
      if (personelFilters.durum) queryParams.append('akt', personelFilters.durum);

      const response = await fetch(`${API_URL}/arac-personel/personel?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch personnel');
      const data = await response.json();
      setPersonel(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'arac') {
      fetchAraclar();
    } else {
      fetchPersonel();
    }
  }, [activeTab]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Araç & Personel Yönetimi
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('arac')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'arac'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Araç İşlemleri
          </button>
          <button
            onClick={() => setActiveTab('personel')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'personel'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Personel İşlemleri
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Araç Tab */}
      {activeTab === 'arac' && (
        <div>
          {/* Filters */}
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrele</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plaka
                </label>
                <input
                  type="text"
                  value={aracFilters.plaka}
                  onChange={(e) => setAracFilters({ ...aracFilters, plaka: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Plaka ara..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <select
                  value={aracFilters.durum}
                  onChange={(e) => setAracFilters({ ...aracFilters, durum: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1">Aktif</option>
                  <option value="0">Pasif</option>
                  <option value="">Tümü</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchAraclar}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Filtrele
                </button>
              </div>
            </div>
          </div>

          {/* Vehicles Table */}
          {loading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plaka
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tescil Tarihi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Muayene Tarihi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sigorta Bitiş
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kasko Bitiş
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {araclar.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Kayıt bulunamadı
                        </td>
                      </tr>
                    ) : (
                      araclar.map((arac) => (
                        <tr key={arac.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {arac.plaka || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {arac.arac_tescil_tar
                              ? new Date(arac.arac_tescil_tar).toLocaleDateString('tr-TR')
                              : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {arac.muhayene_tar
                              ? new Date(arac.muhayene_tar).toLocaleDateString('tr-TR')
                              : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {arac.sigorta_bit_tar
                              ? new Date(arac.sigorta_bit_tar).toLocaleDateString('tr-TR')
                              : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {arac.kasko_bit_tar
                              ? new Date(arac.kasko_bit_tar).toLocaleDateString('tr-TR')
                              : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                arac.akt === 1
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {arac.akt === 1 ? 'Aktif' : 'Pasif'}
                            </span>
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
      )}

      {/* Personel Tab */}
      {activeTab === 'personel' && (
        <div>
          {/* Filters */}
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrele</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adı
                </label>
                <input
                  type="text"
                  value={personelFilters.adi}
                  onChange={(e) => setPersonelFilters({ ...personelFilters, adi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Adı ara..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soyadı
                </label>
                <input
                  type="text"
                  value={personelFilters.soyadi}
                  onChange={(e) => setPersonelFilters({ ...personelFilters, soyadi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Soyadı ara..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Görev
                </label>
                <input
                  type="text"
                  value={personelFilters.gorev}
                  onChange={(e) => setPersonelFilters({ ...personelFilters, gorev: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Görev ara..."
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchPersonel}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Filtrele
                </button>
              </div>
            </div>
          </div>

          {/* Personnel Table */}
          {loading ? (
            <div className="text-center py-8">Yükleniyor...</div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Personel No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Adı Soyadı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Telefon
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Görev
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Görev Başlangıç
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {personel.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Kayıt bulunamadı
                        </td>
                      </tr>
                    ) : (
                      personel.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {p.personel_no || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {p.adi} {p.soyadi}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {p.telefon || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {p.gorev || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {p.gorev_bas_tarihi
                              ? new Date(p.gorev_bas_tarihi).toLocaleDateString('tr-TR')
                              : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                p.akt === 1
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {p.akt === 1 ? 'Aktif' : 'Pasif'}
                            </span>
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
      )}
    </div>
  );
}

