import { useState } from 'react';

const API_URL = 'http://localhost:3001/api';

type TabType = 'hizli-erisim' | 'evraklar' | 'adres-iletisim' | 'ek-bilgi' | 'sinavlar' | 'e-kursiyer' | 'gorusme' | 'hesaplar' | 'mebbis';

interface KursiyerFormData {
  // Ana Bilgiler
  adi: string;
  soyadi: string;
  tc_kimlik: string;
  n_c_seri_no: string;
  cep_telefonu: string;
  mebbis_donemi: string;
  ozel_donemi: string;
  kayit_tarihi: string;
  mevcut_belge: string;
  istenen_belge: string;
  mebbis_ucreti: number;
  kategori: string;
  alt_kategori: string;
  referans_grubu: string;
  
  // Genel Durum
  genel_durum: string;
  teorik_durum: string;
  uygulama_durum: string;
  belge_durum: string;
  odeme_durum: string;
  
  // Mevcut Sürücü Belge
  belge_tarihi: string;
  belge_no: string;
  belge_verildigi_il: string;
  belge_2016_oncesi: boolean;
  
  // Diğer Bilgiler
  cari_baglanti: string;
  arac_kullanabiliyor: boolean;
  transfer_edilen_sube: string;
  genel_aciklama: string;
  riskli_kursiyer: boolean;
  risk_notlari: string;
  avukata_verildi: boolean;
  avukata_verilme_tarihi: string;
  avukat: string;
  avukat_aciklama: string;
  
  // Fotoğraf
  foto_url: string | null;
}

interface KursiyerKayit {
  id: number;
  kayit_tarihi: string;
  sube: string;
  donem: string;
  aday_no: string;
  mevcut_belge: string;
  istenen_belge: string;
  bakiye: number;
  sadece_onizleme: boolean;
}

interface DersProgramKaydi {
  id: number;
  personel: string;
  tarih: string;
  saat: string;
  durum: string;
  egitim_yeri: string;
  egitim_turu: string;
  arac: string;
}

interface EvrakItem {
  id: string;
  ad: string;
  durum: 'var' | 'yok' | 'eksik';
  aciklama?: string;
}

interface AdresBilgisi {
  adres: string;
  il: string;
  ilce: string;
  mahalle: string;
  postaKodu: string;
  ikametAdresi: string;
  ebeveynAdres: string;
  evTelefonu: string;
  isTelefonu: string;
  email: string;
  web: string;
}

interface EkBilgi {
  dogumTarihi: string;
  dogumYeri: string;
  cinsiyet: string;
  kanGrubu: string;
  medeniHal: string;
  ogrenimDurumu: string;
  meslek: string;
  askerlikDurumu: string;
  ehliyetDurumu: string;
  saglikRaporu: string;
  engelDurumu: string;
  kanunMadde: string;
  not: string;
}

interface SinavKaydi {
  id: number;
  tur: string;
  tarih: string;
  durum: string;
  not: string;
}

interface GorusmeKaydi {
  id: number;
  tarih: string;
  kisi: string;
  konu: string;
  sonuc: string;
}

interface HesapHareketi {
  id: number;
  tarih: string;
  tur: string;
  aciklama: string;
  borc: number;
  alacak: number;
  kasa: string;
}

interface MebbisDurumu {
  baslik: string;
  durum: 'hazir' | 'eksik' | 'gonderildi';
  mesaj: string;
}

interface EKursiyerBilgi {
  kayitDurumu: string;
  eKursiyerNo: string;
  eSinavDurumu: string;
  sonIslemTarihi: string;
  mebbisBaglantisi: 'hazir' | 'gonderildi' | 'temizlendi';
}

export default function KursiyerYeniKayit() {
  const [formData, setFormData] = useState<Partial<KursiyerFormData>>({
    genel_durum: 'İşlem Devam Ediyor',
    teorik_durum: 'Sınav Aşamasında',
    uygulama_durum: 'Teorik Bekleniyor',
    belge_durum: 'Sınav Sürecinde',
    odeme_durum: 'Girilmedi',
    belge_2016_oncesi: false,
    arac_kullanabiliyor: false,
    riskli_kursiyer: false,
    avukata_verildi: false,
    kayit_tarihi: new Date().toISOString().split('T')[0],
  });
  
  const [activeTab, setActiveTab] = useState<TabType>('hizli-erisim');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [kursiyerId, setKursiyerId] = useState<number | null>(null);
  const [digerKayitlar] = useState<KursiyerKayit[]>([
    {
      id: 1,
      kayit_tarihi: '2024-10-12',
      sube: 'Merkez Şube',
      donem: 'Eylül 2024',
      aday_no: '123456',
      mevcut_belge: 'B',
      istenen_belge: 'D',
      bakiye: 12500,
      sadece_onizleme: false,
    },
    {
      id: 2,
      kayit_tarihi: '2024-07-20',
      sube: 'Ataşehir',
      donem: 'Temmuz 2024',
      aday_no: '987654',
      mevcut_belge: 'A2',
      istenen_belge: 'A',
      bakiye: 0,
      sadece_onizleme: true,
    },
  ]);
  const [dersProgramKayitlari] = useState<DersProgramKaydi[]>([
    {
      id: 1,
      personel: 'Ahmet Kılıç',
      tarih: '2024-11-20',
      saat: '09:00',
      durum: 'Planlandı',
      egitim_yeri: 'Simülatör',
      egitim_turu: 'Teorik',
      arac: '34 ABC 123',
    },
    {
      id: 2,
      personel: 'Ayşe Demir',
      tarih: '2024-11-22',
      saat: '14:00',
      durum: 'Beklemede',
      egitim_yeri: 'Eğitim Alanı',
      egitim_turu: 'Uygulama',
      arac: '34 XYZ 987',
    },
  ]);
  const [evraklar, setEvraklar] = useState<EvrakItem[]>([
    { id: 'biyometrik', ad: 'Biyometrik Fotoğraf', durum: 'var' },
    { id: 'kimlik', ad: 'T.C Kimlik Fotokopisi', durum: 'var' },
    { id: 'ogrenim', ad: 'Öğrenim Belgesi', durum: 'eksik' },
    { id: 'saglik', ad: 'Sağlık Raporu', durum: 'yok' },
    { id: 'sabıka', ad: 'Sabıka Kaydı', durum: 'var' },
    { id: 'imza', ad: 'İmza Örneği', durum: 'yok' },
    { id: 'sozlesme', ad: 'Sözleşme Belgesi', durum: 'eksik' },
  ]);
  const [adresBilgisi, setAdresBilgisi] = useState<AdresBilgisi>({
    adres: '',
    il: '',
    ilce: '',
    mahalle: '',
    postaKodu: '',
    ikametAdresi: '',
    ebeveynAdres: '',
    evTelefonu: '',
    isTelefonu: '',
    email: '',
    web: '',
  });
  const [ekBilgi, setEkBilgi] = useState<EkBilgi>({
    dogumTarihi: '',
    dogumYeri: '',
    cinsiyet: '',
    kanGrubu: '',
    medeniHal: '',
    ogrenimDurumu: '',
    meslek: '',
    askerlikDurumu: '',
    ehliyetDurumu: '',
    saglikRaporu: '',
    engelDurumu: '',
    kanunMadde: '',
    not: '',
  });
  const [sinavlar, setSinavlar] = useState<SinavKaydi[]>([
    { id: 1, tur: 'Teorik', tarih: '2024-08-10', durum: 'Başarılı', not: '85' },
    { id: 2, tur: 'Uygulama', tarih: '2024-09-05', durum: 'Beklemede', not: '-' },
  ]);
  const [yeniSinav, setYeniSinav] = useState<Omit<SinavKaydi, 'id'>>({
    tur: 'Teorik',
    tarih: '',
    durum: 'Beklemede',
    not: '',
  });
  const [gorusmeler, setGorusmeler] = useState<GorusmeKaydi[]>([
    { id: 1, tarih: '2024-09-12', kisi: 'Veli - Mehmet Demir', konu: 'Ödeme Planı', sonuc: 'Mutabık kalındı' },
    { id: 2, tarih: '2024-10-03', kisi: 'Kursiyer', konu: 'Ders Programı', sonuc: 'Takvim onaylandı' },
  ]);
  const [yeniGorusme, setYeniGorusme] = useState<Omit<GorusmeKaydi, 'id'>>({
    tarih: '',
    kisi: '',
    konu: '',
    sonuc: '',
  });
  const [hesapHareketleri, setHesapHareketleri] = useState<HesapHareketi[]>([
    { id: 1, tarih: '2024-08-01', tur: 'Tahsilat', aciklama: 'Kayıt Bedeli', borc: 0, alacak: 10000, kasa: 'Merkez Kasa' },
    { id: 2, tarih: '2024-09-01', tur: 'Tahsilat', aciklama: '2. Taksit', borc: 0, alacak: 5000, kasa: 'Merkez Kasa' },
    { id: 3, tarih: '2024-09-15', tur: 'Gider', aciklama: 'Belge Ücreti', borc: 750, alacak: 0, kasa: 'Banka' },
  ]);
  const [yeniHesapHareketi, setYeniHesapHareketi] = useState<Omit<HesapHareketi, 'id'>>({
    tarih: '',
    tur: 'Tahsilat',
    aciklama: '',
    borc: 0,
    alacak: 0,
    kasa: '',
  });
  const [mebbisDurumlari] = useState<MebbisDurumu[]>([
    { baslik: 'Aday Kaydı', durum: 'hazir', mesaj: 'Eksik yok, gönderime hazır' },
    { baslik: 'Fotoğraf Bilgisi', durum: 'eksik', mesaj: 'Fotoğraf güncellenmeli' },
    { baslik: 'Sağlık Bilgisi', durum: 'gonderildi', mesaj: 'Son gönderim 12.09.2024' },
    { baslik: 'Savcılık Kaydı', durum: 'hazir', mesaj: 'Geçerlilik tarihi 2025' },
  ]);
  const [eKursiyerBilgi, setEKursiyerBilgi] = useState<EKursiyerBilgi>({
    kayitDurumu: 'Hazırlık Aşamasında',
    eKursiyerNo: '',
    eSinavDurumu: 'Beklemede',
    sonIslemTarihi: '',
    mebbisBaglantisi: 'hazir',
  });

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'hizli-erisim', label: 'Hızlı Erişim', icon: '⚡' },
    { id: 'evraklar', label: 'Evraklar', icon: '📄' },
    { id: 'adres-iletisim', label: 'Adres-İletişim', icon: '📍' },
    { id: 'ek-bilgi', label: 'Ek Bilgi', icon: 'ℹ️' },
    { id: 'sinavlar', label: 'Sınavlar', icon: '📝' },
    { id: 'e-kursiyer', label: 'E-Kursiyer', icon: '💻' },
    { id: 'gorusme', label: 'Görüşme', icon: '💬' },
    { id: 'hesaplar', label: 'Hesaplar', icon: '💰' },
    { id: 'mebbis', label: 'Mebbis', icon: '🔗' },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      const url = isEditMode && kursiyerId
        ? `${API_URL}/kursiyer/${kursiyerId}`
        : `${API_URL}/kursiyer`;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Kayıt başarısız' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      alert('Kursiyer başarıyla kaydedildi!');
      if (!isEditMode) {
        setKursiyerId(data.id);
        setIsEditMode(true);
      }
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setFormData({
      genel_durum: 'İşlem Devam Ediyor',
      teorik_durum: 'Sınav Aşamasında',
      uygulama_durum: 'Teorik Bekleniyor',
      belge_durum: 'Sınav Sürecinde',
      odeme_durum: 'Girilmedi',
      kayit_tarihi: new Date().toISOString().split('T')[0],
    });
    setIsEditMode(false);
    setKursiyerId(null);
    setActiveTab('hizli-erisim');
  };

  const handleSearch = () => {
    handleTCSearch();
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Dosya boyutu 5MB\'dan büyük olamaz!');
          return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          alert('Lütfen geçerli bir resim dosyası seçiniz!');
          return;
        }

        try {
          setLoading(true);
          const formData = new FormData();
          formData.append('photo', file);
          if (kursiyerId) formData.append('kursiyerId', kursiyerId.toString());
          
          const response = await fetch(`${API_URL}/kursiyer/photo`, {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            const data = await response.json();
            setFormData(prev => ({ ...prev, foto_url: data.url }));
            alert('Fotoğraf başarıyla yüklendi!');
          } else {
            const errorData = await response.json().catch(() => ({ error: 'Fotoğraf yükleme başarısız' }));
            throw new Error(errorData.error || 'Fotoğraf yükleme başarısız');
          }
        } catch (error: any) {
          console.error('Photo upload error:', error);
          alert(`Hata: ${error.message || 'Fotoğraf yüklenirken bir hata oluştu'}`);
        } finally {
          setLoading(false);
        }
      }
    };
    input.click();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kursiyer-${kursiyerId || 'yeni'}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!kursiyerId || !confirm('Bu kursiyeri silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/kursiyer/${kursiyerId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Silme başarısız');
      
      alert('Kursiyer başarıyla silindi!');
      handleNew();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Yapılan değişiklikler kaydedilmeden iptal edilecek. Emin misiniz?')) {
      if (isEditMode && kursiyerId) {
        // Mevcut kaydı yükle
        fetch(`${API_URL}/kursiyer/${kursiyerId}`)
          .then(res => res.json())
          .then(data => setFormData(data))
          .catch(() => handleNew());
      } else {
        handleNew();
      }
    }
  };

  const handleTCSearch = async () => {
    const tc = prompt('TC Kimlik No girin:');
    if (!tc) return;
    
    try {
      const response = await fetch(`${API_URL}/kursiyer/search?tc=${tc}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setFormData({ ...formData, ...data });
          setKursiyerId(data.id);
          setIsEditMode(true);
          alert('Kursiyer bulundu!');
        } else {
          alert('Kursiyer bulunamadı.');
        }
      }
    } catch (error: any) {
      alert(`Arama hatası: ${error.message}`);
    }
  };

  const handleAddNewItem = (type: 'ozel-donem' | 'kategori' | 'alt-kategori' | 'referans-grubu') => {
    const label = {
      'ozel-donem': 'Özel Dönem',
      'kategori': 'Kategori',
      'alt-kategori': 'Alt Kategori',
      'referans-grubu': 'Referans Grubu'
    }[type];
    
    const value = prompt(`${label} adı girin:`);
    if (value) {
      // TODO: API'ye yeni kayıt ekle
      alert(`${label} ekleme işlemi yakında aktif olacak.`);
    }
  };

  const handleCariSearch = () => {
    // TODO: Cari arama modalı aç
    alert('Cari arama özelliği yakında eklenecek.');
  };

  const handleDigerKayitOnizleme = (kayit: KursiyerKayit) => {
    if (kayit.sadece_onizleme) {
      alert('Bu kayıt yalnızca önizleme modunda görüntülenebilir.');
    } else {
      alert(`"${kayit.sube}" şubesindeki kayıt açılacak. (yakında)`);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0);

  const handleEvrakStatusChange = (id: string, durum: EvrakItem['durum']) => {
    setEvraklar(prev => prev.map(item => (item.id === id ? { ...item, durum } : item)));
  };

  const handleEvrakNoteChange = (id: string, note: string) => {
    setEvraklar(prev => prev.map(item => (item.id === id ? { ...item, aciklama: note } : item)));
  };

  const handleEvrakUpload = (id: string) => {
    if (!kursiyerId) {
      alert('Önce kursiyeri kaydedin.');
      return;
    }
    alert(`${id} evrakı için yükleme penceresi açılacak (yakında).`);
  };

  const handleAdresChange = (field: keyof AdresBilgisi, value: string) => {
    setAdresBilgisi(prev => ({ ...prev, [field]: value }));
  };

  const handleEkBilgiChange = (field: keyof EkBilgi, value: string) => {
    setEkBilgi(prev => ({ ...prev, [field]: value }));
  };

  const handleSinavEkle = () => {
    if (!yeniSinav.tarih) {
      alert('Sınav tarihi seçmelisiniz.');
      return;
    }
    setSinavlar(prev => [...prev, { id: Date.now(), ...yeniSinav }]);
    setYeniSinav({ tur: 'Teorik', tarih: '', durum: 'Beklemede', not: '' });
  };

  const handleSinavSil = (id: number) => {
    setSinavlar(prev => prev.filter(s => s.id !== id));
  };

  const handleGorusmeEkle = () => {
    if (!yeniGorusme.tarih || !yeniGorusme.konu) {
      alert('Tarih ve konu alanları zorunludur.');
      return;
    }
    setGorusmeler(prev => [...prev, { id: Date.now(), ...yeniGorusme }]);
    setYeniGorusme({ tarih: '', kisi: '', konu: '', sonuc: '' });
  };

  const handleGorusmeSil = (id: number) => {
    setGorusmeler(prev => prev.filter(g => g.id !== id));
  };

  const hesapOzet = hesapHareketleri.reduce(
    (acc, hareket) => {
      acc.borc += hareket.borc;
      acc.alacak += hareket.alacak;
      return acc;
    },
    { borc: 0, alacak: 0 }
  );
  const hesapBakiye = hesapOzet.alacak - hesapOzet.borc;

  const handleHesapHareketEkle = () => {
    if (!yeniHesapHareketi.tarih || !yeniHesapHareketi.aciklama) {
      alert('Tarih ve açıklama zorunludur.');
      return;
    }
    setHesapHareketleri(prev => [...prev, { id: Date.now(), ...yeniHesapHareketi }]);
    setYeniHesapHareketi({ tarih: '', tur: 'Tahsilat', aciklama: '', borc: 0, alacak: 0, kasa: '' });
  };

  const handleMebbisAction = (action: string) => {
    alert(`"${action}" işlemi başlatılıyor. (MEBBİS entegrasyonu yakında)`);
  };

  const evrakDurumSayilari = evraklar.reduce(
    (acc, item) => {
      acc[item.durum] += 1;
      return acc;
    },
    { var: 0, yok: 0, eksik: 0 }
  );

  const handleEKursiyerChange = (field: keyof EKursiyerBilgi, value: string) => {
    setEKursiyerBilgi(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 space-y-4" style={{ height: '100%', overflowY: 'auto' }}>
      {/* Üst Toolbar */}
      <div className="card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={handlePhotoUpload} className="btn btn-outline">
            Fotoğraf
          </button>
          <button onClick={() => window.print()} className="btn btn-outline">Yazdır</button>
          <button onClick={handleExport} className="btn btn-outline">Export</button>
          <button onClick={handleDelete} disabled={!isEditMode || !kursiyerId} className="btn btn-danger">Sil</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleNew} className="btn btn-primary">
            Yeni
          </button>
          <button onClick={handleSearch} className="btn btn-primary">
            Bul
          </button>
          <button onClick={handleSave} disabled={loading} className="btn btn-success">
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          <button onClick={handleCancel} className="btn btn-outline">İptal</button>
        </div>
      </div>

      {/* Genel Durum Göstergesi */}
      <div className="card">
        <h3 className="text-lg font-bold text-dark-900 mb-4">Genel Durum</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-xs text-dark-600 mb-1">Genel Durum</p>
            <p className="text-sm font-bold text-primary-700">{formData.genel_durum || 'İşlem Devam Ediyor'}</p>
          </div>
          <div className="text-center p-4 bg-warning-50 rounded-lg border border-warning-200">
            <p className="text-xs text-dark-600 mb-1">Teorik</p>
            <p className="text-sm font-bold text-warning-700">{formData.teorik_durum || 'Sınav Aşamasında'}</p>
          </div>
          <div className="text-center p-4 bg-accent-50 rounded-lg border border-accent-200">
            <p className="text-xs text-dark-600 mb-1">Uygulama</p>
            <p className="text-sm font-bold text-accent-700">{formData.uygulama_durum || 'Teorik Bekleniyor'}</p>
          </div>
          <div className="text-center p-4 bg-success-50 rounded-lg border border-success-200">
            <p className="text-xs text-dark-600 mb-1">Belge</p>
            <p className="text-sm font-bold text-success-700">{formData.belge_durum || 'Sınav Sürecinde'}</p>
          </div>
          <div className="text-center p-4 bg-danger-50 rounded-lg border border-danger-200">
            <p className="text-xs text-dark-600 mb-1">Ödeme</p>
            <p className="text-sm font-bold text-danger-700">{formData.odeme_durum || 'Girilmedi'}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="flex flex-wrap gap-2 border-b border-dark-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-white shadow-md'
                  : 'bg-dark-50 text-dark-700 hover:bg-dark-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'hizli-erisim' && (
            <div className="space-y-6">
              {/* Ana Form Alanları */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="adi">
                    Adı <span className="text-danger-500">*</span>
                  </label>
                  <input
                    id="adi"
                    type="text"
                    value={formData.adi || ''}
                    onChange={(e) => setFormData({ ...formData, adi: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="soyadi">
                    Soyadı <span className="text-danger-500">*</span>
                  </label>
                  <input
                    id="soyadi"
                    type="text"
                    value={formData.soyadi || ''}
                    onChange={(e) => setFormData({ ...formData, soyadi: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="tc-kimlik">TC No</label>
                  <div className="flex gap-2">
                    <input
                      id="tc-kimlik"
                      type="text"
                      value={formData.tc_kimlik || ''}
                      onChange={(e) => setFormData({ ...formData, tc_kimlik: e.target.value })}
                      className="input flex-1"
                    />
                    <button onClick={handleTCSearch} className="btn btn-outline" type="button">
                      Ara
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="nc-seri-no">N.C. Seri No</label>
                  <input
                    id="nc-seri-no"
                    type="text"
                    value={formData.n_c_seri_no || ''}
                    onChange={(e) => setFormData({ ...formData, n_c_seri_no: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="cep-telefonu">Cep Tel.</label>
                  <input
                    id="cep-telefonu"
                    type="text"
                    value={formData.cep_telefonu || ''}
                    onChange={(e) => setFormData({ ...formData, cep_telefonu: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="mebbis-donemi">Mebbis Dönemi</label>
                  <select
                    id="mebbis-donemi"
                    value={formData.mebbis_donemi || ''}
                    onChange={(e) => setFormData({ ...formData, mebbis_donemi: e.target.value })}
                    className="input"
                  >
                    <option value="">Seçiniz</option>
                    {/* TODO: API'den dönemler çekilecek */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ozel-donemi">Özel Dönemi</label>
                  <div className="flex gap-2">
                    <select
                      id="ozel-donemi"
                      value={formData.ozel_donemi || ''}
                      onChange={(e) => setFormData({ ...formData, ozel_donemi: e.target.value })}
                      className="input flex-1"
                    >
                      <option value="">Seçiniz</option>
                    </select>
                    <button onClick={() => handleAddNewItem('ozel-donem')} className="btn btn-outline" type="button">Yeni Ekle</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="kayit-tarihi">Kayıt Tarihi</label>
                  <input
                    id="kayit-tarihi"
                    type="date"
                    value={formData.kayit_tarihi || ''}
                    onChange={(e) => setFormData({ ...formData, kayit_tarihi: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="mevcut-belge">Mevcut Belge</label>
                  <select
                    id="mevcut-belge"
                    value={formData.mevcut_belge || ''}
                    onChange={(e) => setFormData({ ...formData, mevcut_belge: e.target.value })}
                    className="input"
                  >
                    <option value="">Seçiniz</option>
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
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="istenen-belge">İstenen Belge</label>
                  <select
                    id="istenen-belge"
                    value={formData.istenen_belge || ''}
                    onChange={(e) => setFormData({ ...formData, istenen_belge: e.target.value })}
                    className="input"
                  >
                    <option value="">Seçiniz</option>
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
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="mebbis-ucreti">Mebbis Ücreti</label>
                  <input
                    id="mebbis-ucreti"
                    type="number"
                    step="0.01"
                    value={formData.mebbis_ucreti || 0}
                    onChange={(e) => setFormData({ ...formData, mebbis_ucreti: parseFloat(e.target.value) })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="kategori">Kategori</label>
                  <div className="flex gap-2">
                    <select
                      id="kategori"
                      value={formData.kategori || ''}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="input flex-1"
                    >
                      <option value="">Seçiniz</option>
                    </select>
                    <button onClick={() => handleAddNewItem('ozel-donem')} className="btn btn-outline" type="button">Yeni Ekle</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="alt-kategori">Alt Kategori</label>
                  <div className="flex gap-2">
                    <select
                      id="alt-kategori"
                      value={formData.alt_kategori || ''}
                      onChange={(e) => setFormData({ ...formData, alt_kategori: e.target.value })}
                      className="input flex-1"
                      disabled={!formData.kategori}
                    >
                      <option value="">Öncelikle Kategori Seçiniz</option>
                    </select>
                    <button onClick={() => handleAddNewItem('alt-kategori')} disabled={!formData.kategori} className="btn btn-outline" type="button">Yeni Ekle</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="referans-grubu">Referans Grubu</label>
                  <div className="flex gap-2">
                    <select
                      id="referans-grubu"
                      value={formData.referans_grubu || ''}
                      onChange={(e) => setFormData({ ...formData, referans_grubu: e.target.value })}
                      className="input flex-1"
                    >
                      <option value="">Seçiniz</option>
                    </select>
                    <button onClick={() => handleAddNewItem('referans-grubu')} className="btn btn-outline" type="button">Yeni Ekle</button>
                  </div>
                </div>
              </div>

              {/* Mevcut Sürücü Belge Bilgileri */}
              <div className="card">
                <h4 className="text-md font-bold text-dark-900 mb-4">Mevcut Sürücü Belge Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="belge-tarihi">Belge Tarihi</label>
                    <input
                      id="belge-tarihi"
                      type="date"
                      value={formData.belge_tarihi || ''}
                      onChange={(e) => setFormData({ ...formData, belge_tarihi: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="belge-no">Belge No</label>
                    <input
                      id="belge-no"
                      type="text"
                      value={formData.belge_no || ''}
                      onChange={(e) => setFormData({ ...formData, belge_no: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="belge-il">Belge Ver.İl</label>
                    <input
                      id="belge-il"
                      type="text"
                      value={formData.belge_verildigi_il || ''}
                      onChange={(e) => setFormData({ ...formData, belge_verildigi_il: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      id="belge-2016"
                      type="checkbox"
                      checked={formData.belge_2016_oncesi || false}
                      onChange={(e) => setFormData({ ...formData, belge_2016_oncesi: e.target.checked })}
                      className="w-4 h-4 text-primary-600"
                    />
                    <label htmlFor="belge-2016" className="ml-2 text-sm text-dark-700">2016 Ocak Öncesi</label>
                  </div>
                </div>
              </div>

              {/* Diğer Bilgiler */}
              <div className="card">
                <h4 className="text-md font-bold text-dark-900 mb-4">Diğer Bilgiler</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="cari-baglanti">Cari Bağlantı</label>
                    <div className="flex gap-2">
                      <input
                        id="cari-baglanti"
                        type="text"
                        value={formData.cari_baglanti || ''}
                        onChange={(e) => setFormData({ ...formData, cari_baglanti: e.target.value })}
                        className="input flex-1"
                        placeholder="Firma Adı"
                      />
                      <button onClick={handleCariSearch} className="btn btn-outline" type="button">Ara</button>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="arac-kullanabilir"
                      type="checkbox"
                      checked={formData.arac_kullanabiliyor || false}
                      onChange={(e) => setFormData({ ...formData, arac_kullanabiliyor: e.target.checked })}
                      className="w-4 h-4 text-primary-600"
                    />
                    <label htmlFor="arac-kullanabilir" className="ml-2 text-sm text-dark-700">Araç Kullanabiliyor</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="transfer-sube">Transfer Edilen Şube</label>
                    <input
                      id="transfer-sube"
                      type="text"
                      value={formData.transfer_edilen_sube || ''}
                      onChange={(e) => setFormData({ ...formData, transfer_edilen_sube: e.target.value })}
                      className="input"
                      placeholder="Firma Adı"
                    />
                  </div>
                </div>
              </div>

              {/* Genel Açıklama - Not */}
              <div className="card">
                <h4 className="text-md font-bold text-dark-900 mb-4">Genel Açıklama - Not</h4>
                <textarea
                  value={formData.genel_aciklama || ''}
                  onChange={(e) => setFormData({ ...formData, genel_aciklama: e.target.value })}
                  className="input"
                  rows={4}
                  placeholder="Notlarınızı buraya yazabilirsiniz..."
                />
              </div>

              {/* Riskli Kursiyer */}
              <div className="card">
                <h4 className="text-md font-bold text-dark-900 mb-4">Riskli Kursiyer (Kara Liste)</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="riskli-kursiyer"
                      type="checkbox"
                      checked={formData.riskli_kursiyer || false}
                      onChange={(e) => setFormData({ ...formData, riskli_kursiyer: e.target.checked })}
                      className="w-4 h-4 text-primary-600"
                    />
                    <label className="ml-2 text-sm text-dark-700" htmlFor="riskli-kursiyer">Riskli Kursiyer</label>
                  </div>
                  <textarea
                    value={formData.risk_notlari || ''}
                    onChange={(e) => setFormData({ ...formData, risk_notlari: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="Risk notları..."
                    disabled={!formData.riskli_kursiyer}
                  />
                </div>
              </div>

              {/* Avukata Verildi */}
              <div className="card">
                <h4 className="text-md font-bold text-dark-900 mb-4">Avukata Verildi</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="avukata-verildi"
                      type="checkbox"
                      checked={formData.avukata_verildi || false}
                      onChange={(e) => setFormData({ ...formData, avukata_verildi: e.target.checked })}
                      className="w-4 h-4 text-primary-600"
                    />
                    <label className="ml-2 text-sm text-dark-700" htmlFor="avukata-verildi">Avukata Verildi</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="avukat-verilme">Verilme Tarihi</label>
                      <input
                        id="avukat-verilme"
                        type="date"
                        value={formData.avukata_verilme_tarihi || ''}
                        onChange={(e) => setFormData({ ...formData, avukata_verilme_tarihi: e.target.value })}
                        className="input"
                        disabled={!formData.avukata_verildi}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="avukat-select">Avukat</label>
                      <select
                        id="avukat-select"
                        value={formData.avukat || ''}
                        onChange={(e) => setFormData({ ...formData, avukat: e.target.value })}
                        className="input"
                        disabled={!formData.avukata_verildi}
                      >
                        <option value="">Seçiniz</option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    id="avukat-aciklama"
                    value={formData.avukat_aciklama || ''}
                    onChange={(e) => setFormData({ ...formData, avukat_aciklama: e.target.value })}
                    className="input"
                    rows={3}
                    placeholder="Açıklama..."
                    disabled={!formData.avukata_verildi}
                  />
                </div>
              </div>

              {/* Kursiyerin Diğer Kayıtları */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-md font-bold text-dark-900">Kursiyerin Diğer Kayıtları</h4>
                    <p className="text-xs text-gray-500">Diğer şubelerdeki kayıtlar önizleme modunda açılabilir.</p>
                  </div>
                  <button className="btn btn-outline text-sm" onClick={() => alert('Yeni kayıt ekleme yakında.')}>
                    Yeni Kayıt Ekle
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="table text-sm">
                    <thead>
                      <tr>
                        <th>Kayıt Tarihi</th>
                        <th>Firma / Şube</th>
                        <th>Dönemi</th>
                        <th>Aday No</th>
                        <th>Mevcut Belge</th>
                        <th>İstenen Sertifika</th>
                        <th>Bakiye</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {digerKayitlar.map((kayit) => (
                        <tr key={kayit.id}>
                          <td>{kayit.kayit_tarihi}</td>
                          <td>{kayit.sube}</td>
                          <td>{kayit.donem}</td>
                          <td>{kayit.aday_no}</td>
                          <td>{kayit.mevcut_belge}</td>
                          <td>{kayit.istenen_belge}</td>
                          <td>{formatCurrency(kayit.bakiye)}</td>
                          <td>
                            <button
                              onClick={() => handleDigerKayitOnizleme(kayit)}
                              className="text-sm text-primary-600 hover:text-primary-800"
                            >
                              {kayit.sadece_onizleme ? 'Önizle' : 'Aç'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ders Programı - Kurumsal */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-md font-bold text-dark-900">Ders Programı Kurumsal</h4>
                    <p className="text-xs text-gray-500">Planlanan eğitim seansları</p>
                  </div>
                  <button className="btn btn-outline text-sm" onClick={() => alert('Tam ekran planlayıcı yakında.')}>
                    Tam Ekran
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="table text-sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Personel</th>
                        <th>Tarih</th>
                        <th>Saat</th>
                        <th>Durumu</th>
                        <th>E.Yeri</th>
                        <th>E.Türü</th>
                        <th>Araç</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dersProgramKayitlari.map((ders) => (
                        <tr key={ders.id}>
                          <td>{ders.id}</td>
                          <td>{ders.personel}</td>
                          <td>{ders.tarih}</td>
                          <td>{ders.saat}</td>
                          <td>{ders.durum}</td>
                          <td>{ders.egitim_yeri}</td>
                          <td>{ders.egitim_turu}</td>
                          <td>{ders.arac}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evraklar' && (
            <div className="space-y-6">
              <div className="card">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h4 className="text-md font-bold text-dark-900">Evrak Kontrol Listesi</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="badge">Var: {evrakDurumSayilari.var}</span>
                    <span className="badge badge-warning">Eksik: {evrakDurumSayilari.eksik}</span>
                    <span className="badge badge-danger">Yok: {evrakDurumSayilari.yok}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {evraklar.map((evrak) => (
                    <div key={evrak.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center border border-gray-100 rounded-lg p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{evrak.ad}</p>
                        <p className="text-xs text-gray-500">
                          {evrak.durum === 'var' ? 'Var (Yüklendi)' : evrak.durum === 'eksik' ? 'Eksikleri Var' : 'Evrak Yok'}
                        </p>
                      </div>
                      <select
                        value={evrak.durum}
                        onChange={(e) => handleEvrakStatusChange(evrak.id, e.target.value as EvrakItem['durum'])}
                        className="input text-sm"
                        aria-label={`${evrak.ad} durumu`}
                      >
                        <option value="var">Var (Yüklendi)</option>
                        <option value="eksik">Eksikleri Var</option>
                        <option value="yok">Yok</option>
                      </select>
                      <input
                        value={evrak.aciklama || ''}
                        onChange={(e) => handleEvrakNoteChange(evrak.id, e.target.value)}
                        className="input text-sm"
                        placeholder="Not / Açıklama"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleEvrakUpload(evrak.id)} className="btn btn-outline text-xs flex-1">
                          Evrak Yükle
                        </button>
                        <button onClick={() => alert('Önizleme yakında.')} className="btn btn-outline text-xs flex-1">
                          Önizle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'adres-iletisim' && (
            <div className="space-y-6">
              <div className="card">
                <h4 className="text-md font-bold text-dark-900 mb-4">Adres Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="adres">Adres</label>
                    <textarea
                      id="adres"
                      value={adresBilgisi.adres}
                      onChange={(e) => handleAdresChange('adres', e.target.value)}
                      className="input"
                      rows={3}
                      placeholder="Adres bilgisi"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="adres-il">İl</label>
                      <input id="adres-il" value= {adresBilgisi.il} onChange={(e) => handleAdresChange('il', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="adres-ilce">İlçe</label>
                      <input id="adres-ilce" value={adresBilgisi.ilce} onChange={(e) => handleAdresChange('ilce', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="adres-mahalle">Mahalle</label>
                      <input id="adres-mahalle" value={adresBilgisi.mahalle} onChange={(e) => handleAdresChange('mahalle', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="adres-posta">Posta Kodu</label>
                      <input id="adres-posta" value={adresBilgisi.postaKodu} onChange={(e) => handleAdresChange('postaKodu', e.target.value)} className="input" placeholder="34000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ikamet-adresi">İkamet Adresi</label>
                    <textarea
                      id="ikamet-adresi"
                      value={adresBilgisi.ikametAdresi}
                      onChange={(e) => handleAdresChange('ikametAdresi', e.target.value)}
                      className="input"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ebeveyn-adresi">Ebeveyn Adresi</label>
                    <textarea
                      id="ebeveyn-adresi"
                      value={adresBilgisi.ebeveynAdres}
                      onChange={(e) => handleAdresChange('ebeveynAdres', e.target.value)}
                      className="input"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
              <div className="card">
                <h4 className="text-md font-bold text-dark-900 mb-4">İletişim Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ev-telefonu">Ev Telefonu</label>
                    <input id="ev-telefonu" value={adresBilgisi.evTelefonu} onChange={(e) => handleAdresChange('evTelefonu', e.target.value)} className="input" placeholder="0 212 000 00 00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="is-telefonu">İş Telefonu</label>
                    <input id="is-telefonu" value={adresBilgisi.isTelefonu} onChange={(e) => handleAdresChange('isTelefonu', e.target.value)} className="input" placeholder="0 216 000 00 00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="iletisim-email">E-Posta</label>
                    <input id="iletisim-email" value={adresBilgisi.email} onChange={(e) => handleAdresChange('email', e.target.value)} className="input" placeholder="ornek@mail.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="web-site">Web Sitesi</label>
                    <input id="web-site" value={adresBilgisi.web} onChange={(e) => handleAdresChange('web', e.target.value)} className="input" placeholder="https://" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ek-bilgi' && (
            <div className="space-y-6">
              <div className="card">
                <h4 className="text-md font-bold text-dark-900 mb-4">Ek Bilgiler</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-dogum-tarihi">Doğum Tarihi</label>
                    <input id="ek-dogum-tarihi" type="date" value={ekBilgi.dogumTarihi} onChange={(e) => handleEkBilgiChange('dogumTarihi', e.target.value)} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-dogum-yeri">Doğum Yeri</label>
                    <input id="ek-dogum-yeri" value={ekBilgi.dogumYeri} onChange={(e) => handleEkBilgiChange('dogumYeri', e.target.value)} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-cinsiyet">Cinsiyet</label>
                    <select id="ek-cinsiyet" value={ekBilgi.cinsiyet} onChange={(e) => handleEkBilgiChange('cinsiyet', e.target.value)} className="input">
                      <option value="">Seçiniz</option>
                      <option value="Kadın">Kadın</option>
                      <option value="Erkek">Erkek</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-kan-grubu">Kan Grubu</label>
                    <select id="ek-kan-grubu" value={ekBilgi.kanGrubu} onChange={(e) => handleEkBilgiChange('kanGrubu', e.target.value)} className="input">
                      <option value="">Seçiniz</option>
                      <option value="A Rh(+)">A Rh(+)</option>
                      <option value="A Rh(-)">A Rh(-)</option>
                      <option value="B Rh(+)">B Rh(+)</option>
                      <option value="B Rh(-)">B Rh(-)</option>
                      <option value="AB Rh(+)">AB Rh(+)</option>
                      <option value="AB Rh(-)">AB Rh(-)</option>
                      <option value="0 Rh(+)">0 Rh(+)</option>
                      <option value="0 Rh(-)">0 Rh(-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-medeni-hal">Medeni Hali</label>
                    <select id="ek-medeni-hal" value={ekBilgi.medeniHal} onChange={(e) => handleEkBilgiChange('medeniHal', e.target.value)} className="input">
                      <option value="">Seçiniz</option>
                      <option value="Bekar">Bekar</option>
                      <option value="Evli">Evli</option>
                      <option value="Dul">Dul</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-ogrenim">Öğrenim Durumu</label>
                    <select id="ek-ogrenim" value={ekBilgi.ogrenimDurumu} onChange={(e) => handleEkBilgiChange('ogrenimDurumu', e.target.value)} className="input">
                      <option value="">Seçiniz</option>
                      <option value="İlkokul">İlkokul</option>
                      <option value="Lise">Lise</option>
                      <option value="Ön Lisans">Ön Lisans</option>
                      <option value="Lisans">Lisans</option>
                      <option value="Yüksek Lisans">Yüksek Lisans</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-meslek">Meslek</label>
                    <input id="ek-meslek" value={ekBilgi.meslek} onChange={(e) => handleEkBilgiChange('meslek', e.target.value)} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-askerlik">Askerlik Durumu</label>
                    <select id="ek-askerlik" value={ekBilgi.askerlikDurumu} onChange={(e) => handleEkBilgiChange('askerlikDurumu', e.target.value)} className="input">
                      <option value="">Seçiniz</option>
                      <option value="Yaptı">Yaptı</option>
                      <option value="Tecilli">Tecilli</option>
                      <option value="Muaf">Muaf</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-ehliyet">Ehliyet Durumu</label>
                    <select id="ek-ehliyet" value={ekBilgi.ehliyetDurumu} onChange={(e) => handleEkBilgiChange('ehliyetDurumu', e.target.value)} className="input">
                      <option value="">Seçiniz</option>
                      <option value="Var">Var</option>
                      <option value="Yok">Yok</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-saglik">Sağlık Raporu</label>
                    <input id="ek-saglik" value={ekBilgi.saglikRaporu} onChange={(e) => handleEkBilgiChange('saglikRaporu', e.target.value)} className="input" placeholder="Belge No / Tarih" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-engel">Engel Durumu</label>
                    <input id="ek-engel" value={ekBilgi.engelDurumu} onChange={(e) => handleEkBilgiChange('engelDurumu', e.target.value)} className="input" placeholder="Varsa açıklayın" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-kanun">Kanun Maddesi</label>
                    <input id="ek-kanun" value={ekBilgi.kanunMadde} onChange={(e) => handleEkBilgiChange('kanunMadde', e.target.value)} className="input" placeholder="Varsa belirtin" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-not">Ek Not</label>
                  <textarea id="ek-not" value={ekBilgi.not} onChange={(e) => handleEkBilgiChange('not', e.target.value)} className="input" rows={3} placeholder="Ek notlar" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sinavlar' && (
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-bold text-dark-900">Sınav Kayıtları</h4>
                  <span className="badge">{sinavlar.length} kayıt</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="table text-sm">
                    <thead>
                      <tr>
                        <th>Tür</th>
                        <th>Tarih</th>
                        <th>Durum</th>
                        <th>Not</th>
                        <th>İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sinavlar.map((sinav) => (
                        <tr key={sinav.id}>
                          <td>{sinav.tur}</td>
                          <td>{sinav.tarih}</td>
                          <td>{sinav.durum}</td>
                          <td>{sinav.not || '-'}</td>
                          <td>
                            <button onClick={() => handleSinavSil(sinav.id)} className="text-red-600 text-sm hover:underline">
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                      {sinavlar.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-gray-500">
                            Sınav kaydı bulunamadı.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card">
                <h4 className="text-md font-bold text-dark-900 mb-4">Yeni Sınav Ekle</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="sinav-turu">Sınav Türü</label>
                    <select id="sinav-turu" value={yeniSinav.tur} onChange={(e) => setYeniSinav(prev => ({ ...prev, tur: e.target.value }))} className="input">
                      <option value="Teorik">Teorik</option>
                      <option value="Uygulama">Uygulama</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="sinav-tarihi">Sınav Tarihi</label>
                    <input id="sinav-tarihi" type="date" value={yeniSinav.tarih} onChange={(e) => setYeniSinav(prev => ({ ...prev, tarih: e.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="sinav-durum">Durum</label>
                    <select id="sinav-durum" value={yeniSinav.durum} onChange={(e) => setYeniSinav(prev => ({ ...prev, durum: e.target.value }))} className="input">
                      <option value="Beklemede">Beklemede</option>
                      <option value="Başarılı">Başarılı</option>
                      <option value="Başarısız">Başarısız</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="sinav-not">Not</label>
                    <input id="sinav-not" value={yeniSinav.not} onChange={(e) => setYeniSinav(prev => ({ ...prev, not: e.target.value }))} className="input" placeholder="0 - 100" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={handleSinavEkle} className="btn btn-primary">
                    Sınav Ekle
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'e-kursiyer' && (
            <div className="space-y-6">
              <div className="card">
                <h4 className="text-md font-bold text-dark-900 mb-4">E-Kursiyer Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-kayit-durum">Kayıt Durumu</label>
                    <select id="ek-kayit-durum" value={eKursiyerBilgi.kayitDurumu} onChange={(e) => handleEKursiyerChange('kayitDurumu', e.target.value)} className="input">
                      <option value="Hazırlık Aşamasında">Hazırlık Aşamasında</option>
                      <option value="Gönderildi">Gönderildi</option>
                      <option value="Tamamlandı">Tamamlandı</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-numara">E-Kursiyer No</label>
                    <input id="ek-numara" value={eKursiyerBilgi.eKursiyerNo} onChange={(e) => handleEKursiyerChange('eKursiyerNo', e.target.value)} className="input" placeholder="Sistem tarafından verilir" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-sinav-durum">E-Sınav Durumu</label>
                    <select id="ek-sinav-durum" value={eKursiyerBilgi.eSinavDurumu} onChange={(e) => handleEKursiyerChange('eSinavDurumu', e.target.value)} className="input">
                      <option value="Beklemede">Beklemede</option>
                      <option value="Başarılı">Başarılı</option>
                      <option value="Başarısız">Başarısız</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="ek-son-islem">Son İşlem Tarihi</label>
                    <input id="ek-son-islem" type="date" value={eKursiyerBilgi.sonIslemTarihi} onChange={(e) => handleEKursiyerChange('sonIslemTarihi', e.target.value)} className="input" />
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleMebbisAction('Sonuçları MEBBİS\'ten Çek')} className="btn btn-outline">
                    Sonuçları MEBBİS'ten Çek
                  </button>
                  <button onClick={() => handleMebbisAction('MEBBİS Bağlantısını Temizle')} className="btn btn-outline">
                    MEBBİS Bağlantısını Temizle
                  </button>
                  <button onClick={() => handleMebbisAction('E-Kursiyer Kaydı Gönder')} className="btn btn-primary">
                    E-Kursiyer Kaydı Gönder
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gorusme' && (
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-bold text-dark-900">Görüşme Kayıtları</h4>
                  <span className="badge">{gorusmeler.length} görüşme</span>
                </div>
                <div className="space-y-3">
                  {gorusmeler.map((gorusme) => (
                    <div key={gorusme.id} className="border border-gray-100 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{gorusme.konu}</p>
                          <p className="text-xs text-gray-500">
                            {gorusme.tarih} • {gorusme.kisi}
                          </p>
                        </div>
                        <button onClick={() => handleGorusmeSil(gorusme.id)} className="text-red-600 text-sm">
                          Sil
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{gorusme.sonuc}</p>
                    </div>
                  ))}
                  {gorusmeler.length === 0 && <div className="text-center text-gray-500 text-sm py-6">Görüşme kaydı bulunamadı.</div>}
                </div>
              </div>
              <div className="card">
                <h4 className="text-md font-bold text-dark-900 mb-4">Yeni Görüşme Ekle</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="gorusme-tarih">Tarih</label>
                    <input id="gorusme-tarih" type="date" value={yeniGorusme.tarih} onChange={(e) => setYeniGorusme(prev => ({ ...prev, tarih: e.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="gorusme-kisi">Görüşülen Kişi</label>
                    <input id="gorusme-kisi" value={yeniGorusme.kisi} onChange={(e) => setYeniGorusme(prev => ({ ...prev, kisi: e.target.value }))} className="input" placeholder="Kişi / Kurum" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="gorusme-konu">Konu</label>
                    <input id="gorusme-konu" value={yeniGorusme.konu} onChange={(e) => setYeniGorusme(prev => ({ ...prev, konu: e.target.value }))} className="input" placeholder="Görüşme konusu" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="gorusme-sonuc">Sonuç / Not</label>
                    <textarea id="gorusme-sonuc" value={yeniGorusme.sonuc} onChange={(e) => setYeniGorusme(prev => ({ ...prev, sonuc: e.target.value }))} className="input" rows={3} />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={handleGorusmeEkle} className="btn btn-primary">
                    Görüşme Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hesaplar' && (
            <div className="space-y-6">
              <div className="card">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h4 className="text-md font-bold text-dark-900">Hesap Hareketleri</h4>
                  <div className="flex gap-2 text-xs">
                    <span className="badge">Borç: {formatCurrency(hesapOzet.borc)}</span>
                    <span className="badge badge-success">Alacak: {formatCurrency(hesapOzet.alacak)}</span>
                    <span className="badge badge-primary">Bakiye: {formatCurrency(hesapBakiye)}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="table text-sm">
                    <thead>
                      <tr>
                        <th>Tarih</th>
                        <th>Tür</th>
                        <th>Açıklama</th>
                        <th>Kasa</th>
                        <th className="text-right">Borç</th>
                        <th className="text-right">Alacak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hesapHareketleri.map((hareket) => (
                        <tr key={hareket.id}>
                          <td>{hareket.tarih}</td>
                          <td>{hareket.tur}</td>
                          <td>{hareket.aciklama}</td>
                          <td>{hareket.kasa}</td>
                          <td className="text-right">{hareket.borc ? formatCurrency(hareket.borc) : '-'}</td>
                          <td className="text-right">{hareket.alacak ? formatCurrency(hareket.alacak) : '-'}</td>
                        </tr>
                      ))}
                      {hesapHareketleri.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-gray-500">
                            Hesap hareketi bulunamadı.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card">
                <h4 className="text-md font-bold text-dark-900 mb-4">Yeni Hareket Ekle</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="hesap-tarih">Tarih</label>
                    <input id="hesap-tarih" type="date" value={yeniHesapHareketi.tarih} onChange={(e) => setYeniHesapHareketi(prev => ({ ...prev, tarih: e.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="hesap-tur">Tür</label>
                    <select id="hesap-tur" value={yeniHesapHareketi.tur} onChange={(e) => setYeniHesapHareketi(prev => ({ ...prev, tur: e.target.value }))} className="input">
                      <option value="Tahsilat">Tahsilat</option>
                      <option value="Gider">Gider</option>
                      <option value="İade">İade</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="hesap-kasa">Kasa / Banka</label>
                    <input id="hesap-kasa" value={yeniHesapHareketi.kasa} onChange={(e) => setYeniHesapHareketi(prev => ({ ...prev, kasa: e.target.value }))} className="input" placeholder="Merkez Kasa" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="hesap-aciklama">Açıklama</label>
                    <input id="hesap-aciklama" value={yeniHesapHareketi.aciklama} onChange={(e) => setYeniHesapHareketi(prev => ({ ...prev, aciklama: e.target.value }))} className="input" placeholder="Örn: 3. taksit" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="hesap-borc">Borç</label>
                    <input id="hesap-borc" type="number" value={yeniHesapHareketi.borc} onChange={(e) => setYeniHesapHareketi(prev => ({ ...prev, borc: Number(e.target.value) }))} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1" htmlFor="hesap-alacak">Alacak</label>
                    <input id="hesap-alacak" type="number" value={yeniHesapHareketi.alacak} onChange={(e) => setYeniHesapHareketi(prev => ({ ...prev, alacak: Number(e.target.value) }))} className="input" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={handleHesapHareketEkle} className="btn btn-primary">
                    Hareket Ekle
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mebbis' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mebbisDurumlari.map((durum, index) => (
                  <div key={index} className="card">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">{durum.baslik}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          durum.durum === 'hazir'
                            ? 'bg-green-100 text-green-700'
                            : durum.durum === 'eksik'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {durum.durum === 'hazir' ? 'Hazır' : durum.durum === 'eksik' ? 'Eksik' : 'Gönderildi'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{durum.mesaj}</p>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleMebbisAction('Toplu MEBBİS Gönderimi')} className="btn btn-primary">
                    Toplu MEBBİS Gönderimi
                  </button>
                  <button onClick={() => handleMebbisAction('MEBBİS Bağlantısını Temizle')} className="btn btn-outline">
                    MEBBİS Bağlantısını Temizle
                  </button>
                  <button onClick={() => handleMebbisAction('Durumu Güncelle')} className="btn btn-outline">
                    Durumu Güncelle
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

