import { useEffect, useState, useMemo } from 'react';
import type { Kursiyer } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

type FilterTab = 'f1' | 'f2' | 'f3' | 's1';

type ExtendedKursiyer = Kursiyer & {
  mevcut_belge?: string;
  istedigi_sertifika?: string;
  aday_no?: string;
  borc?: number;
  alacak?: number;
  bakiye?: number;
  hesap_turu?: string;
  bakiye_turu?: 'borc' | 'alacak' | 'sifir';
  islem_turu?: string;
};

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
  islem_turu: string;
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
  islem_turu: '',
  bakiye_turu: '',
  bakiye_tutari_min: '',
  bakiye_tutari_max: '',
  bakiyesi_olanlari_goster: false,
  ayni_tc_olanlari_goster: false,
  bugun_dogum_gunu_olanlar: false,
  siralama_alani: '',
  siralama_yonu: 'asc',
};

export default function KursiyerBakiyeRaporu() {
  const [allKursiyerler, setAllKursiyerler] = useState<ExtendedKursiyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('f1');
  const [showFilters, setShowFilters] = useState(true);
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<FilterData>(initialFilters);
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  useEffect(() => {
    loadKursiyerler();
  }, []);

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
        borc: k.borc || (Math.random() > 0.5 ? Math.floor(Math.random() * 5000) : 0),
        alacak: k.alacak || (Math.random() > 0.5 ? Math.floor(Math.random() * 10000) : 0),
        bakiye: 0,
        hesap_turu: k.hesap_turu || ['Kurs Ücreti', 'Teorik Sınav Ücreti', 'Uygulama Sınav Ücreti', 'Diğer'][Math.floor(Math.random() * 4)],
        bakiye_turu: 'sifir' as const,
        islem_turu: k.islem_turu || ['Kurs Ücreti', 'Teorik Sınav Ücreti', 'Uygulama Sınav Ücreti', 'Diğer'][Math.floor(Math.random() * 4)],
      }));
      extendedData.forEach(k => {
        k.bakiye = (k.alacak || 0) - (k.borc || 0);
        if (k.bakiye > 0) k.bakiye_turu = 'alacak';
        else if (k.bakiye < 0) k.bakiye_turu = 'borc';
        else k.bakiye_turu = 'sifir';
      });
      setAllKursiyerler(extendedData);
    } catch (error) {
      console.error('Error loading kursiyerler:', error);
      setAllKursiyerler(getMockKursiyerler());
    } finally {
      setLoading(false);
    }
  };

  const getMockKursiyerler = (): ExtendedKursiyer[] => {
    return Array.from({ length: 25 }, (_, i) => {
      const borc = Math.random() > 0.5 ? Math.floor(Math.random() * 5000) : 0;
      const alacak = Math.random() > 0.5 ? Math.floor(Math.random() * 10000) : 0;
      const bakiye = alacak - borc;
      return {
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
        borc,
        alacak,
        bakiye,
        hesap_turu: ['Kurs Ücreti', 'Teorik Sınav Ücreti', 'Uygulama Sınav Ücreti', 'Diğer'][i % 4],
        bakiye_turu: bakiye > 0 ? 'alacak' : bakiye < 0 ? 'borc' : 'sifir',
        islem_turu: ['Kurs Ücreti', 'Teorik Sınav Ücreti', 'Uygulama Sınav Ücreti', 'Diğer'][i % 4],
      };
    });
  };

  const applyFilters = (data: FilterData, source: ExtendedKursiyer[] = allKursiyerler) => {
    let result = [...source];

    if (data.adi) result = result.filter(k => k.adi?.toLowerCase().includes(data.adi.toLowerCase()));
    if (data.soyadi) result = result.filter(k => k.soyadi?.toLowerCase().includes(data.soyadi.toLowerCase()));
    if (data.tc_kimlik) result = result.filter(k => k.tc_kimlik?.includes(data.tc_kimlik));
    if (data.cep_telefonu) result = result.filter(k => k.telefon?.includes(data.cep_telefonu));
    if (data.mevcut_belge) result = result.filter(k => k.mevcut_belge === data.mevcut_belge);
    if (data.istedigi_sertifika) result = result.filter(k => k.istedigi_sertifika === data.istedigi_sertifika);
    if (data.aday_no_min) result = result.filter(k => k.aday_no && parseInt(k.aday_no) >= parseInt(data.aday_no_min));
    if (data.aday_no_max) result = result.filter(k => k.aday_no && parseInt(k.aday_no) <= parseInt(data.aday_no_max));
    if (data.aday_no_durumu === 'yok') result = result.filter(k => !k.aday_no || k.aday_no === '');
    if (data.aday_no_durumu === 'var') result = result.filter(k => k.aday_no && k.aday_no !== '');
    if (data.genel_durum === 'devam') result = result.filter(k => k.durum === 1);
    if (data.genel_durum === 'tamamlandi') result = result.filter(k => k.durum === 0);
    if (data.islem_turu) result = result.filter(k => k.islem_turu === data.islem_turu);
    if (data.bakiye_turu === 'borc') result = result.filter(k => k.bakiye_turu === 'borc');
    if (data.bakiye_turu === 'alacak') result = result.filter(k => k.bakiye_turu === 'alacak');
    if (data.bakiye_turu === 'sifir') result = result.filter(k => k.bakiye_turu === 'sifir');
    if (data.bakiye_tutari_min) {
      const min = parseFloat(data.bakiye_tutari_min);
      result = result.filter(k => (k.bakiye || 0) >= min);
    }
    if (data.bakiye_tutari_max) {
      const max = parseFloat(data.bakiye_tutari_max);
      result = result.filter(k => (k.bakiye || 0) <= max);
    }
    if (data.bakiyesi_olanlari_goster) result = result.filter(k => (k.bakiye || 0) !== 0);
    if (data.ayni_tc_olanlari_goster) {
      const tcCounts = result.reduce((acc, k) => {
        acc[k.tc_kimlik || ''] = (acc[k.tc_kimlik || ''] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      result = result.filter(k => k.tc_kimlik && tcCounts[k.tc_kimlik] > 1);
    }
    if (data.bugun_dogum_gunu_olanlar) {
      const today = new Date();
      result = result.filter(k => {
        if (!k.dogum_tarihi) return false;
        const birthDate = new Date(k.dogum_tarihi);
        return birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate();
      });
    }

    if (data.siralama_alani) {
      result.sort((a, b) => {
        const aVal: any = (a as any)[data.siralama_alani];
        const bVal: any = (b as any)[data.siralama_alani];
        if (aVal === undefined || aVal === null) return data.siralama_yonu === 'asc' ? 1 : -1;
        if (bVal === undefined || bVal === null) return data.siralama_yonu === 'asc' ? -1 : 1;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return data.siralama_yonu === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return data.siralama_yonu === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return 0;
      });
    }

    return result;
  };

  const filteredKursiyerler = useMemo(() => {
    return applyFilters(filters);
  }, [filters, allKursiyerler]);

  const paginatedKursiyerler = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredKursiyerler.slice(startIndex, endIndex);
  }, [filteredKursiyerler, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredKursiyerler.length / pageSize);
  const pageStart = (currentPage - 1) * pageSize;

  const ozetData = useMemo(() => {
    const toplamBorc = filteredKursiyerler.reduce((sum, k) => sum + (k.borc || 0), 0);
    const toplamAlacak = filteredKursiyerler.reduce((sum, k) => sum + (k.alacak || 0), 0);
    const bakiyeToplami = toplamAlacak - toplamBorc;
    return { toplamBorc, toplamAlacak, bakiyeToplami };
  }, [filteredKursiyerler]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 }).format(value || 0);

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
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
      const pageIds = paginatedKursiyerler.map(k => k.id);
      setSelectedIds(new Set([...selectedIds, ...pageIds]));
    } else {
      const pageIds = paginatedKursiyerler.map(k => k.id);
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
          Kursiyer Bakiye Listesi
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
              </div>
            )}
          </div>
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

          {/* F-1 Tab Content */}
          {activeFilterTab === 'f1' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-adi">Adı</label>
                <input
                  id="bakiye-f1-adi"
                  type="text"
                  value={filters.adi}
                  onChange={(e) => setFilters({ ...filters, adi: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-soyadi">Soyadı</label>
                <input
                  id="bakiye-f1-soyadi"
                  type="text"
                  value={filters.soyadi}
                  onChange={(e) => setFilters({ ...filters, soyadi: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-tc">TC Kimlik No</label>
                <input
                  id="bakiye-f1-tc"
                  type="text"
                  value={filters.tc_kimlik}
                  onChange={(e) => setFilters({ ...filters, tc_kimlik: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-tel">Cep Telefonu</label>
                <input
                  id="bakiye-f1-tel"
                  type="text"
                  value={filters.cep_telefonu}
                  onChange={(e) => setFilters({ ...filters, cep_telefonu: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-mevcut-belge">Mevcut Belge</label>
                <select
                  id="bakiye-f1-mevcut-belge"
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
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-istenen">İstediği Sertifika</label>
                <select
                  id="bakiye-f1-istenen"
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
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-aday-min">Aday No (Min)</label>
                <input
                  id="bakiye-f1-aday-min"
                  type="number"
                  value={filters.aday_no_min}
                  onChange={(e) => setFilters({ ...filters, aday_no_min: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-aday-max">Aday No (Max)</label>
                <input
                  id="bakiye-f1-aday-max"
                  type="number"
                  value={filters.aday_no_max}
                  onChange={(e) => setFilters({ ...filters, aday_no_max: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-aday-durum">Aday No Durumu</label>
                <select
                  id="bakiye-f1-aday-durum"
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
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-genel-durum">Genel Durum</label>
                <select
                  id="bakiye-f1-genel-durum"
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
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-islem-turu">İşlem Türü</label>
                <select
                  id="bakiye-f1-islem-turu"
                  value={filters.islem_turu}
                  onChange={(e) => setFilters({ ...filters, islem_turu: e.target.value })}
                  className="input"
                >
                  <option value="">Tümü</option>
                  <option value="Kurs Ücreti">Kurs Ücreti</option>
                  <option value="Teorik Sınav Ücreti">Teorik Sınav Ücreti</option>
                  <option value="Uygulama Sınav Ücreti">Uygulama Sınav Ücreti</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-bakiye-turu">Bakiye Türü</label>
                <select
                  id="bakiye-f1-bakiye-turu"
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
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-bakiye-min">Bakiye Tutarı (Min)</label>
                <input
                  id="bakiye-f1-bakiye-min"
                  type="number"
                  step="0.01"
                  value={filters.bakiye_tutari_min}
                  onChange={(e) => setFilters({ ...filters, bakiye_tutari_min: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-bakiye-max">Bakiye Tutarı (Max)</label>
                <input
                  id="bakiye-f1-bakiye-max"
                  type="number"
                  step="0.01"
                  value={filters.bakiye_tutari_max}
                  onChange={(e) => setFilters({ ...filters, bakiye_tutari_max: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-kategori">Kategori</label>
                <select
                  id="bakiye-f1-kategori"
                  value={filters.kategori}
                  onChange={(e) => setFilters({ ...filters, kategori: e.target.value })}
                  className="input"
                >
                  <option value="">Tümü</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-alt-kategori">Alt Kategori</label>
                <select
                  id="bakiye-f1-alt-kategori"
                  value={filters.alt_kategori}
                  onChange={(e) => setFilters({ ...filters, alt_kategori: e.target.value })}
                  className="input"
                  disabled={!filters.kategori}
                >
                  <option value="">Öncelikle Kategori Seçiniz</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-ozel-donem">Kurs Özel Dönemi</label>
                <select
                  id="bakiye-f1-ozel-donem"
                  value={filters.kurs_ozel_donemi}
                  onChange={(e) => setFilters({ ...filters, kurs_ozel_donemi: e.target.value })}
                  className="input"
                >
                  <option value="">Tümü</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-referans">Referans Grubu</label>
                <select
                  id="bakiye-f1-referans"
                  value={filters.referans_grubu}
                  onChange={(e) => setFilters({ ...filters, referans_grubu: e.target.value })}
                  className="input"
                >
                  <option value="">Seçiniz</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-donem">Dönem Seçimi</label>
                <select
                  id="bakiye-f1-donem"
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
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-f1-mebbis">Mebbis Dönemi</label>
                <button className="btn btn-outline w-full" onClick={() => alert('MEBBİS dönem seçimi yakında.')}>
                  Seçili Yok
                </button>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bakiye-f1-bakiye-goster"
                  checked={filters.bakiyesi_olanlari_goster}
                  onChange={(e) => setFilters({ ...filters, bakiyesi_olanlari_goster: e.target.checked })}
                  className="w-4 h-4 text-gray-600"
                />
                <label className="ml-2 text-sm text-gray-700" htmlFor="bakiye-f1-bakiye-goster">Bakiyesi Olanları Göster</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bakiye-f1-ayni-tc"
                  checked={filters.ayni_tc_olanlari_goster}
                  onChange={(e) => setFilters({ ...filters, ayni_tc_olanlari_goster: e.target.checked })}
                  className="w-4 h-4 text-gray-600"
                />
                <label className="ml-2 text-sm text-gray-700" htmlFor="bakiye-f1-ayni-tc">Aynı TC Olanları Göster</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bakiye-f1-dogum-gunu"
                  checked={filters.bugun_dogum_gunu_olanlar}
                  onChange={(e) => setFilters({ ...filters, bugun_dogum_gunu_olanlar: e.target.checked })}
                  className="w-4 h-4 text-gray-600"
                />
                <label className="ml-2 text-sm text-gray-700" htmlFor="bakiye-f1-dogum-gunu">Bugün Doğum Günü Olanlar</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye-s1-alan">Sıralama Alanı</label>
                    <select
                      id="bakiye-s1-alan"
                      value={filters.siralama_alani}
                      onChange={(e) => setFilters({ ...filters, siralama_alani: e.target.value })}
                      className="input"
                    >
                      <option value="">Yok</option>
                      <option value="adi">Adı</option>
                      <option value="soyadi">Soyadı</option>
                      <option value="aday_no">Aday No</option>
                      <option value="tc_kimlik">TC Kimlik No</option>
                      <option value="bakiye">Bakiye</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="bakiye-s1-ters"
                      checked={filters.siralama_yonu === 'desc'}
                      onChange={(e) => setFilters({ ...filters, siralama_yonu: e.target.checked ? 'desc' : 'asc' })}
                      className="w-4 h-4 text-gray-600"
                    />
                    <label className="ml-2 text-sm text-gray-700" htmlFor="bakiye-s1-ters">Ters</label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filter Buttons */}
          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
            <button onClick={() => {}} className="btn btn-primary text-sm">
              Filtrele
            </button>
            <button onClick={handleClearFilters} className="btn btn-outline text-sm">
              Temizle
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
                <option value={500}>500</option>
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
                      checked={paginatedKursiyerler.length > 0 && paginatedKursiyerler.every(k => selectedIds.has(k.id))}
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
                  <th>Borç</th>
                  <th>Alacak</th>
                  <th>Bakiye</th>
                  <th>Hesap Türü</th>
                  <th>Bakiye Türü</th>
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
                      onDoubleClick={() => console.log('Detay:', kursiyer.id)}
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
                            console.log('Detay:', kursiyer.id);
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
                      <td className={kursiyer.borc && kursiyer.borc > 0 ? 'text-red-600' : ''}>
                        {formatCurrency(kursiyer.borc || 0)}
                      </td>
                      <td className={kursiyer.alacak && kursiyer.alacak > 0 ? 'text-green-600' : ''}>
                        {formatCurrency(kursiyer.alacak || 0)}
                      </td>
                      <td className={`font-bold ${
                        (kursiyer.bakiye || 0) > 0 ? 'text-green-600' :
                        (kursiyer.bakiye || 0) < 0 ? 'text-red-600' : ''
                      }`}>
                        {formatCurrency(kursiyer.bakiye || 0)}
                      </td>
                      <td>{kursiyer.hesap_turu || '-'}</td>
                      <td>
                        <span className={`badge ${
                          kursiyer.bakiye_turu === 'borc' ? 'bg-red-100 text-red-700' :
                          kursiyer.bakiye_turu === 'alacak' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {kursiyer.bakiye_turu === 'borc' ? 'Borç' :
                           kursiyer.bakiye_turu === 'alacak' ? 'Alacak' : 'Sıfır'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Alt Özet Tablosu */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <table className="table text-sm">
              <thead>
                <tr>
                  <th>Hesap Türü</th>
                  <th>Toplam Borç</th>
                  <th>Toplam Alacak</th>
                  <th>Bakiye Toplamı</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold">Toplam</td>
                  <td className="text-red-600 font-bold">{formatCurrency(ozetData.toplamBorc)}</td>
                  <td className="text-green-600 font-bold">{formatCurrency(ozetData.toplamAlacak)}</td>
                  <td className={`font-bold ${
                    ozetData.bakiyeToplami > 0 ? 'text-green-600' :
                    ozetData.bakiyeToplami < 0 ? 'text-red-600' : ''
                  }`}>
                    {formatCurrency(ozetData.bakiyeToplami)}
                  </td>
                  <td>
                    <span className={`badge ${
                      ozetData.bakiyeToplami >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {ozetData.bakiyeToplami >= 0 ? 'Normal' : 'Riskli'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
