import { useState, useEffect, useMemo } from 'react';

const API_URL = 'http://localhost:3001/api';

interface DersProgramiListItem {
  id: number;
  tc_kimlik?: string;
  adi?: string;
  soyadi?: string;
  mevcut_belge?: string;
  istedigi_sertifika?: string;
  mebbis_donemi?: string;
  ozel_donemi?: string;
  genel_durum?: string;
  modul?: 'teorik' | 'uygulama';
}

interface FilterData {
  genel_durum: string;
  modul_secimi: string;
  mebbis_donemi: string;
  adi: string;
  soyadi: string;
  tc_kimlik: string;
  mevcut_belge: string;
  istedigi_sertifika: string;
  aday_no_min: string;
  aday_no_max: string;
  aday_no_durumu: string;
  kategori: string;
  alt_kategori: string;
  kurs_ozel_donemi: string;
}

const initialFilters: FilterData = {
  genel_durum: '',
  modul_secimi: '',
  mebbis_donemi: '',
  adi: '',
  soyadi: '',
  tc_kimlik: '',
  mevcut_belge: '',
  istedigi_sertifika: '',
  aday_no_min: '',
  aday_no_max: '',
  aday_no_durumu: '',
  kategori: '',
  alt_kategori: '',
  kurs_ozel_donemi: '',
};

export default function DersProgramiListesi() {
  const [allData, setAllData] = useState<DersProgramiListItem[]>([]);
  const [filteredData, setFilteredData] = useState<DersProgramiListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterData>(initialFilters);
  const [showFilters, setShowFilters] = useState(true);
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allData]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Teorik ve Uygulama programlarını birleştir
      const [teorikResponse, uygulamaResponse] = await Promise.all([
        fetch(`${API_URL}/ders-programi/teori`).then(r => r.ok ? r.json() : []),
        fetch(`${API_URL}/ders-programi/direksiyon`).then(r => r.ok ? r.json() : []),
      ]);

      const teorikData = Array.isArray(teorikResponse) ? teorikResponse.map((item: any) => ({
        ...item,
        modul: 'teorik' as const,
      })) : [];

      const uygulamaData = Array.isArray(uygulamaResponse) ? uygulamaResponse.map((item: any) => ({
        ...item,
        modul: 'uygulama' as const,
      })) : [];

      // Kursiyer bilgilerini getir
      const kursiyerResponse = await fetch(`${API_URL}/kursiyer`).then(r => r.ok ? r.json() : []);
      const kursiyerler = Array.isArray(kursiyerResponse) ? kursiyerResponse : [];

      // Kursiyer bilgilerini birleştir
      const combined = [...teorikData, ...uygulamaData].map((item: any) => {
        const kursiyer = kursiyerler.find((k: any) => k.id === item.id_kursiyer);
        return {
          id: item.id,
          tc_kimlik: kursiyer?.tc_kimlik,
          adi: kursiyer?.adi,
          soyadi: kursiyer?.soyadi,
          mevcut_belge: kursiyer?.mevcut_belge,
          istedigi_sertifika: kursiyer?.istedigi_sertifika,
          mebbis_donemi: kursiyer?.mebbis_donemi,
          ozel_donemi: kursiyer?.kurs_ozel_donemi,
          genel_durum: item.durum === 1 ? 'Tamamlandı' : 'İşlem Devam Ediyor',
          modul: item.modul,
        };
      });

      setAllData(combined);
    } catch (error) {
      console.error('Error loading data:', error);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...allData];

    result = result.filter((item) => {
      const normalize = (value?: string) => value?.toLowerCase().trim() ?? '';
      const contains = (value?: string, query?: string) =>
        query ? normalize(value).includes(normalize(query)) : true;

      return (
        (filters.genel_durum ? item.genel_durum === filters.genel_durum : true) &&
        (filters.modul_secimi ? item.modul === filters.modul_secimi : true) &&
        (filters.mebbis_donemi ? item.mebbis_donemi === filters.mebbis_donemi : true) &&
        contains(item.adi, filters.adi) &&
        contains(item.soyadi, filters.soyadi) &&
        contains(item.tc_kimlik, filters.tc_kimlik) &&
        (filters.mevcut_belge ? item.mevcut_belge === filters.mevcut_belge : true) &&
        (filters.istedigi_sertifika ? item.istedigi_sertifika === filters.istedigi_sertifika : true) &&
        (filters.kurs_ozel_donemi ? item.ozel_donemi === filters.kurs_ozel_donemi : true)
      );
    });

    setFilteredData(result);
    setCurrentPage(1);
  };

  const handleFilterChange = (field: keyof FilterData, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedData.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ders Programı Listesi (Kaydı açmak için çift tıklayınız.)</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            {showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Yazdır
          </button>
          <button
            onClick={() => alert('Excel export yakında eklenecek')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Excel'e Aktar
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genel Durum</label>
              <select
                value={filters.genel_durum}
                onChange={(e) => handleFilterChange('genel_durum', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Tümü</option>
                <option value="İşlem Devam Ediyor">İşlem Devam Ediyor</option>
                <option value="Tamamlandı">Tamamlandı</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modül Seçimi</label>
              <select
                value={filters.modul_secimi}
                onChange={(e) => handleFilterChange('modul_secimi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Tümü</option>
                <option value="teorik">Teorik Ders Programı</option>
                <option value="uygulama">Uygulama Ders Programı</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MEBBİS Dönemi</label>
              <select
                value={filters.mebbis_donemi}
                onChange={(e) => handleFilterChange('mebbis_donemi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Tümü</option>
                <option value="2024-1">2024-1</option>
                <option value="2024-2">2024-2</option>
                <option value="2025-1">2025-1</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adı</label>
              <input
                type="text"
                value={filters.adi}
                onChange={(e) => handleFilterChange('adi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Adı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soyadı</label>
              <input
                type="text"
                value={filters.soyadi}
                onChange={(e) => handleFilterChange('soyadi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Soyadı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
              <input
                type="text"
                value={filters.tc_kimlik}
                onChange={(e) => handleFilterChange('tc_kimlik', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="TC Kimlik No"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Belge</label>
              <select
                value={filters.mevcut_belge}
                onChange={(e) => handleFilterChange('mevcut_belge', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Tümü</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İstediği Sertifika</label>
              <select
                value={filters.istedigi_sertifika}
                onChange={(e) => handleFilterChange('istedigi_sertifika', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Tümü</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Temizle
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Filtrele
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TC Kimlik No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Soyadı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mevcut Belge</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İstediği Sertifika</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MEBBİS Dönemi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Özel Dönemi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Genel Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modül</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                    Kayıt bulunamadı
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onDoubleClick={() => alert(`Detay: ${item.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="rounded border-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tc_kimlik || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.adi || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.soyadi || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.mevcut_belge || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.istedigi_sertifika || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.mebbis_donemi || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ozel_donemi || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.genel_durum === 'Tamamlandı' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.genel_durum || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.modul === 'teorik' ? 'Teorik' : 'Uygulama'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Toplam {filteredData.length} kayıt
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value={10}>10</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            <span className="text-sm text-gray-700">
              Sayfa {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
