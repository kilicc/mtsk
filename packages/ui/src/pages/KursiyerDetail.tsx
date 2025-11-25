import { useEffect, useMemo, useState } from 'react';
import type { Kursiyer } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

type DetailTab = 'genel' | 'evrak' | 'odeme' | 'ders' | 'sinav' | 'gorusme' | 'hesap' | 'mebbis';

interface KursiyerDetailProps {
  id: string;
  onBack: () => void;
}

interface EvrakDurumu {
  id: string;
  ad: string;
  durum: 'var' | 'eksik' | 'yok';
  teslimTarihi?: string;
  sorumlu?: string;
}

interface OdemePlani {
  id: number;
  taksit: string;
  sonTarih: string;
  tutar: number;
  kanal: string;
  durum: 'odendi' | 'beklemede' | 'gecikti';
}

interface DersKaydi {
  id: number;
  tarih: string;
  saat: string;
  egitimYeri: string;
  egitimTuru: string;
  personel: string;
  durum: 'planlandi' | 'tamamlandi' | 'iptal';
}

interface SinavKaydi {
  id: number;
  tur: string;
  tarih: string;
  durum: 'beklemede' | 'basarili' | 'basarisiz';
  not: string;
}

interface GorusmeNotu {
  id: number;
  tarih: string;
  kisi: string;
  kanal: string;
  konu: string;
  sonuc: string;
}

interface HesapHareketi {
  id: number;
  tarih: string;
  aciklama: string;
  borc: number;
  alacak: number;
  kanal: string;
}

interface MebbisIslem {
  id: number;
  baslik: string;
  aciklama: string;
  tarih: string;
  durum: 'tamamlandi' | 'beklemede' | 'eksik';
}

const tabs: { id: DetailTab; label: string }[] = [
  { id: 'genel', label: 'Genel Bilgiler' },
  { id: 'evrak', label: 'Evraklar' },
  { id: 'odeme', label: 'Ödeme Planı' },
  { id: 'ders', label: 'Dersler' },
  { id: 'sinav', label: 'Sınavlar' },
  { id: 'gorusme', label: 'Görüşmeler' },
  { id: 'hesap', label: 'Hesap Özeti' },
  { id: 'mebbis', label: 'MEBBİS İşlemleri' },
];

const statusColorMap: Record<string, string> = {
  hazir: 'text-green-700 bg-green-100',
  eksik: 'text-yellow-700 bg-yellow-100',
  beklemede: 'text-gray-700 bg-gray-100',
  gecikti: 'text-red-700 bg-red-100',
  odendi: 'text-green-700 bg-green-100',
  planlandi: 'text-blue-700 bg-blue-100',
  tamamlandi: 'text-green-700 bg-green-100',
  iptal: 'text-red-700 bg-red-100',
  basarili: 'text-green-700 bg-green-100',
  basarisiz: 'text-red-700 bg-red-100',
};

export default function KursiyerDetail({ id, onBack }: KursiyerDetailProps) {
  const [kursiyer, setKursiyer] = useState<Kursiyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DetailTab>('genel');

  const [evraklar, setEvraklar] = useState<EvrakDurumu[]>([
    { id: 'foto', ad: 'Biyometrik Fotoğraf', durum: 'var', teslimTarihi: '2024-10-12' },
    { id: 'kimlik', ad: 'T.C Kimlik Fotokopisi', durum: 'var' },
    { id: 'ogrenim', ad: 'Öğrenim Belgesi', durum: 'eksik', sorumlu: 'Taha Demir' },
    { id: 'saglik', ad: 'Sağlık Raporu', durum: 'yok' },
    { id: 'sozlesme', ad: 'Sözleşme Belgesi', durum: 'var', teslimTarihi: '2024-09-05' },
  ]);

  const [odemePlani, setOdemePlani] = useState<OdemePlani[]>([
    { id: 1, taksit: 'Peşinat', sonTarih: '2024-08-01', tutar: 10000, kanal: 'Nakit', durum: 'odendi' },
    { id: 2, taksit: '2. Taksit', sonTarih: '2024-09-01', tutar: 5000, kanal: 'Banka', durum: 'odendi' },
    { id: 3, taksit: '3. Taksit', sonTarih: '2024-10-01', tutar: 5000, kanal: 'Banka', durum: 'beklemede' },
    { id: 4, taksit: '4. Taksit', sonTarih: '2024-11-01', tutar: 5000, kanal: 'Banka', durum: 'gecikti' },
  ]);

  const [dersler] = useState<DersKaydi[]>([
    { id: 1, tarih: '2024-11-20', saat: '09:00', egitimYeri: 'Simülatör', egitimTuru: 'Teorik', personel: 'Ahmet Kılıç', durum: 'planlandi' },
    { id: 2, tarih: '2024-11-22', saat: '14:00', egitimYeri: 'Eğitim Alanı', egitimTuru: 'Uygulama', personel: 'Ayşe Demir', durum: 'planlandi' },
    { id: 3, tarih: '2024-10-12', saat: '13:30', egitimYeri: 'Akan Trafik', egitimTuru: 'Uygulama', personel: 'Okan Yıldız', durum: 'tamamlandi' },
  ]);

  const [sinavlar, setSinavlar] = useState<SinavKaydi[]>([
    { id: 1, tur: 'Teorik', tarih: '2024-08-10', durum: 'basarili', not: '85' },
    { id: 2, tur: 'Uygulama', tarih: '2024-09-05', durum: 'beklemede', not: '-' },
    { id: 3, tur: 'Direksiyon', tarih: '2024-10-18', durum: 'basarisiz', not: '65' },
  ]);

  const [gorusmeler, setGorusmeler] = useState<GorusmeNotu[]>([
    { id: 1, tarih: '2024-09-12', kisi: 'Veli - Mehmet Demir', kanal: 'Telefon', konu: 'Ödeme Planı', sonuc: 'Mutabık kalındı' },
    { id: 2, tarih: '2024-10-03', kisi: 'Kursiyer', kanal: 'Ofis', konu: 'Ders Takvimi', sonuc: 'Takvim güncellendi' },
  ]);

  const [yeniGorusme, setYeniGorusme] = useState<Omit<GorusmeNotu, 'id'>>({
    tarih: '',
    kisi: '',
    kanal: 'Telefon',
    konu: '',
    sonuc: '',
  });

  const [hesapHareketleri] = useState<HesapHareketi[]>([
    { id: 1, tarih: '2024-08-01', aciklama: 'Kayıt Bedeli', borc: 0, alacak: 10000, kanal: 'Nakit' },
    { id: 2, tarih: '2024-09-01', aciklama: '2. Taksit', borc: 0, alacak: 5000, kanal: 'Havale' },
    { id: 3, tarih: '2024-09-15', aciklama: 'Belge Ücreti', borc: 750, alacak: 0, kanal: 'Kasa' },
  ]);

  const [mebbisIslemleri] = useState<MebbisIslem[]>([
    { id: 1, baslik: 'Aday Kaydı', aciklama: 'Kayıt gönderimi tamamlandı', tarih: '2024-08-02', durum: 'tamamlandi' },
    { id: 2, baslik: 'Fotoğraf Güncelleme', aciklama: 'Yeni fotoğraf yüklemesi gerekli', tarih: '2024-09-10', durum: 'eksik' },
    { id: 3, baslik: 'Sağlık Bilgisi', aciklama: 'Son gönderim 12.09.2024', tarih: '2024-09-12', durum: 'tamamlandi' },
  ]);

  useEffect(() => {
    loadKursiyer();
  }, [id]);

  const loadKursiyer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/kursiyer/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setKursiyer(data);
    } catch (error) {
      console.error('Error loading kursiyer:', error);
      // Kursiyer yüklenemezse null kalır, kullanıcıya hata mesajı gösterilebilir
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0);

  const evrakStats = useMemo(
    () =>
      evraklar.reduce(
        (acc, evrak) => {
          acc[evrak.durum] += 1;
          return acc;
        },
        { var: 0, eksik: 0, yok: 0 }
      ),
    [evraklar]
  );

  const odemeOzet = useMemo(() => {
    const toplam = odemePlani.reduce((sum, item) => sum + item.tutar, 0);
    const odenen = odemePlani.filter(item => item.durum === 'odendi').reduce((sum, item) => sum + item.tutar, 0);
    return { toplam, odenen, kalan: toplam - odenen };
  }, [odemePlani]);

  const hesapOzet = useMemo(() => {
    const borc = hesapHareketleri.reduce((sum, item) => sum + item.borc, 0);
    const alacak = hesapHareketleri.reduce((sum, item) => sum + item.alacak, 0);
    return { borc, alacak, bakiye: alacak - borc };
  }, [hesapHareketleri]);

  const handleEvrakDurumChange = (id: string, durum: EvrakDurumu['durum']) => {
    setEvraklar(prev => prev.map(item => (item.id === id ? { ...item, durum } : item)));
  };

  const handleOdemeDurumChange = (id: number) => {
    setOdemePlani(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, durum: item.durum === 'odendi' ? 'beklemede' : 'odendi' }
          : item
      )
    );
  };

  const handleSinavDurumChange = (id: number, field: keyof SinavKaydi, value: string) => {
    setSinavlar(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleAddGorusme = () => {
    if (!yeniGorusme.tarih || !yeniGorusme.konu) {
      alert('Tarih ve konu zorunludur.');
      return;
    }
    setGorusmeler(prev => [...prev, { id: Date.now(), ...yeniGorusme }]);
    setYeniGorusme({ tarih: '', kisi: '', kanal: 'Telefon', konu: '', sonuc: '' });
  };

  const handleMebbisAction = (label: string) => {
    alert(`${label} işlemi başlatılıyor. (Entegrasyon yakında)`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!kursiyer) {
    return (
      <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Kursiyer bulunamadı</p>
          <button onClick={onBack} className="mt-4 btn btn-danger">
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const summaryCards = [
    { label: 'Genel Durum', value: kursiyer.durum === 1 ? 'Aktif' : 'Pasif', description: 'Kursiyer statüsü' },
    { label: 'MEBBİS Durumu', value: 'Hazırlık', description: 'Gönderime hazır' },
    { label: 'Ödenen Tutar', value: formatCurrency(odemeOzet.odenen), description: 'Tahsil edilen' },
    { label: 'Kalan Bakiye', value: formatCurrency(odemeOzet.kalan), description: 'Ödenmesi gereken' },
  ];

  const quickInfo = [
    { label: 'TC Kimlik', value: kursiyer.tc_kimlik || '-' },
    { label: 'Telefon', value: kursiyer.telefon || '-' },
    { label: 'E-posta', value: kursiyer.email || '-' },
    { label: 'Kayıt Tarihi', value: kursiyer.kayit_tarihi ? new Date(kursiyer.kayit_tarihi).toLocaleDateString('tr-TR') : '-' },
  ];

  const actionButtons = [
    { label: 'Düzenle', onClick: () => alert('Düzenleme ekranı yakında.') },
    { label: 'Yazdır', onClick: () => window.print() },
    { label: 'Export', onClick: () => alert('Dışa aktarma işlemi yakında.') },
    { label: 'Sil', onClick: () => alert('Silme işlemi için yetki gereklidir.') },
  ];

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-900 mb-2">
            ← Geri
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {kursiyer.adi} {kursiyer.soyadi}
          </h1>
          <p className="text-sm text-gray-500">Kursiyer detay bilgileri</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {actionButtons.map(action => (
            <button key={action.label} onClick={action.onClick} className="btn btn-outline text-sm">
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="card p-4">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickInfo.map(info => (
            <div key={info.label}>
              <p className="text-xs text-gray-500">{info.label}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{info.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-0">
        <div className="flex flex-wrap gap-2 border-b border-gray-100 px-4 pt-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === tab.id ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
          {activeTab === 'genel' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border border-gray-100 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Kişisel Bilgiler</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <p className="text-xs text-gray-500">Ad</p>
                      <p>{kursiyer.adi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Soyad</p>
                      <p>{kursiyer.soyadi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">TC Kimlik</p>
                      <p>{kursiyer.tc_kimlik || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Doğum Tarihi</p>
                      <p>{kursiyer.dogum_tarihi ? new Date(kursiyer.dogum_tarihi).toLocaleDateString('tr-TR') : '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Telefon</p>
                      <p>{kursiyer.telefon || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Adres</p>
                      <p>{kursiyer.adres || '-'}</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Durum Tabloları</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <span>Genel Durum</span>
                      <span className={`px-3 py-1 rounded-full text-xs ${statusColorMap['hazir']}`}>
                        {kursiyer.durum === 1 ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ödeme Durumu</span>
                      <span className={`px-3 py-1 rounded-full text-xs ${statusColorMap[odemeOzet.kalan === 0 ? 'odendi' : 'beklemede']}`}>
                        {odemeOzet.kalan === 0 ? 'Tamamlandı' : 'Devam Ediyor'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Evrak Durumu</span>
                      <span className={`px-3 py-1 rounded-full text-xs ${statusColorMap[evrakStats.eksik === 0 && evrakStats.yok === 0 ? 'hazir' : 'eksik']}`}>
                        {evrakStats.eksik === 0 && evrakStats.yok === 0 ? 'Tamamlandı' : 'Eksikler Var'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-100 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Notlar & Güncellemeler</h3>
                <div className="space-y-4 text-sm text-gray-700">
                  <div>
                    <p className="text-xs text-gray-500">Son İşlem</p>
                    <p>Teorik sınav başarıyla tamamlandı, uygulama eğitimi planlandı.</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Hatırlatmalar</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Sağlık raporu güncellemesi bekleniyor.</li>
                      <li>4. taksit ödemesi gecikti, veli bilgilendirilecek.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evrak' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="badge">Var: {evrakStats.var}</span>
                <span className="badge badge-warning">Eksik: {evrakStats.eksik}</span>
                <span className="badge badge-danger">Yok: {evrakStats.yok}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="table text-sm">
                  <thead>
                    <tr>
                      <th>Evrak</th>
                      <th>Durum</th>
                      <th>Teslim Tarihi</th>
                      <th>Sorumlu</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evraklar.map(item => (
                      <tr key={item.id}>
                        <td>{item.ad}</td>
                        <td>
                          <select
                            value={item.durum}
                            onChange={(e) => handleEvrakDurumChange(item.id, e.target.value as EvrakDurumu['durum'])}
                            className="input text-sm"
                            aria-label={`${item.ad} evrak durumu`}
                          >
                            <option value="var">Var</option>
                            <option value="eksik">Eksik</option>
                            <option value="yok">Yok</option>
                          </select>
                        </td>
                        <td>{item.teslimTarihi || '-'}</td>
                        <td>{item.sorumlu || '-'}</td>
                        <td>
                          <button className="text-sm text-gray-600 hover:text-gray-900" onClick={() => alert('Evrak önizleme yakında.')}>
                            Önizle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'odeme' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="border border-gray-100 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Toplam Tutar</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{formatCurrency(odemeOzet.toplam)}</p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Ödenen</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{formatCurrency(odemeOzet.odenen)}</p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Kalan</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{formatCurrency(odemeOzet.kalan)}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="table text-sm">
                  <thead>
                    <tr>
                      <th>Taksit</th>
                      <th>Son Tarih</th>
                      <th>Tutar</th>
                      <th>Kanal</th>
                      <th>Durum</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {odemePlani.map(item => (
                      <tr key={item.id}>
                        <td>{item.taksit}</td>
                        <td>{item.sonTarih}</td>
                        <td>{formatCurrency(item.tutar)}</td>
                        <td>{item.kanal}</td>
                        <td>
                          <span className={`px-3 py-1 rounded-full text-xs ${statusColorMap[item.durum]}`}>
                            {item.durum === 'odendi' ? 'Ödendi' : item.durum === 'gecikti' ? 'Gecikti' : 'Beklemede'}
                          </span>
                        </td>
                        <td>
                          <button className="text-sm text-gray-600 hover:text-gray-900" onClick={() => handleOdemeDurumChange(item.id)}>
                            {item.durum === 'odendi' ? 'Ödemeyi Geri Al' : 'Ödemeyi İşaretle'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ders' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="table text-sm">
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Saat</th>
                      <th>Eğitim Türü</th>
                      <th>Eğitim Yeri</th>
                      <th>Personel</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dersler.map(ders => (
                      <tr key={ders.id}>
                        <td>{ders.tarih}</td>
                        <td>{ders.saat}</td>
                        <td>{ders.egitimTuru}</td>
                        <td>{ders.egitimYeri}</td>
                        <td>{ders.personel}</td>
                        <td>
                          <span className={`px-3 py-1 rounded-full text-xs ${statusColorMap[ders.durum]}`}>
                            {ders.durum === 'planlandi'
                              ? 'Planlandı'
                              : ders.durum === 'tamamlandi'
                                ? 'Tamamlandı'
                                : 'İptal'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sinav' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="table text-sm">
                  <thead>
                    <tr>
                      <th>Sınav Türü</th>
                      <th>Tarih</th>
                      <th>Durum</th>
                      <th>Not</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sinavlar.map(sinav => (
                      <tr key={sinav.id}>
                        <td>{sinav.tur}</td>
                        <td>{sinav.tarih}</td>
                        <td>
                          <select
                            value={sinav.durum}
                            onChange={(e) => handleSinavDurumChange(sinav.id, 'durum', e.target.value)}
                            className="input text-sm"
                            aria-label={`${sinav.tur} sınav durumu`}
                          >
                            <option value="beklemede">Beklemede</option>
                            <option value="basarili">Başarılı</option>
                            <option value="basarisiz">Başarısız</option>
                          </select>
                        </td>
                        <td>
                          <input
                            value={sinav.not}
                            onChange={(e) => handleSinavDurumChange(sinav.id, 'not', e.target.value)}
                            className="input text-sm"
                            placeholder="Not"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'gorusme' && (
            <div className="space-y-6">
              <div className="space-y-3">
                {gorusmeler.map(gorusme => (
                  <div key={gorusme.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{gorusme.konu}</p>
                        <p className="text-xs text-gray-500">{gorusme.tarih} • {gorusme.kisi} • {gorusme.kanal}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{gorusme.sonuc}</p>
                  </div>
                ))}
                {gorusmeler.length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-6">
                    Görüşme kaydı bulunamadı.
                  </div>
                )}
              </div>
              <div className="border border-gray-100 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Yeni Görüşme Ekle</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" htmlFor="gorusme-tarih">Tarih</label>
                    <input
                      id="gorusme-tarih"
                      type="date"
                      value={yeniGorusme.tarih}
                      onChange={(e) => setYeniGorusme(prev => ({ ...prev, tarih: e.target.value }))}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" htmlFor="gorusme-kisi">Görüşülen Kişi</label>
                    <input
                      id="gorusme-kisi"
                      value={yeniGorusme.kisi}
                      onChange={(e) => setYeniGorusme(prev => ({ ...prev, kisi: e.target.value }))}
                      className="input"
                      placeholder="Kişi / Kurum"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Kanal</label>
                    <select
                      value={yeniGorusme.kanal}
                      onChange={(e) => setYeniGorusme(prev => ({ ...prev, kanal: e.target.value }))}
                      className="input"
                      aria-label="Görüşme kanalı"
                    >
                      <option value="Telefon">Telefon</option>
                      <option value="Ofis">Ofis</option>
                      <option value="E-posta">E-posta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" htmlFor="gorusme-konu">Konu</label>
                    <input
                      id="gorusme-konu"
                      value={yeniGorusme.konu}
                      onChange={(e) => setYeniGorusme(prev => ({ ...prev, konu: e.target.value }))}
                      className="input"
                      placeholder="Görüşme konusu"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1" htmlFor="gorusme-sonuc">Sonuç / Not</label>
                    <textarea
                      id="gorusme-sonuc"
                      value={yeniGorusme.sonuc}
                      onChange={(e) => setYeniGorusme(prev => ({ ...prev, sonuc: e.target.value }))}
                      className="input"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="btn btn-primary text-sm" onClick={handleAddGorusme}>
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hesap' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="border border-gray-100 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Toplam Borç</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{formatCurrency(hesapOzet.borc)}</p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Toplam Alacak</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{formatCurrency(hesapOzet.alacak)}</p>
                </div>
                <div className="border border-gray-100 rounded-lg p-4">
                  <p className="text-xs text-gray-500">Bakiye</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{formatCurrency(hesapOzet.bakiye)}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="table text-sm">
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Açıklama</th>
                      <th>Kanal</th>
                      <th>Borç</th>
                      <th>Alacak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hesapHareketleri.map(hareket => (
                      <tr key={hareket.id}>
                        <td>{hareket.tarih}</td>
                        <td>{hareket.aciklama}</td>
                        <td>{hareket.kanal}</td>
                        <td>{formatCurrency(hareket.borc)}</td>
                        <td>{formatCurrency(hareket.alacak)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'mebbis' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-primary text-sm" onClick={() => handleMebbisAction('MEBBİS Güncelle')}>
                  MEBBİS Güncelle
                </button>
                <button className="btn btn-outline text-sm" onClick={() => handleMebbisAction('Bağlantıyı Temizle')}>
                  Bağlantıyı Temizle
                </button>
                <button className="btn btn-outline text-sm" onClick={() => handleMebbisAction('Sonuçları Çek')}>
                  Sonuçları Çek
                </button>
              </div>
              <div className="space-y-2">
                {mebbisIslemleri.map(islem => (
                  <div key={islem.id} className="border border-gray-100 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{islem.baslik}</p>
                      <p className="text-xs text-gray-500">{islem.aciklama}</p>
                      <p className="text-xs text-gray-400 mt-1">{islem.tarih}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${statusColorMap[islem.durum]}`}>
                      {islem.durum === 'tamamlandi' ? 'Tamamlandı' : islem.durum === 'eksik' ? 'Eksik' : 'Beklemede'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
