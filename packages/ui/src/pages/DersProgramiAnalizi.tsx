import { useState, useEffect, useMemo } from 'react';

const API_URL = 'http://localhost:3001/api';

interface AnalizItem {
  tc_kimlik?: string;
  kursiyer_adi?: string;
  egitim_turu?: string;
  ders_adi?: string;
  toplam_ders?: number;
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

export default function DersProgramiAnalizi() {
  const [allData, setAllData] = useState<AnalizItem[]>([]);
  const [filteredData, setFilteredData] = useState<AnalizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterData>(initialFilters);
  const [showFilters, setShowFilters] = useState(true);
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allData]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Teorik ve Uygulama programlarını getir ve analiz et
      const [teorikResponse, uygulamaResponse, kursiyerResponse] = await Promise.all([
        fetch(`${API_URL}/ders-programi/teori`).then(r => r.ok ? r.json() : []),
        fetch(`${API_URL}/ders-programi/direksiyon`).then(r => r.ok ? r.json() : []),
        fetch(`${API_URL}/kursiyer`).then(r => r.ok ? r.json() : []),
      ]);

      const teorikData = Array.isArray(teorikResponse) ? teorikResponse : [];
      const uygulamaData = Array.isArray(uygulamaResponse) ? uygulamaResponse : [];
      const kursiyerler = Array.isArray(kursiyerResponse) ? kursiyerResponse : [];

      // Kursiyer bazında analiz oluştur
      const analizMap = new Map<string, AnalizItem>();

      teorikData.forEach((item: any) => {
        const kursiyer = kursiyerler.find((k: any) => k.id === item.id_kursiyer);
        const key = `${item.id_kursiyer}_teorik`;
        if (!analizMap.has(key)) {
          analizMap.set(key, {
            tc_kimlik: kursiyer?.tc_kimlik,
            kursiyer_adi: kursiyer ? `${kursiyer.adi} ${kursiyer.soyadi}` : undefined,
            egitim_turu: 'Teorik',
            ders_adi: item.konu || item.ders_turu || 'Teorik Ders',
            toplam_ders: 0,
          });
        }
        const analiz = analizMap.get(key)!;
        analiz.toplam_ders = (analiz.toplam_ders || 0) + 1;
      });

      uygulamaData.forEach((item: any) => {
        const kursiyer = kursiyerler.find((k: any) => k.id === item.id_kursiyer);
        const key = `${item.id_kursiyer}_uygulama`;
        if (!analizMap.has(key)) {
          analizMap.set(key, {
            tc_kimlik: kursiyer?.tc_kimlik,
            kursiyer_adi: kursiyer ? `${kursiyer.adi} ${kursiyer.soyadi}` : undefined,
            egitim_turu: 'Uygulama',
            ders_adi: 'Uygulama Ders',
            toplam_ders: 0,
          });
        }
        const analiz = analizMap.get(key)!;
        analiz.toplam_ders = (analiz.toplam_ders || 0) + 1;
      });

      setAllData(Array.from(analizMap.values()));
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

      const [adi, soyadi] = (item.kursiyer_adi || '').split(' ');

      return (
        (filters.modul_secimi ? item.egitim_turu?.toLowerCase() === filters.modul_secimi.toLowerCase() : true) &&
        contains(adi, filters.adi) &&
        contains(soyadi, filters.soyadi) &&
        contains(item.tc_kimlik, filters.tc_kimlik)
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

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ders Programı Analizi</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            {showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TC Kimlik No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursiyer Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eğitim Türü</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ders Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Ders</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Kayıt bulunamadı
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tc_kimlik || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kursiyer_adi || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.egitim_turu || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ders_adi || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.toplam_ders || 0}</td>
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
