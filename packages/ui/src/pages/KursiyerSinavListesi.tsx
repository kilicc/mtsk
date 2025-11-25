import { useEffect, useState } from 'react';
import type { Kursiyer } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

type FilterTab = 'f1' | 'f2' | 'f3' | 's1';

type ExtendedKursiyer = Kursiyer & {
  mevcut_belge?: string;
  istedigi_sertifika?: string;
  aday_no?: string;
  teorik_sinav_notu?: number;
  teorik_sinav_durumu?: string;
  uygulama_sinav_durumu?: string;
};

interface KursiyerSinavListesiProps {
  onDetailClick?: (id: number) => void;
}

interface FilterData {
  adi: string;
  soyadi: string;
  tc_kimlik: string;
  cep_telefonu: string;
  mevcut_belge: string;
  istedigi_sertifika: string;
  aday_no_min: string;
  aday_no_max: string;
  aday_no_durumu: string;
  genel_durum: string;
  kategori: string;
  alt_kategori: string;
  kurs_ozel_donemi: string;
  referans_grubu: string;
  donem_secimi: string;
  mebbis_donemi: string;
  bakiye_turu: string;
  bakiye_tutari_min: string;
  bakiye_tutari_max: string;
  bakiyesi_olanlari_goster: boolean;
  ayni_tc_olanlari_goster: boolean;
  bugun_dogum_gunu_olanlar: boolean;
  siralama_alani: string;
  siralama_yonu: 'asc' | 'desc';
}

const initialFilters: FilterData = {
  adi: '',
  soyadi: '',
  tc_kimlik: '',
  cep_telefonu: '',
  mevcut_belge: '',
  istedigi_sertifika: '',
  aday_no_min: '',
  aday_no_max: '',
  aday_no_durumu: '',
  genel_durum: '',
  kategori: '',
  alt_kategori: '',
  kurs_ozel_donemi: '',
  referans_grubu: '',
  donem_secimi: '',
  mebbis_donemi: '',
  bakiye_turu: '',
  bakiye_tutari_min: '',
  bakiye_tutari_max: '',
  bakiyesi_olanlari_goster: false,
  ayni_tc_olanlari_goster: false,
  bugun_dogum_gunu_olanlar: false,
  siralama_alani: '',
  siralama_yonu: 'asc',
};

export default function KursiyerSinavListesi({ onDetailClick }: KursiyerSinavListesiProps) {
  const [allKursiyerler, setAllKursiyerler] = useState<ExtendedKursiyer[]>([]);
  const [filteredKursiyerler, setFilteredKursiyerler] = useState<ExtendedKursiyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('f1');
  const [showFilters, setShowFilters] = useState(true);
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<FilterData>(initialFilters);
  const [savedFilters, setSavedFilters] = useState<Array<{ id: number; name: string; data: FilterData }>>([]);
  const [showFilterBasket, setShowFilterBasket] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [showPrintMenu, setShowPrintMenu] = useState(false);

  useEffect(() => {
    loadKursiyerler();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allKursiyerler]);

  const loadKursiyerler = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/kursiyer`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const extendedData: ExtendedKursiyer[] = (data.length > 0 ? data : getMockKursiyerler()).map((k: any) => ({
        ...k,
        mevcut_belge: k.mevcut_belge || ['M', 'A1', 'A2', 'B', 'C'][Math.floor(Math.random() * 5)],
        istedigi_sertifika: k.istedigi_sertifika || ['A1', 'A2', 'B', 'C', 'D'][Math.floor(Math.random() * 5)],
        aday_no: k.aday_no || String(Math.floor(Math.random() * 10000) + 1000),
        teorik_sinav_notu: k.teorik_sinav_notu || (Math.random() > 0.3 ? Math.floor(Math.random() * 40) + 60 : undefined),
        teorik_sinav_durumu: k.teorik_sinav_durumu || (Math.random() > 0.5 ? 'Başarılı' : 'Beklemede'),
        uygulama_sinav_durumu: k.uygulama_sinav_durumu || (Math.random() > 0.5 ? 'Başarılı' : 'Beklemede'),
      }));
      setAllKursiyerler(extendedData);
    } catch (error) {
      console.error('Error loading kursiyerler:', error);
      setAllKursiyerler(getMockKursiyerler());
    } finally {
      setLoading(false);
    }
  };

  const getMockKursiyerler = (): ExtendedKursiyer[] => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      adi: ['Ahmet', 'Ayşe', 'Mehmet', 'Fatma', 'Ali', 'Zeynep', 'Mustafa', 'Elif'][i % 8],
      soyadi: ['Yılmaz', 'Demir', 'Kaya', 'Şahin', 'Çelik', 'Arslan', 'Öztürk', 'Aydın'][Math.floor(i / 8)],
      tc_kimlik: String(10000000000 + i),
      telefon: `0532${String(1000000 + i).slice(-7)}`,
      email: `kursiyer${i + 1}@example.com`,
      adres: `Adres ${i + 1}`,
      dogum_tarihi: new Date(1990 + (i % 30), i % 12, (i % 28) + 1).toISOString(),
      kayit_tarihi: new Date(2024, 0, (i % 30) + 1).toISOString(),
      durum: i % 3 === 0 ? 0 : 1,
      mevcut_belge: ['M', 'A1', 'A2', 'B', 'C'][i % 5],
      istedigi_sertifika: ['A1', 'A2', 'B', 'C', 'D'][i % 5],
      aday_no: String(1000 + i),
      teorik_sinav_notu: Math.random() > 0.3 ? Math.floor(Math.random() * 40) + 60 : undefined,
      teorik_sinav_durumu: ['Başarılı', 'Başarısız', 'Beklemede'][i % 3],
      uygulama_sinav_durumu: ['Başarılı', 'Başarısız', 'Beklemede'][(i + 1) % 3],
    }));
  };

  const applyFilters = () => {
    let result = [...allKursiyerler];

    if (filters.adi) {
      result = result.filter(k => k.adi.toLowerCase().includes(filters.adi.toLowerCase()));
    }
    if (filters.soyadi) {
      result = result.filter(k => k.soyadi.toLowerCase().includes(filters.soyadi.toLowerCase()));
    }
    if (filters.tc_kimlik) {
      result = result.filter(k => k.tc_kimlik?.includes(filters.tc_kimlik));
    }
    if (filters.cep_telefonu) {
      result = result.filter(k => k.telefon?.includes(filters.cep_telefonu));
    }
    if (filters.mevcut_belge) {
      result = result.filter(k => k.mevcut_belge === filters.mevcut_belge);
    }
    if (filters.istedigi_sertifika) {
      result = result.filter(k => k.istedigi_sertifika === filters.istedigi_sertifika);
    }
    if (filters.aday_no_min) {
      result = result.filter(k => k.aday_no && parseInt(k.aday_no) >= parseInt(filters.aday_no_min));
    }
    if (filters.aday_no_max) {
      result = result.filter(k => k.aday_no && parseInt(k.aday_no) <= parseInt(filters.aday_no_max));
    }
    if (filters.aday_no_durumu === 'yok') {
      result = result.filter(k => !k.aday_no || k.aday_no === '');
    } else if (filters.aday_no_durumu === 'var') {
      result = result.filter(k => k.aday_no && k.aday_no !== '');
    }
    if (filters.genel_durum === 'devam') {
      result = result.filter(k => k.durum === 1);
    } else if (filters.genel_durum === 'tamamlandi') {
      result = result.filter(k => k.durum === 0);
    }
    if (filters.bakiyesi_olanlari_goster) {
      result = result.filter(k => (k as any).bakiyesi && (k as any).bakiyesi > 0);
    }
    if (filters.ayni_tc_olanlari_goster) {
      const tcCounts = result.reduce((acc, k) => {
        acc[k.tc_kimlik || ''] = (acc[k.tc_kimlik || ''] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      result = result.filter(k => tcCounts[k.tc_kimlik || ''] > 1);
    }
    if (filters.bugun_dogum_gunu_olanlar) {
      const today = new Date();
      result = result.filter(k => {
        if (!k.dogum_tarihi) return false;
        const birthDate = new Date(k.dogum_tarihi);
        return birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate();
      });
    }

    if (filters.siralama_alani) {
      result.sort((a, b) => {
        let aVal: any = (a as any)[filters.siralama_alani as keyof ExtendedKursiyer];
        let bVal: any = (b as any)[filters.siralama_alani as keyof ExtendedKursiyer];
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = (bVal || '').toLowerCase();
        }
        if (filters.siralama_yonu === 'asc') {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
      });
    }

    setFilteredKursiyerler(result);
  };

  const handleFilter = () => {
    applyFilters();
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleSaveFilter = () => {
    const name = prompt('Filtre adı:');
    if (name) {
      const newFilter = { id: Date.now(), name, data: { ...filters } };
      setSavedFilters([...savedFilters, newFilter]);
      alert('Filtre kaydedildi!');
    }
  };

  const handleLoadFilter = (filter: { id: number; name: string; data: FilterData }) => {
    setFilters(filter.data);
    setShowFilterBasket(false);
  };

  const handleSmsSend = () => {
    if (selectedIds.size === 0) {
      alert('Lütfen en az bir kursiyer seçin.');
      return;
    }
    alert(`${selectedIds.size} kursiyere SMS gönderilecek. (Yakında)`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.size === 0) {
      alert('Lütfen en az bir kursiyer seçin.');
      return;
    }
    alert(`${action} işlemi ${selectedIds.size} kursiyer için uygulanacak. (Yakında)`);
    setShowBulkMenu(false);
  };

  const handleExport = (format: 'excel' | 'pdf' | 'print') => {
    if (format === 'excel') {
      alert('Excel\'e aktarılıyor... (Yakında)');
    } else if (format === 'pdf') {
      alert('PDF\'e aktarılıyor... (Yakında)');
    } else {
      window.print();
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageStart = (currentPage - 1) * pageSize;
      const pageEnd = pageStart + pageSize;
      const pageIds = filteredKursiyerler.slice(pageStart, pageEnd).map(k => k.id);
      setSelectedIds(new Set([...selectedIds, ...pageIds]));
    } else {
      const pageStart = (currentPage - 1) * pageSize;
      const pageEnd = pageStart + pageSize;
      const pageIds = filteredKursiyerler.slice(pageStart, pageEnd).map(k => k.id);
      const newSelected = new Set(selectedIds);
      pageIds.forEach(id => newSelected.delete(id));
      setSelectedIds(newSelected);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const totalPages = Math.ceil(filteredKursiyerler.length / pageSize);
  const paginatedKursiyerler = filteredKursiyerler.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const pageStart = (currentPage - 1) * pageSize;
  const pageSelectedCount = paginatedKursiyerler.filter(k => selectedIds.has(k.id)).length;

  const filterTabs = [
    { id: 'f1' as FilterTab, label: 'F-1', description: 'Temel Filtreler' },
    { id: 'f2' as FilterTab, label: 'F-2', description: 'Ek Filtreler' },
    { id: 'f3' as FilterTab, label: 'F-3', description: 'Ek Filtreler' },
    { id: 's1' as FilterTab, label: 'S-1', description: 'Sıralama' },
  ];

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="card">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Kursiyer Sınav Listesi
        </h1>
        <p className="text-sm text-gray-500">Kaydı açmak için çift tıklayınız.</p>
      </div>

      {/* Üst Toolbar */}
      <div className="card flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleSmsSend} className="btn btn-outline text-sm">
            SMS Gönder
          </button>
          <div className="relative">
            <button
              onClick={() => setShowBulkMenu(!showBulkMenu)}
              className="btn btn-outline text-sm"
            >
              Toplu İşlem
            </button>
            {showBulkMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px]">
                <button
                  onClick={() => handleBulkAction('Durumu toplu güncelle')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Durumu toplu güncelle
                </button>
                <button
                  onClick={() => handleBulkAction('MEBBİS\'e toplu gönder')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  MEBBİS'e toplu gönder
                </button>
                <button
                  onClick={() => handleBulkAction('SMS gönder')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  SMS gönder
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowPrintMenu(!showPrintMenu)}
              className="btn btn-outline text-sm"
            >
              Yazdır
            </button>
            {showPrintMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px]">
                <button
                  onClick={() => handleExport('print')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Yazdır
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  PDF'e Aktar
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Excel'e Aktar
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowFilterBasket(!showFilterBasket)}
            className="btn btn-outline text-sm"
          >
            Filtre Sepeti
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="btn btn-outline text-sm"
          >
            ⏮️
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-outline text-sm"
          >
            ⏪
          </button>
          <span className="text-sm text-gray-600 px-2">
            Sayfa {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="btn btn-outline text-sm"
          >
            ⏩
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage >= totalPages}
            className="btn btn-outline text-sm"
          >
            ⏭️
          </button>
        </div>
      </div>

      {/* Filtre Sepeti */}
      {showFilterBasket && savedFilters.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Kayıtlı Filtreler</h3>
            <button
              onClick={() => setShowFilterBasket(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            {savedFilters.map(filter => (
              <div key={filter.id} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                <span className="text-sm text-gray-700">{filter.name}</span>
                <button
                  onClick={() => handleLoadFilter(filter)}
                  className="btn btn-outline text-xs"
                >
                  Yükle
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtreleme Bölümü */}
      {showFilters && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Filtreleme</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-200">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilterTab(tab.id)}
                className={`px-4 py-2 font-medium transition-all ${
                  activeFilterTab === tab.id
                    ? 'border-b-2 border-gray-900 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} - {tab.description}
              </button>
            ))}
          </div>

          {/* F-1 Tab Content - KursiyerListesi ile aynı */}
          {activeFilterTab === 'f1' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-adi">Adı</label>
                <input
                  id="sinav-f1-adi"
                  type="text"
                  value={filters.adi}
                  onChange={(e) => setFilters({ ...filters, adi: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-soyadi">Soyadı</label>
                <input
                  id="sinav-f1-soyadi"
                  type="text"
                  value={filters.soyadi}
                  onChange={(e) => setFilters({ ...filters, soyadi: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-tc">TC Kimlik No</label>
                <input
                  id="sinav-f1-tc"
                  type="text"
                  value={filters.tc_kimlik}
                  onChange={(e) => setFilters({ ...filters, tc_kimlik: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-tel">Cep Telefonu</label>
                <input
                  id="sinav-f1-tel"
                  type="text"
                  value={filters.cep_telefonu}
                  onChange={(e) => setFilters({ ...filters, cep_telefonu: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-mevcut-belge">Mevcut Belge</label>
                <select
                  id="sinav-f1-mevcut-belge"
                  value={filters.mevcut_belge}
                  onChange={(e) => setFilters({ ...filters, mevcut_belge: e.target.value })}
                  className="input"
                >
                  <option value="">Tümü</option>
                  <option value="M">M</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-istenen">İstediği Sertifika</label>
                <select
                  id="sinav-f1-istenen"
                  value={filters.istedigi_sertifika}
                  onChange={(e) => setFilters({ ...filters, istedigi_sertifika: e.target.value })}
                  className="input"
                >
                  <option value="">Tümü</option>
                  <option value="M">M</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-aday-min">Aday No (Min)</label>
                <input
                  id="sinav-f1-aday-min"
                  type="number"
                  value={filters.aday_no_min}
                  onChange={(e) => setFilters({ ...filters, aday_no_min: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-aday-max">Aday No (Max)</label>
                <input
                  id="sinav-f1-aday-max"
                  type="number"
                  value={filters.aday_no_max}
                  onChange={(e) => setFilters({ ...filters, aday_no_max: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-aday-durum">Aday No Durumu</label>
                <select
                  id="sinav-f1-aday-durum"
                  value={filters.aday_no_durumu}
                  onChange={(e) => setFilters({ ...filters, aday_no_durumu: e.target.value })}
                  className="input"
                >
                  <option value="">Tümü</option>
                  <option value="yok">Aday No Olmayanları Getir</option>
                  <option value="var">Aday No Olanları Getir</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-genel-durum">Genel Durum</label>
                <select
                  id="sinav-f1-genel-durum"
                  value={filters.genel_durum}
                  onChange={(e) => setFilters({ ...filters, genel_durum: e.target.value })}
                  className="input"
                >
                  <option value="">Tümü</option>
                  <option value="devam">İşlem Devam Ediyor</option>
                  <option value="tamamlandi">Tamamlandı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-kategori">Kategori</label>
                <select
                  id="sinav-f1-kategori"
                  value={filters.kategori}
                  onChange={(e) => setFilters({ ...filters, kategori: e.target.value })}
                  className="input"
                >
                  <option value="">Tümü</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-alt-kategori">Alt Kategori</label>
                <select
                  id="sinav-f1-alt-kategori"
                  value={filters.alt_kategori}
                  onChange={(e) => setFilters({ ...filters, alt_kategori: e.target.value })}
                  className="input"
                  disabled={!filters.kategori}
                >
                  <option value="">Öncelikle Kategori Seçiniz</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-ozel-donem">Kurs Özel Dönemi</label>
                <select
                  id="sinav-f1-ozel-donem"
                  value={filters.kurs_ozel_donemi}
                  onChange={(e) => setFilters({ ...filters, kurs_ozel_donemi: e.target.value })}
                  className="input"
                >
                  <option value="">Tümü</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-referans">Referans Grubu</label>
                <select
                  id="sinav-f1-referans"
                  value={filters.referans_grubu}
                  onChange={(e) => setFilters({ ...filters, referans_grubu: e.target.value })}
                  className="input"
                >
                  <option value="">Seçiniz</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-donem">Dönem Seçimi</label>
                <select
                  id="sinav-f1-donem"
                  value={filters.donem_secimi}
                  onChange={(e) => setFilters({ ...filters, donem_secimi: e.target.value })}
                  className="input"
                >
                  <option value="">Hızlı Dönem Seçimi</option>
                  <option value="elle">Elle Dönem Seçimi</option>
                  <option value="secilmemis">Seçilmemiş Olanlar</option>
                  <option value="secilmis">Seçilmiş Olanlar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-mebbis">Mebbis Dönemi</label>
                <button className="btn btn-outline w-full" onClick={() => alert('MEBBİS dönem seçimi yakında.')}>
                  Seçili Yok
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-bakiye-turu">Bakiye Türü</label>
                <select
                  id="sinav-f1-bakiye-turu"
                  value={filters.bakiye_turu}
                  onChange={(e) => setFilters({ ...filters, bakiye_turu: e.target.value })}
                  className="input"
                >
                  <option value="">Tümü</option>
                  <option value="borc">Borç</option>
                  <option value="alacak">Alacak</option>
                  <option value="sifir">Sıfır</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-bakiye-min">Bakiye Tutarı (Min)</label>
                <input
                  id="sinav-f1-bakiye-min"
                  type="number"
                  step="0.01"
                  value={filters.bakiye_tutari_min}
                  onChange={(e) => setFilters({ ...filters, bakiye_tutari_min: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-f1-bakiye-max">Bakiye Tutarı (Max)</label>
                <input
                  id="sinav-f1-bakiye-max"
                  type="number"
                  step="0.01"
                  value={filters.bakiye_tutari_max}
                  onChange={(e) => setFilters({ ...filters, bakiye_tutari_max: e.target.value })}
                  className="input"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sinav-f1-bakiye-goster"
                  checked={filters.bakiyesi_olanlari_goster}
                  onChange={(e) => setFilters({ ...filters, bakiyesi_olanlari_goster: e.target.checked })}
                  className="w-4 h-4 text-gray-600"
                />
                <label className="ml-2 text-sm text-gray-700" htmlFor="sinav-f1-bakiye-goster">Bakiyesi Olanları Göster</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sinav-f1-ayni-tc"
                  checked={filters.ayni_tc_olanlari_goster}
                  onChange={(e) => setFilters({ ...filters, ayni_tc_olanlari_goster: e.target.checked })}
                  className="w-4 h-4 text-gray-600"
                />
                <label className="ml-2 text-sm text-gray-700" htmlFor="sinav-f1-ayni-tc">Aynı TC Olanları Göster</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sinav-f1-dogum-gunu"
                  checked={filters.bugun_dogum_gunu_olanlar}
                  onChange={(e) => setFilters({ ...filters, bugun_dogum_gunu_olanlar: e.target.checked })}
                  className="w-4 h-4 text-gray-600"
                />
                <label className="ml-2 text-sm text-gray-700" htmlFor="sinav-f1-dogum-gunu">Bugün Doğum Günü Olanlar</label>
              </div>
            </div>
          )}

          {/* F-2, F-3, S-1 Tabs - Placeholder */}
          {activeFilterTab !== 'f1' && (
            <div className="text-center py-8 text-gray-500">
              {activeFilterTab === 'f2' && 'F-2 Ek Filtreler yakında eklenecek'}
              {activeFilterTab === 'f3' && 'F-3 Ek Filtreler yakında eklenecek'}
              {activeFilterTab === 's1' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sinav-s1-alan">Sıralama Alanı</label>
                    <select
                      id="sinav-s1-alan"
                      value={filters.siralama_alani}
                      onChange={(e) => setFilters({ ...filters, siralama_alani: e.target.value })}
                      className="input"
                    >
                      <option value="">Yok</option>
                      <option value="adi">Adı</option>
                      <option value="soyadi">Soyadı</option>
                      <option value="aday_no">Aday No</option>
                      <option value="tc_kimlik">TC Kimlik No</option>
                      <option value="istedigi_sertifika">İstediği Sertifika</option>
                      <option value="mevcut_belge">Mevcut Belge</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sinav-s1-ters"
                      checked={filters.siralama_yonu === 'desc'}
                      onChange={(e) => setFilters({ ...filters, siralama_yonu: e.target.checked ? 'desc' : 'asc' })}
                      className="w-4 h-4 text-gray-600"
                    />
                    <label className="ml-2 text-sm text-gray-700" htmlFor="sinav-s1-ters">Ters</label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filter Buttons */}
          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
            <button onClick={handleFilter} className="btn btn-primary text-sm">
              Filtrele
            </button>
            <button onClick={handleClearFilters} className="btn btn-outline text-sm">
              Temizle
            </button>
            <button onClick={handleSaveFilter} className="btn btn-outline text-sm">
              Filtreyi Kaydet
            </button>
          </div>
        </div>
      )}

      {!showFilters && (
        <button
          onClick={() => setShowFilters(true)}
          className="btn btn-outline"
        >
          Filtreleri Göster
        </button>
      )}

      {/* Tablo */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Toplam: <span className="font-bold text-gray-900">{filteredKursiyerler.length}</span> kursiyer
                {selectedIds.size > 0 && (
                  <span className="ml-2 text-gray-500">({selectedIds.size} seçili)</span>
                )}
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="input text-sm"
                aria-label="Sayfa başına kayıt sayısı"
              >
                <option value={10}>10</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={150}>150</option>
                <option value={300}>300</option>
              </select>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button className="btn btn-outline text-sm" onClick={() => alert('Görünüm şablonları yakında.')}>
                Görünüm Şablonları
              </button>
              <button className="btn btn-outline text-sm" onClick={() => alert('Sütun görünürlüğü yakında.')}>
                Sütunları Aç/Kapat
              </button>
              <button className="btn btn-outline text-sm" onClick={() => handleExport('excel')}>
                Excel
              </button>
              <button className="btn btn-outline text-sm" onClick={() => handleExport('pdf')}>
                PDF
              </button>
              <button className="btn btn-outline text-sm" onClick={() => handleExport('print')}>
                Yazdır
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table text-sm">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={pageSelectedCount === paginatedKursiyerler.length && paginatedKursiyerler.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4"
                      aria-label="Tümünü seç"
                    />
                  </th>
                  <th>No</th>
                  <th>İşlem</th>
                  <th>Aday No</th>
                  <th>TC Kimlik No</th>
                  <th>Adı</th>
                  <th>Soyadı</th>
                  <th>Cep Telefonu</th>
                  <th>Mevcut Belge</th>
                  <th>İstediği Sertifika</th>
                  <th>Teorik Sınav Notu</th>
                  <th>Teorik Sınav Drm.</th>
                  <th>Uygulama Sınav Drm.</th>
                </tr>
              </thead>
              <tbody>
                {paginatedKursiyerler.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center py-8 text-gray-500">
                      Kayıt bulunamadı
                    </td>
                  </tr>
                ) : (
                  paginatedKursiyerler.map((kursiyer, index) => (
                    <tr
                      key={kursiyer.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onDoubleClick={() => onDetailClick?.(kursiyer.id)}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(kursiyer.id)}
                          onChange={(e) => handleSelectOne(kursiyer.id, e.target.checked)}
                          className="w-4 h-4"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td>{pageStart + index + 1}</td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDetailClick?.(kursiyer.id);
                          }}
                          className="text-gray-600 hover:text-gray-900 text-sm"
                        >
                          Detay
                        </button>
                      </td>
                      <td>{kursiyer.aday_no || '-'}</td>
                      <td>{kursiyer.tc_kimlik || '-'}</td>
                      <td className="font-medium">{kursiyer.adi}</td>
                      <td className="font-medium">{kursiyer.soyadi}</td>
                      <td>{kursiyer.telefon || '-'}</td>
                      <td>{kursiyer.mevcut_belge || '-'}</td>
                      <td>{kursiyer.istedigi_sertifika || '-'}</td>
                      <td>{kursiyer.teorik_sinav_notu !== undefined ? kursiyer.teorik_sinav_notu : '-'}</td>
                      <td>
                        <span className={`badge ${
                          kursiyer.teorik_sinav_durumu === 'Başarılı' ? 'bg-green-100 text-green-700' :
                          kursiyer.teorik_sinav_durumu === 'Başarısız' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {kursiyer.teorik_sinav_durumu || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          kursiyer.uygulama_sinav_durumu === 'Başarılı' ? 'bg-green-100 text-green-700' :
                          kursiyer.uygulama_sinav_durumu === 'Başarısız' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {kursiyer.uygulama_sinav_durumu || '-'}
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
  );
}
