import { useState, useEffect, useMemo } from 'react';
import type { KurumsalDersProgrami } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

interface FilterData {
  egitim_tarihi_baslangic: string;
  egitim_tarihi_bitis: string;
  ders_durumu: string;
  personel: string;
  arac: string;
  adi: string;
  soyadi: string;
  tc_kimlik: string;
  mevcut_belge: string;
  istedigi_sertifika: string;
  aday_no_min: string;
  aday_no_max: string;
  aday_no_durumu: string;
  genel_durum: string;
  kategori: string;
  alt_kategori: string;
  kurs_ozel_donemi: string;
  mebbis_donemi: string;
}

const initialFilters: FilterData = {
  egitim_tarihi_baslangic: '',
  egitim_tarihi_bitis: '',
  ders_durumu: '',
  personel: '',
  arac: '',
  adi: '',
  soyadi: '',
  tc_kimlik: '',
  mevcut_belge: '',
  istedigi_sertifika: '',
  aday_no_min: '',
  aday_no_max: '',
  aday_no_durumu: '',
  genel_durum: '',
  kategori: '',
  alt_kategori: '',
  kurs_ozel_donemi: '',
  mebbis_donemi: '',
};

type ExtendedDers = KurumsalDersProgrami & {
  kursiyer_adi?: string;
  kursiyer_soyadi?: string;
  kursiyer_tc?: string;
  personel_adi?: string;
  arac_plaka?: string;
};

export default function KurumsalDersListesi() {
  const [allData, setAllData] = useState<ExtendedDers[]>([]);
  const [filteredData, setFilteredData] = useState<ExtendedDers[]>([]);
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
      const [dersResponse, kursiyerResponse, personelResponse, aracResponse] = await Promise.all([
        fetch(`${API_URL}/kurumsal-ders-programi`).then(r => r.ok ? r.json() : []),
        fetch(`${API_URL}/kursiyer`).then(r => r.ok ? r.json() : []),
        fetch(`${API_URL}/arac-personel/personel`).then(r => r.ok ? r.json() : []),
        fetch(`${API_URL}/arac-personel/arac`).then(r => r.ok ? r.json() : []),
      ]);

      const dersler = Array.isArray(dersResponse) ? dersResponse : [];
      const kursiyerler = Array.isArray(kursiyerResponse) ? kursiyerResponse : [];
      const personeller = Array.isArray(personelResponse) ? personelResponse : [];
      const araclar = Array.isArray(aracResponse) ? aracResponse : [];

      const extended = dersler.map((ders: any) => {
        const kursiyer = kursiyerler.find((k: any) => k.id === ders.id_kursiyer);
        const personel = personeller.find((p: any) => p.id === ders.id_personel);
        const arac = araclar.find((a: any) => a.id === ders.id_arac);

        return {
          ...ders,
          kursiyer_adi: kursiyer?.adi,
          kursiyer_soyadi: kursiyer?.soyadi,
          kursiyer_tc: kursiyer?.tc_kimlik,
          personel_adi: personel ? `${personel.adi} ${personel.soyadi}` : undefined,
          arac_plaka: arac?.plaka,
        };
      });

      setAllData(extended);
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

      const tarih = item.tarih ? new Date(item.tarih) : undefined;
      const matchesDates =
        (filters.egitim_tarihi_baslangic
          ? (tarih ?? new Date('1900-01-01')) >= new Date(filters.egitim_tarihi_baslangic)
          : true) &&
        (filters.egitim_tarihi_bitis
          ? (tarih ?? new Date('2100-01-01')) <= new Date(filters.egitim_tarihi_bitis)
          : true);

      const durumMap: Record<number, string> = {
        0: 'Beklemede',
        1: 'Ders Yapıldı',
        2: 'Ders Yapılmadı',
        3: 'Gelmedi',
      };

      return (
        matchesDates &&
        (filters.ders_durumu
          ? durumMap[item.durum || 0] === filters.ders_durumu
          : true) &&
        (filters.personel ? contains(item.personel_adi, filters.personel) : true) &&
        (filters.arac ? contains(item.arac_plaka, filters.arac) : true) &&
        contains(item.kursiyer_adi, filters.adi) &&
        contains(item.kursiyer_soyadi, filters.soyadi) &&
        contains(item.kursiyer_tc, filters.tc_kimlik)
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

  const getDurumLabel = (durum?: number) => {
    const durumMap: Record<number, string> = {
      0: 'Beklemede',
      1: 'Ders Yapıldı',
      2: 'Ders Yapılmadı',
      3: 'Gelmedi',
    };
    return durumMap[durum || 0] || 'Bilinmiyor';
  };

  const getDurumColor = (durum?: number) => {
    if (durum === 1) return 'bg-green-100 text-green-800';
    if (durum === 2 || durum === 3) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
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
        <h1 className="text-2xl font-bold">Kurumsal Ders Programı Listesi (Kaydı açmak için çift tıklayınız.)</h1>
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
            Excel
          </button>
          <button
            onClick={() => alert('PDF export yakında eklenecek')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            PDF
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Yazdır
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eğitim Tarihi (Başlangıç)</label>
              <input
                type="date"
                value={filters.egitim_tarihi_baslangic}
                onChange={(e) => handleFilterChange('egitim_tarihi_baslangic', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eğitim Tarihi (Bitiş)</label>
              <input
                type="date"
                value={filters.egitim_tarihi_bitis}
                onChange={(e) => handleFilterChange('egitim_tarihi_bitis', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ders Durumu</label>
              <select
                value={filters.ders_durumu}
                onChange={(e) => handleFilterChange('ders_durumu', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Tümü</option>
                <option value="Beklemede">Beklemede</option>
                <option value="Ders Yapıldı">Ders Yapıldı</option>
                <option value="Ders Yapılmadı">Ders Yapılmadı</option>
                <option value="Gelmedi">Gelmedi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personel</label>
              <input
                type="text"
                value={filters.personel}
                onChange={(e) => handleFilterChange('personel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Personel adı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Araç</label>
              <input
                type="text"
                value={filters.arac}
                onChange={(e) => handleFilterChange('arac', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Araç plaka"
              />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eğitim Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eğitim Saati</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ders Durumu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TC Kimlik No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Soyadı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eğitim Yeri</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eğitim Türü</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Araç</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Personel</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={12} className="px-6 py-4 text-center text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-6 py-4 text-center text-gray-500">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.tarih ? new Date(item.tarih).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.saat || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getDurumColor(item.durum)}`}>
                        {getDurumLabel(item.durum)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kursiyer_tc || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kursiyer_adi || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kursiyer_soyadi || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.egitim_konusu || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.egitim_konusu || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.arac_plaka || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.personel_adi || '-'}</td>
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
              <option value={150}>150</option>
              <option value={300}>300</option>
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
