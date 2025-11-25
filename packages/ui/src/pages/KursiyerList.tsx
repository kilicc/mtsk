import { useEffect, useMemo, useState } from 'react';
import type { Kursiyer } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

type FilterTab = 'f1' | 'f2' | 'f3' | 's1';

type ExtendedKursiyer = Kursiyer & {
  mevcut_belge?: string;
  istedigi_sertifika?: string;
  aday_no?: string;
  kategori?: string;
  alt_kategori?: string;
  kurs_ozel_donemi?: string;
  referans_grubu?: string;
  mebbis_donemi?: string;
  bakiyesi?: number;
  cinsiyet?: string;
  medeni_hal?: string;
  ogrenim_durumu?: string;
  kan_grubu?: string;
  arac_kullanabiliyor?: boolean;
  riskli_kursiyer?: boolean;
  avukata_verildi?: boolean;
  teorik_durum?: string;
  uygulama_durum?: string;
  belge_durum?: string;
  odeme_durumu?: string;
  cari_baglanti?: string;
  sorumlu_personel?: string;
  mebbis_durumu?: string;
  e_kursiyer_durumu?: string;
  eksik_evrak?: boolean;
  sms_izni?: boolean;
  email_izni?: boolean;
  kaynak?: string;
};

interface KursiyerListProps {
  onDetailClick?: (id: number) => void;
  onNewClick?: () => void;
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
  kayit_tarihi_baslangic: string;
  kayit_tarihi_bitis: string;
  cinsiyet: string;
  medeni_hal: string;
  ogrenim_durumu: string;
  kan_grubu: string;
  arac_kullanabiliyor: string;
  riskli_kursiyer: string;
  avukata_verildi: string;
  teorik_durum: string;
  uygulama_durum: string;
  belge_durum: string;
  odeme_durumu: string;
  cari_baglanti: string;
  sorumlu_personel: string;
  mebbis_durumu: string;
  e_kursiyer_durumu: string;
  eksik_evrak: string;
  sms_izni: string;
  email_izni: string;
  kaynak: string;
  siralama_alani: string;
  siralama_yonu: 'asc' | 'desc';
}

interface SavedFilter {
  id: number;
  name: string;
  data: FilterData;
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
  kayit_tarihi_baslangic: '',
  kayit_tarihi_bitis: '',
  cinsiyet: '',
  medeni_hal: '',
  ogrenim_durumu: '',
  kan_grubu: '',
  arac_kullanabiliyor: '',
  riskli_kursiyer: '',
  avukata_verildi: '',
  teorik_durum: '',
  uygulama_durum: '',
  belge_durum: '',
  odeme_durumu: '',
  cari_baglanti: '',
  sorumlu_personel: '',
  mebbis_durumu: '',
  e_kursiyer_durumu: '',
  eksik_evrak: '',
  sms_izni: '',
  email_izni: '',
  kaynak: '',
  siralama_alani: '',
  siralama_yonu: 'asc',
};

const fallbackKursiyerler: ExtendedKursiyer[] = [
  {
    id: 1,
    adi: 'Ayşe',
    soyadi: 'Kaya',
    tc_kimlik: '12345678901',
    telefon: '0555 000 11 22',
    kayit_tarihi: '2024-01-10',
    durum: 1,
    mevcut_belge: 'B',
    istedigi_sertifika: 'A2',
    aday_no: '2024-001',
    kategori: 'Binek',
    alt_kategori: 'Manuel',
    kurs_ozel_donemi: '2024/01',
    referans_grubu: 'Kurumsal',
    mebbis_donemi: '2024-1',
    bakiyesi: 2500,
    cinsiyet: 'Kadın',
    medeni_hal: 'Bekar',
    ogrenim_durumu: 'Lisans',
    kan_grubu: 'A Rh(+)',
    arac_kullanabiliyor: true,
    riskli_kursiyer: false,
    avukata_verildi: false,
    teorik_durum: 'Tamamlandı',
    uygulama_durum: 'Planlandı',
    belge_durum: 'Beklemede',
    odeme_durumu: 'Taksitli',
    cari_baglanti: 'Kaya İnşaat',
    sorumlu_personel: 'Mert Balkan',
    mebbis_durumu: 'Hazır',
    e_kursiyer_durumu: 'Aktif',
    eksik_evrak: false,
    sms_izni: true,
    email_izni: true,
    kaynak: 'MEBBİS',
  },
  {
    id: 2,
    adi: 'Mehmet',
    soyadi: 'Demir',
    tc_kimlik: '10987654321',
    telefon: '0542 345 67 89',
    kayit_tarihi: '2023-12-20',
    durum: 0,
    mevcut_belge: 'A2',
    istedigi_sertifika: 'B',
    aday_no: '2023-145',
    kategori: 'Ticari',
    alt_kategori: 'Otomatik',
    kurs_ozel_donemi: '2023/04',
    referans_grubu: 'Bireysel',
    mebbis_donemi: '2023-3',
    bakiyesi: 0,
    cinsiyet: 'Erkek',
    medeni_hal: 'Evli',
    ogrenim_durumu: 'Lise',
    kan_grubu: '0 Rh(-)',
    arac_kullanabiliyor: false,
    riskli_kursiyer: true,
    avukata_verildi: true,
    teorik_durum: 'Başarılı',
    uygulama_durum: 'Başarısız',
    belge_durum: 'İptal',
    odeme_durumu: 'Tamamlandı',
    cari_baglanti: '',
    sorumlu_personel: 'Ebru Tekin',
    mebbis_durumu: 'Eksik',
    e_kursiyer_durumu: 'Beklemede',
    eksik_evrak: true,
    sms_izni: true,
    email_izni: false,
    kaynak: 'Şube',
  },
];

const filterTabs = [
  { id: 'f1' as FilterTab, label: 'F-1', description: 'Temel filtreler' },
  { id: 'f2' as FilterTab, label: 'F-2', description: 'Profil filtreleri' },
  { id: 'f3' as FilterTab, label: 'F-3', description: 'Durum filtreleri' },
  { id: 's1' as FilterTab, label: 'S-1', description: 'Sıralama' },
];

const bulkActions = [
  { id: 'durum', label: 'Durumu toplu güncelle', requiresSelection: true },
  { id: 'sms', label: 'SMS kuyruğuna ekle', requiresSelection: true },
  { id: 'excel', label: 'Excel çıktısı oluştur', requiresSelection: false },
  { id: 'pdf', label: 'PDF çıktısı oluştur', requiresSelection: false },
];

const printActions = [
  { id: 'liste', label: 'Listeyi yazdır' },
  { id: 'detay', label: 'Seçilen detayları yazdır' },
];

export default function KursiyerList({ onDetailClick, onNewClick }: KursiyerListProps) {
  const [allKursiyerler, setAllKursiyerler] = useState<ExtendedKursiyer[]>([]);
  const [kursiyerler, setKursiyerler] = useState<ExtendedKursiyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterData>(initialFilters);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('f1');
  const [showFilters, setShowFilters] = useState(true);
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const [printMenuOpen, setPrintMenuOpen] = useState(false);
  const [filterBasketOpen, setFilterBasketOpen] = useState(false);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  useEffect(() => {
    loadKursiyerler();
  }, []);

  useEffect(() => {
    // keep displayed list synced when raw data changes
    setKursiyerler(applyFilters(filters, allKursiyerler));
    setCurrentPage(1);
  }, [allKursiyerler]);

  const loadKursiyerler = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/kursiyer`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setAllKursiyerler(data as ExtendedKursiyer[]);
      } else {
        setAllKursiyerler(fallbackKursiyerler);
      }
    } catch (error) {
      console.error('Error loading kursiyerler:', error);
      setAllKursiyerler(fallbackKursiyerler);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data: FilterData, source: ExtendedKursiyer[] = allKursiyerler) => {
    const normalize = (value?: string) => value?.toLowerCase().trim() ?? '';
    const contains = (value?: string, query?: string) =>
      query ? normalize(value).includes(normalize(query)) : true;

    let result = [...source];

    result = result.filter((item) => {
      const matchesF1 =
        contains(item.adi, data.adi) &&
        contains(item.soyadi, data.soyadi) &&
        contains(item.tc_kimlik, data.tc_kimlik) &&
        contains(item.telefon, data.cep_telefonu) &&
        (data.mevcut_belge ? item.mevcut_belge === data.mevcut_belge : true) &&
        (data.istedigi_sertifika ? item.istedigi_sertifika === data.istedigi_sertifika : true) &&
        (data.aday_no_min ? Number(item.aday_no?.replace(/\D/g, '')) >= Number(data.aday_no_min) : true) &&
        (data.aday_no_max ? Number(item.aday_no?.replace(/\D/g, '')) <= Number(data.aday_no_max) : true) &&
        (data.aday_no_durumu === 'var'
          ? Boolean(item.aday_no)
          : data.aday_no_durumu === 'yok'
          ? !item.aday_no
          : true) &&
        (data.genel_durum
          ? data.genel_durum === 'devam'
            ? item.durum === 1
            : item.durum === 0
          : true) &&
        (data.kategori ? item.kategori === data.kategori : true) &&
        (data.alt_kategori ? item.alt_kategori === data.alt_kategori : true) &&
        (data.kurs_ozel_donemi ? item.kurs_ozel_donemi === data.kurs_ozel_donemi : true) &&
        (data.referans_grubu ? item.referans_grubu === data.referans_grubu : true) &&
        (data.donem_secimi === 'secilmemis'
          ? !item.kurs_ozel_donemi
          : data.donem_secimi === 'secilmis'
          ? Boolean(item.kurs_ozel_donemi)
          : true) &&
        (data.mebbis_donemi ? item.mebbis_donemi === data.mebbis_donemi : true) &&
        (data.bakiye_turu === 'borc'
          ? (item.bakiyesi ?? 0) > 0
          : data.bakiye_turu === 'alacak'
          ? (item.bakiyesi ?? 0) < 0
          : data.bakiye_turu === 'sifir'
          ? (item.bakiyesi ?? 0) === 0
          : true) &&
        (data.bakiye_tutari_min ? (item.bakiyesi ?? 0) >= Number(data.bakiye_tutari_min) : true) &&
        (data.bakiye_tutari_max ? (item.bakiyesi ?? 0) <= Number(data.bakiye_tutari_max) : true) &&
        (data.bakiyesi_olanlari_goster ? (item.bakiyesi ?? 0) !== 0 : true) &&
        (data.ayni_tc_olanlari_goster ? item.tc_kimlik === data.tc_kimlik && Boolean(data.tc_kimlik) : true);

      const kayitTarihi = item.kayit_tarihi ? new Date(item.kayit_tarihi) : undefined;
      const matchesDates =
        (data.kayit_tarihi_baslangic ? (kayitTarihi ?? new Date('1900-01-01')) >= new Date(data.kayit_tarihi_baslangic) : true) &&
        (data.kayit_tarihi_bitis ? (kayitTarihi ?? new Date('2100-01-01')) <= new Date(data.kayit_tarihi_bitis) : true);

      const matchesF2 =
        matchesDates &&
        (data.cinsiyet ? item.cinsiyet === data.cinsiyet : true) &&
        (data.medeni_hal ? item.medeni_hal === data.medeni_hal : true) &&
        (data.ogrenim_durumu ? item.ogrenim_durumu === data.ogrenim_durumu : true) &&
        (data.kan_grubu ? item.kan_grubu === data.kan_grubu : true) &&
        (data.arac_kullanabiliyor === 'evet'
          ? item.arac_kullanabiliyor
          : data.arac_kullanabiliyor === 'hayir'
          ? item.arac_kullanabiliyor === false
          : true) &&
        (data.riskli_kursiyer === 'evet'
          ? item.riskli_kursiyer
          : data.riskli_kursiyer === 'hayir'
          ? item.riskli_kursiyer === false
          : true) &&
        (data.avukata_verildi === 'evet'
          ? item.avukata_verildi
          : data.avukata_verildi === 'hayir'
          ? item.avukata_verildi === false
          : true);

      const matchesF3 =
        contains(item.cari_baglanti, data.cari_baglanti) &&
        contains(item.sorumlu_personel, data.sorumlu_personel) &&
        (data.mebbis_durumu ? item.mebbis_durumu === data.mebbis_durumu : true) &&
        (data.e_kursiyer_durumu ? item.e_kursiyer_durumu === data.e_kursiyer_durumu : true) &&
        (data.teorik_durum ? item.teorik_durum === data.teorik_durum : true) &&
        (data.uygulama_durum ? item.uygulama_durum === data.uygulama_durum : true) &&
        (data.belge_durum ? item.belge_durum === data.belge_durum : true) &&
        (data.odeme_durumu ? item.odeme_durumu === data.odeme_durumu : true) &&
        (data.eksik_evrak === 'evet'
          ? item.eksik_evrak
          : data.eksik_evrak === 'hayir'
          ? item.eksik_evrak === false
          : true) &&
        (data.sms_izni === 'evet'
          ? item.sms_izni
          : data.sms_izni === 'hayir'
          ? item.sms_izni === false
          : true) &&
        (data.email_izni === 'evet'
          ? item.email_izni
          : data.email_izni === 'hayir'
          ? item.email_izni === false
          : true) &&
        (data.kaynak ? item.kaynak === data.kaynak : true);

      return matchesF1 && matchesF2 && matchesF3;
    });

    if (data.siralama_alani) {
      result.sort((a, b) => {
        const aValue = (a as Record<string, any>)[data.siralama_alani] ?? '';
        const bValue = (b as Record<string, any>)[data.siralama_alani] ?? '';
        if (aValue < bValue) return data.siralama_yonu === 'asc' ? -1 : 1;
        if (aValue > bValue) return data.siralama_yonu === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  };

  const handleFilter = () => {
    const result = applyFilters(filters);
    setKursiyerler(result);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setKursiyerler(applyFilters(initialFilters));
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleSaveCurrentFilters = () => {
    const name = window.prompt('Filtre adı girin', 'Yeni Filtre');
    if (!name?.trim()) return;
    setSavedFilters((prev) => [...prev, { id: Date.now(), name: name.trim(), data: filters }]);
    setFilterBasketOpen(true);
  };

  const handleApplySavedFilter = (saved: SavedFilter) => {
    setFilters(saved.data);
    setKursiyerler(applyFilters(saved.data));
    setCurrentPage(1);
  };

  const handleDeleteSavedFilter = (id: number) => {
    setSavedFilters((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSmsSend = () => {
    if (selectedIds.length === 0) {
      alert('Önce en az bir kursiyer seçmelisiniz.');
      return;
    }
    alert(`${selectedIds.length} kursiyer SMS listesine eklenecek. (yakında)`);
  };

  const handleBulkAction = (actionId: string, requiresSelection: boolean) => {
    if (requiresSelection && selectedIds.length === 0) {
      alert('Önce seçim yapmalısınız.');
      return;
    }
    alert(`"${actionId}" işlemi başlatılıyor. (yakında)`);
    setBulkMenuOpen(false);
  };

  const handlePrintAction = (actionId: string) => {
    alert(`"${actionId}" çıktısı hazırlanıyor. (yakında)`);
    setPrintMenuOpen(false);
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const visibleIds = paginatedKursiyerler.map((item) => item.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleSelectedFilter = () => {
    if (selectedIds.length === 0) {
      alert('Seçili kursiyer bulunmuyor.');
      return;
    }
    const selectedItems = kursiyerler.filter((item) => selectedIds.includes(item.id));
    setKursiyerler(selectedItems);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(kursiyerler.length / pageSize));

  const paginatedKursiyerler = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return kursiyerler.slice(start, start + pageSize);
  }, [kursiyerler, currentPage, pageSize]);

  const handlePageChange = (direction: 'first' | 'prev' | 'next' | 'last') => {
    setCurrentPage((prev) => {
      if (direction === 'first') return 1;
      if (direction === 'last') return totalPages;
      if (direction === 'prev') return Math.max(1, prev - 1);
      return Math.min(totalPages, prev + 1);
    });
  };

  const EmptyState = (
    <tr>
      <td colSpan={12} className="text-center py-8 text-gray-500">
        Kursiyer bulunamadı.
      </td>
    </tr>
  );

  const renderFilterSectionTitle = (title: string) => (
    <h4 className="text-sm font-semibold text-gray-900 col-span-full">{title}</h4>
  );

  return (
    <div className="p-4 space-y-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="card flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onNewClick} className="btn btn-primary">
            Yeni Kayıt
          </button>
          <button onClick={handleSmsSend} className="btn btn-outline">
            SMS Gönder
          </button>
          <div className="relative">
            <button onClick={() => setBulkMenuOpen((prev) => !prev)} className="btn btn-outline">
              Toplu İşlem
            </button>
            {bulkMenuOpen && (
              <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {bulkActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleBulkAction(action.id, action.requiresSelection)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button onClick={() => setPrintMenuOpen((prev) => !prev)} className="btn btn-outline">
              Yazdır
            </button>
            {printMenuOpen && (
              <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {printActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handlePrintAction(action.id)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setFilterBasketOpen((prev) => !prev)}
            className="btn btn-outline"
          >
            Filtre Sepeti
          </button>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <button onClick={() => handlePageChange('first')} className="btn btn-outline text-xs">
            İlk
          </button>
          <button onClick={() => handlePageChange('prev')} className="btn btn-outline text-xs">
            Önceki
          </button>
          <span className="px-2">
            Sayfa {currentPage} / {totalPages}
          </span>
          <button onClick={() => handlePageChange('next')} className="btn btn-outline text-xs">
            Sonraki
          </button>
          <button onClick={() => handlePageChange('last')} className="btn btn-outline text-xs">
            Son
          </button>
        </div>
      </div>

      {filterBasketOpen && (
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Kaydedilmiş Filtreler</h3>
            <span className="text-xs text-gray-500">{savedFilters.length} kayıt</span>
          </div>
          {savedFilters.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">
              Henüz kayıtlı filtranız yok. Filtreleri uyguladıktan sonra kaydedebilirsiniz.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {savedFilters.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border border-gray-100 rounded-md px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.id).toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApplySavedFilter(item)}
                      className="btn btn-primary text-xs px-3 py-1"
                    >
                      Uygula
                    </button>
                    <button
                      onClick={() => handleDeleteSavedFilter(item.id)}
                      className="btn btn-outline text-xs px-3 py-1"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showFilters && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtreleme</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-800">
              Kapat
            </button>
          </div>

          <div className="flex gap-2 border-b border-gray-200 mb-4 overflow-x-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilterTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeFilterTab === tab.id ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500'
                }`}
              >
                {tab.label} · {tab.description}
              </button>
            ))}
          </div>

          {activeFilterTab === 'f1' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderFilterSectionTitle('Kişisel')}
              <FilterInput
                label="Adı"
                value={filters.adi}
                onChange={(value) => setFilters({ ...filters, adi: value })}
              />
              <FilterInput
                label="Soyadı"
                value={filters.soyadi}
                onChange={(value) => setFilters({ ...filters, soyadi: value })}
              />
              <FilterInput
                label="TC Kimlik"
                value={filters.tc_kimlik}
                onChange={(value) => setFilters({ ...filters, tc_kimlik: value })}
              />
              <FilterInput
                label="Cep Telefonu"
                value={filters.cep_telefonu}
                onChange={(value) => setFilters({ ...filters, cep_telefonu: value })}
              />
              {renderFilterSectionTitle('Belge & Sertifika')}
              <FilterSelect
                label="Mevcut Belge"
                value={filters.mevcut_belge}
                onChange={(value) => setFilters({ ...filters, mevcut_belge: value })}
                options={['M', 'A1', 'A2', 'B', 'C', 'D', 'E', 'F', 'G']}
              />
              <FilterSelect
                label="İstediği Sertifika"
                value={filters.istedigi_sertifika}
                onChange={(value) => setFilters({ ...filters, istedigi_sertifika: value })}
                options={['M', 'A1', 'A2', 'B', 'C', 'D', 'E', 'F', 'G']}
              />
              <FilterInput
                label="Aday No (Min)"
                type="number"
                value={filters.aday_no_min}
                onChange={(value) => setFilters({ ...filters, aday_no_min: value })}
              />
              <FilterInput
                label="Aday No (Max)"
                type="number"
                value={filters.aday_no_max}
                onChange={(value) => setFilters({ ...filters, aday_no_max: value })}
              />
              <FilterSelect
                label="Aday No Durumu"
                value={filters.aday_no_durumu}
                onChange={(value) => setFilters({ ...filters, aday_no_durumu: value })}
                options={[
                  { value: 'var', label: 'Aday No Olanlar' },
                  { value: 'yok', label: 'Aday No Olmayanlar' },
                ]}
              />
              <FilterSelect
                label="Genel Durum"
                value={filters.genel_durum}
                onChange={(value) => setFilters({ ...filters, genel_durum: value })}
                options={[
                  { value: 'devam', label: 'İşlem Devam Ediyor' },
                  { value: 'tamamlandi', label: 'Tamamlandı' },
                ]}
              />
              {renderFilterSectionTitle('Dönem & Finans')}
              <FilterInput
                label="Kategori"
                value={filters.kategori}
                onChange={(value) => setFilters({ ...filters, kategori: value })}
              />
              <FilterInput
                label="Alt Kategori"
                value={filters.alt_kategori}
                onChange={(value) => setFilters({ ...filters, alt_kategori: value })}
                disabled={!filters.kategori}
              />
              <FilterInput
                label="Kurs Özel Dönemi"
                value={filters.kurs_ozel_donemi}
                onChange={(value) => setFilters({ ...filters, kurs_ozel_donemi: value })}
              />
              <FilterInput
                label="Referans Grubu"
                value={filters.referans_grubu}
                onChange={(value) => setFilters({ ...filters, referans_grubu: value })}
              />
              <FilterSelect
                label="Dönem Seçimi"
                value={filters.donem_secimi}
                onChange={(value) => setFilters({ ...filters, donem_secimi: value })}
                options={[
                  { value: 'elle', label: 'Elle Dönem Seçimi' },
                  { value: 'secilmis', label: 'Seçilmiş Olanlar' },
                  { value: 'secilmemis', label: 'Seçilmemiş Olanlar' },
                ]}
              />
              <FilterInput
                label="MEBBİS Dönemi"
                value={filters.mebbis_donemi}
                onChange={(value) => setFilters({ ...filters, mebbis_donemi: value })}
              />
              <FilterSelect
                label="Bakiye Türü"
                value={filters.bakiye_turu}
                onChange={(value) => setFilters({ ...filters, bakiye_turu: value })}
                options={[
                  { value: 'borc', label: 'Borç' },
                  { value: 'alacak', label: 'Alacak' },
                  { value: 'sifir', label: 'Sıfır' },
                ]}
              />
              <FilterInput
                label="Bakiye Min"
                type="number"
                value={filters.bakiye_tutari_min}
                onChange={(value) => setFilters({ ...filters, bakiye_tutari_min: value })}
              />
              <FilterInput
                label="Bakiye Max"
                type="number"
                value={filters.bakiye_tutari_max}
                onChange={(value) => setFilters({ ...filters, bakiye_tutari_max: value })}
              />
              <CheckboxInput
                label="Bakiyesi Olanlar"
                checked={filters.bakiyesi_olanlari_goster}
                onChange={(value) => setFilters({ ...filters, bakiyesi_olanlari_goster: value })}
              />
              <CheckboxInput
                label="Aynı TC Olanlar"
                checked={filters.ayni_tc_olanlari_goster}
                onChange={(value) => setFilters({ ...filters, ayni_tc_olanlari_goster: value })}
              />
              <CheckboxInput
                label="Bugün Doğum Günü"
                checked={filters.bugun_dogum_gunu_olanlar}
                onChange={(value) => setFilters({ ...filters, bugun_dogum_gunu_olanlar: value })}
              />
            </div>
          )}

          {activeFilterTab === 'f2' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderFilterSectionTitle('Demografik')}
              <FilterInput
                label="Kayıt Tarihi (Başlangıç)"
                type="date"
                value={filters.kayit_tarihi_baslangic}
                onChange={(value) => setFilters({ ...filters, kayit_tarihi_baslangic: value })}
              />
              <FilterInput
                label="Kayıt Tarihi (Bitiş)"
                type="date"
                value={filters.kayit_tarihi_bitis}
                onChange={(value) => setFilters({ ...filters, kayit_tarihi_bitis: value })}
              />
              <FilterSelect
                label="Cinsiyet"
                value={filters.cinsiyet}
                onChange={(value) => setFilters({ ...filters, cinsiyet: value })}
                options={[
                  { value: 'Kadın', label: 'Kadın' },
                  { value: 'Erkek', label: 'Erkek' },
                ]}
              />
              <FilterSelect
                label="Medeni Hali"
                value={filters.medeni_hal}
                onChange={(value) => setFilters({ ...filters, medeni_hal: value })}
                options={['Bekar', 'Evli', 'Dul']}
              />
              <FilterSelect
                label="Öğrenim Durumu"
                value={filters.ogrenim_durumu}
                onChange={(value) => setFilters({ ...filters, ogrenim_durumu: value })}
                options={['İlkokul', 'Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans']}
              />
              <FilterSelect
                label="Kan Grubu"
                value={filters.kan_grubu}
                onChange={(value) => setFilters({ ...filters, kan_grubu: value })}
                options={['A Rh(+)', 'A Rh(-)', '0 Rh(+)', '0 Rh(-)', 'B Rh(+)', 'B Rh(-)', 'AB Rh(+)', 'AB Rh(-)']}
              />
              {renderFilterSectionTitle('Davranışsal')}
              <FilterSelect
                label="Araç Kullanabiliyor"
                value={filters.arac_kullanabiliyor}
                onChange={(value) => setFilters({ ...filters, arac_kullanabiliyor: value as FilterData['arac_kullanabiliyor'] })}
                options={[
                  { value: 'evet', label: 'Evet' },
                  { value: 'hayir', label: 'Hayır' },
                ]}
              />
              <FilterSelect
                label="Riskli Kursiyer"
                value={filters.riskli_kursiyer}
                onChange={(value) => setFilters({ ...filters, riskli_kursiyer: value as FilterData['riskli_kursiyer'] })}
                options={[
                  { value: 'evet', label: 'Evet' },
                  { value: 'hayir', label: 'Hayır' },
                ]}
              />
              <FilterSelect
                label="Avukata Verildi"
                value={filters.avukata_verildi}
                onChange={(value) => setFilters({ ...filters, avukata_verildi: value as FilterData['avukata_verildi'] })}
                options={[
                  { value: 'evet', label: 'Evet' },
                  { value: 'hayir', label: 'Hayır' },
                ]}
              />
            </div>
          )}

          {activeFilterTab === 'f3' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderFilterSectionTitle('Durumlar')}
              <FilterSelect
                label="Teorik Durum"
                value={filters.teorik_durum}
                onChange={(value) => setFilters({ ...filters, teorik_durum: value })}
                options={['Tamamlandı', 'Beklemede', 'Başarısız']}
              />
              <FilterSelect
                label="Uygulama Durum"
                value={filters.uygulama_durum}
                onChange={(value) => setFilters({ ...filters, uygulama_durum: value })}
                options={['Planlandı', 'Tamamlandı', 'Beklemede']}
              />
              <FilterSelect
                label="Belge Durumu"
                value={filters.belge_durum}
                onChange={(value) => setFilters({ ...filters, belge_durum: value })}
                options={['Hazır', 'Beklemede', 'İptal']}
              />
              <FilterSelect
                label="Ödeme Durumu"
                value={filters.odeme_durumu}
                onChange={(value) => setFilters({ ...filters, odeme_durumu: value })}
                options={['Tamamlandı', 'Taksitli', 'Gecikme']}
              />
              <FilterInput
                label="Cari Bağlantı"
                value={filters.cari_baglanti}
                onChange={(value) => setFilters({ ...filters, cari_baglanti: value })}
              />
              <FilterInput
                label="Sorumlu Personel"
                value={filters.sorumlu_personel}
                onChange={(value) => setFilters({ ...filters, sorumlu_personel: value })}
              />
              <FilterSelect
                label="MEBBİS Durumu"
                value={filters.mebbis_durumu}
                onChange={(value) => setFilters({ ...filters, mebbis_durumu: value })}
                options={['Hazır', 'Eksik', 'Gönderildi']}
              />
              <FilterSelect
                label="E-Kursiyer Durumu"
                value={filters.e_kursiyer_durumu}
                onChange={(value) => setFilters({ ...filters, e_kursiyer_durumu: value })}
                options={['Aktif', 'Beklemede', 'Pasif']}
              />
              <FilterSelect
                label="Eksik Evrak"
                value={filters.eksik_evrak}
                onChange={(value) => setFilters({ ...filters, eksik_evrak: value as FilterData['eksik_evrak'] })}
                options={[
                  { value: 'evet', label: 'Evet' },
                  { value: 'hayir', label: 'Hayır' },
                ]}
              />
              <FilterSelect
                label="SMS İzni"
                value={filters.sms_izni}
                onChange={(value) => setFilters({ ...filters, sms_izni: value as FilterData['sms_izni'] })}
                options={[
                  { value: 'evet', label: 'Var' },
                  { value: 'hayir', label: 'Yok' },
                ]}
              />
              <FilterSelect
                label="E-posta İzni"
                value={filters.email_izni}
                onChange={(value) => setFilters({ ...filters, email_izni: value as FilterData['email_izni'] })}
                options={[
                  { value: 'evet', label: 'Var' },
                  { value: 'hayir', label: 'Yok' },
                ]}
              />
              <FilterSelect
                label="Kaynak"
                value={filters.kaynak}
                onChange={(value) => setFilters({ ...filters, kaynak: value })}
                options={['MEBBİS', 'Şube', 'Web Formu']}
              />
            </div>
          )}

          {activeFilterTab === 's1' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FilterSelect
                label="Sıralama Alanı"
                value={filters.siralama_alani}
                onChange={(value) => setFilters({ ...filters, siralama_alani: value })}
                options={[
                  { value: 'adi', label: 'Adı' },
                  { value: 'soyadi', label: 'Soyadı' },
                  { value: 'kayit_tarihi', label: 'Kayıt Tarihi' },
                  { value: 'mevcut_belge', label: 'Mevcut Belge' },
                  { value: 'bakiyesi', label: 'Bakiye' },
                ]}
              />
              <FilterSelect
                label="Sıralama Yönü"
                value={filters.siralama_yonu}
                onChange={(value) =>
                  setFilters({ ...filters, siralama_yonu: (value as FilterData['siralama_yonu']) ?? 'asc' })
                }
                options={[
                  { value: 'asc', label: 'Artan' },
                  { value: 'desc', label: 'Azalan' },
                ]}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200">
            <button onClick={handleFilter} className="btn btn-primary">
              Filtrele
            </button>
            <button onClick={handleClearFilters} className="btn btn-outline">
              Temizle
            </button>
            <button onClick={handleSelectedFilter} className="btn btn-outline">
              Seçilenleri Filtrele
            </button>
            <button onClick={handleSaveCurrentFilters} className="btn btn-outline">
              Filtreyi Kaydet
            </button>
          </div>
        </div>
      )}

      {!showFilters && (
        <button onClick={() => setShowFilters(true)} className="btn btn-outline">
          Filtreleri Göster
        </button>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="card space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>
                Toplam{' '}
                <span className="font-semibold text-gray-900">{kursiyerler.length}</span> kursiyer
              </span>
              <span>
                Seçili{' '}
                <span className="font-semibold text-gray-900">{selectedIds.length}</span>
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="input text-sm w-32"
                aria-label="Sayfada gösterilecek kayıt"
              >
                {[10, 30, 50, 100, 150, 300].map((size) => (
                  <option key={size} value={size}>
                    {size} / sayfa
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button className="btn btn-outline text-xs" onClick={() => alert('Görünüm şablonları yakında.')}>
                Görünüm Şablonları
              </button>
              <button className="btn btn-outline text-xs" onClick={() => alert('Sütun aç/kapat yakında.')}>
                Sütunları Aç/Kapat
              </button>
              <button className="btn btn-outline text-xs" onClick={() => alert('Excel çıktısı yakında.')}>
                Excel
              </button>
              <button className="btn btn-outline text-xs" onClick={() => alert('PDF çıktısı yakında.')}>
                PDF
              </button>
              <button className="btn btn-outline text-xs" onClick={() => alert('Yazdırma yakında.')}>
                Yazdır
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={paginatedKursiyerler.length > 0 && paginatedKursiyerler.every((item) => selectedIds.includes(item.id))}
                      onChange={toggleSelectAll}
                      className="w-4 h-4"
                      aria-label="Tümünü seç"
                    />
                  </th>
                  <th>#</th>
                  <th>No</th>
                  <th>Durum</th>
                  <th>Aday No</th>
                  <th>TC Kimlik</th>
                  <th>Adı</th>
                  <th>Soyadı</th>
                  <th>Cep Telefonu</th>
                  <th>Mevcut Belge</th>
                  <th>İstediği Sertifika</th>
                  <th>Bakiye</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {paginatedKursiyerler.length === 0
                  ? EmptyState
                  : paginatedKursiyerler.map((kursiyer, index) => (
                      <tr
                        key={kursiyer.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onDoubleClick={() => onDetailClick?.(kursiyer.id)}
                      >
                        <td>
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={selectedIds.includes(kursiyer.id)}
                            onChange={() => handleSelectRow(kursiyer.id)}
                            aria-label={`${kursiyer.adi} ${kursiyer.soyadi} seç`}
                          />
                        </td>
                        <td>{(currentPage - 1) * pageSize + index + 1}</td>
                        <td>{kursiyer.id}</td>
                        <td>
                          <span
                            className={`badge ${
                              kursiyer.durum === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {kursiyer.durum === 1 ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td>{kursiyer.aday_no || '-'}</td>
                        <td>{kursiyer.tc_kimlik || '-'}</td>
                        <td className="font-medium">{kursiyer.adi}</td>
                        <td className="font-medium">{kursiyer.soyadi}</td>
                        <td>{kursiyer.telefon || '-'}</td>
                        <td>{kursiyer.mevcut_belge || '-'}</td>
                        <td>{kursiyer.istedigi_sertifika || '-'}</td>
                        <td>{typeof kursiyer.bakiyesi === 'number' ? `${kursiyer.bakiyesi.toLocaleString('tr-TR')} ₺` : '-'}</td>
                        <td>
                          <button
                            onClick={() => onDetailClick?.(kursiyer.id)}
                            className="text-sm text-gray-700 underline"
                          >
                            Detay
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}

function FilterInput({ label, value, onChange, type = 'text', disabled }: FilterInputProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input text-sm"
        disabled={disabled}
      />
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<string | { value: string; label: string }>;
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  const normalizedOptions = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option
  );
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input text-sm">
        <option value="">Tümü</option>
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CheckboxInputProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function CheckboxInput({ label, checked, onChange }: CheckboxInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        className="w-4 h-4"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
      />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

