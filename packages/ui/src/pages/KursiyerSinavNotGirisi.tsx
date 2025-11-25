import { useState, useEffect, useRef } from 'react';

interface SinavKursiyer {
  id: number;
  kursiyerId: number;
  adayNo: string;
  tcNo: string;
  adiSoyadi: string;
  donemi: string;
  istedigiSertifika: string;
  sinavNotu: string;
  sinavDurumu: string;
}

type SinavTuru = 'teorik' | 'uygulama' | '';
type Kaynak = 'mebbisten' | 'sistemden';

export default function KursiyerSinavNotGirisi() {
  const [kaynak, setKaynak] = useState<Kaynak>('sistemden');
  const [sinavTuru, setSinavTuru] = useState<SinavTuru>('');
  const [sinavTarihi, setSinavTarihi] = useState('');
  const [otomatikKaydet, setOtomatikKaydet] = useState(true);
  const [kursiyerler, setKursiyerler] = useState<SinavKursiyer[]>([]);
  const [sinavTarihleri, setSinavTarihleri] = useState<string[]>([]);
  const [showKursiyerEkleModal, setShowKursiyerEkleModal] = useState(false);
  const [sortField, setSortField] = useState<keyof SinavKursiyer | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const notInputRefs = useRef<Record<number, HTMLInputElement>>({});
  const durumSelectRefs = useRef<Record<number, HTMLSelectElement>>({});

  useEffect(() => {
    if (sinavTuru) {
      loadSinavTarihleri();
    } else {
      setSinavTarihleri([]);
      setSinavTarihi('');
    }
  }, [sinavTuru]);

  const loadSinavTarihleri = async () => {
    try {
      // Mock sınav tarihleri
      const mockTarihler = [
        '2024-11-20',
        '2024-11-25',
        '2024-12-01',
        '2024-12-05',
        '2024-12-10',
      ];
      setSinavTarihleri(mockTarihler);
    } catch (error) {
      console.error('Error loading sinav tarihleri:', error);
    }
  };

  const handleKursiyerEkle = () => {
    setShowKursiyerEkleModal(true);
  };

  const handleKursiyerSec = (selectedKursiyerler: any[]) => {
    const newKursiyerler: SinavKursiyer[] = selectedKursiyerler.map((k, idx) => ({
      id: Date.now() + idx,
      kursiyerId: k.id,
      adayNo: k.aday_no || `A${1000 + idx}`,
      tcNo: k.tc_kimlik || '',
      adiSoyadi: `${k.adi} ${k.soyadi}`,
      donemi: k.mebbis_donemi || '2024-1',
      istedigiSertifika: k.istedigi_sertifika || '-',
      sinavNotu: '',
      sinavDurumu: '',
    }));
    setKursiyerler([...kursiyerler, ...newKursiyerler]);
    setShowKursiyerEkleModal(false);
  };

  const handleSinavlariKaydet = async () => {
    if (kursiyerler.length === 0) {
      alert('Kaydedilecek sınav kaydı bulunamadı.');
      return;
    }

    try {
      // TODO: API call
      alert(`${kursiyerler.length} sınav kaydı başarıyla kaydedildi!`);
      console.log('Sınavlar kaydediliyor:', kursiyerler);
    } catch (error) {
      console.error('Error saving exams:', error);
      alert('Sınavlar kaydedilirken bir hata oluştu.');
    }
  };

  const handleMebbisCek = async () => {
    try {
      // TODO: MEBBİS'ten sonuçları çek
      alert('MEBBİS sonuçları çekiliyor... (Yakında)');
    } catch (error) {
      console.error('Error fetching from MEBBİS:', error);
    }
  };

  const handleMebbisBaglantisiniTemizle = async () => {
    if (confirm('MEBBİS bağlantısını temizlemek istediğinize emin misiniz?')) {
      try {
        // TODO: API call
        alert('MEBBİS bağlantısı temizlendi. (Yakında)');
      } catch (error) {
        console.error('Error clearing MEBBİS connection:', error);
      }
    }
  };

  const handleNotKaydet = async (kursiyerId: number, not: string, durum: string) => {
    if (!otomatikKaydet) return;

    try {
      // TODO: API call
      setKursiyerler(prev =>
        prev.map(k =>
          k.id === kursiyerId
            ? { ...k, sinavNotu: not || k.sinavNotu, sinavDurumu: durum || k.sinavDurumu }
            : k
        )
      );
      console.log('Not kaydediliyor:', { kursiyerId, not, durum });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleNotChange = (id: number, value: string) => {
    setKursiyerler(prev =>
      prev.map(k => (k.id === id ? { ...k, sinavNotu: value } : k))
    );
  };

  const handleDurumChange = (id: number, value: string) => {
    setKursiyerler(prev =>
      prev.map(k => (k.id === id ? { ...k, sinavDurumu: value } : k))
    );
    if (otomatikKaydet) {
      const kursiyer = kursiyerler.find(k => k.id === id);
      if (kursiyer) {
        handleNotKaydet(id, kursiyer.sinavNotu, value);
      }
    }
  };

  const handleNotBlur = (id: number) => {
    if (otomatikKaydet) {
      const kursiyer = kursiyerler.find(k => k.id === id);
      if (kursiyer) {
        handleNotKaydet(id, kursiyer.sinavNotu, kursiyer.sinavDurumu);
      }
    }
  };

  const handleNotKeyDown = (id: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && otomatikKaydet) {
      const kursiyer = kursiyerler.find(k => k.id === id);
      if (kursiyer) {
        handleNotKaydet(id, (e.target as HTMLInputElement).value, kursiyer.sinavDurumu);
      }
    }
  };

  const handleSort = (field: keyof SinavKursiyer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedKursiyerler = [...kursiyerler].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const handleOzelTarih = () => {
    const tarih = prompt('Özel tarih girin (YYYY-MM-DD):');
    if (tarih) {
      setSinavTarihi(tarih);
    }
  };

  const handleKursiyerSil = (id: number) => {
    setKursiyerler(prev => prev.filter(k => k.id !== id));
  };

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="card">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Kursiyer Sınav İşlemleri
        </h1>
        <p className="text-sm text-gray-600">Sınav sonuçlarını toplu olarak girmenizi sağlar.</p>
      </div>

      {/* Üst Toolbar */}
      <div className="card flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSinavlariKaydet}
            disabled={kursiyerler.length === 0}
            className="btn btn-primary text-sm"
          >
            Sınavları Kayıt Et
          </button>
          <button onClick={handleMebbisCek} className="btn btn-outline text-sm">
            Sonuçları Mebbis'ten Çek
          </button>
          <button onClick={handleMebbisBaglantisiniTemizle} className="btn btn-outline text-sm">
            Mebbis Bağlantısını Temizle
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="otomatik-kaydet-not"
            checked={otomatikKaydet}
            onChange={(e) => setOtomatikKaydet(e.target.checked)}
            className="w-4 h-4 text-gray-600"
          />
          <label htmlFor="otomatik-kaydet-not" className="text-sm text-gray-700">
            Otomatik Kaydet
          </label>
        </div>
      </div>

      {/* Sınav Sonucu Ekle Bölümü */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Sınav Sonucu Ekle</h3>
        <p className="text-sm text-gray-600 mb-4">
          Sınav sonuçlarını toplu olarak girmenizi sağlar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="not-kaynak">Kaynak</label>
            <select
              id="not-kaynak"
              value={kaynak}
              onChange={(e) => setKaynak(e.target.value as Kaynak)}
              className="input"
            >
              <option value="mebbisten">Mebbisten Çek</option>
              <option value="sistemden">Sistemden Çek</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="not-turu">Sınav Türü</label>
            <select
              id="not-turu"
              value={sinavTuru}
              onChange={(e) => {
                setSinavTuru(e.target.value as SinavTuru);
                setSinavTarihi('');
              }}
              className="input"
            >
              <option value="">Seçiniz</option>
              <option value="teorik">Teorik</option>
              <option value="uygulama">Uygulama</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="not-tarihi">Sınav Tarihi</label>
            <div className="flex gap-2">
              <select
                id="not-tarihi"
                value={sinavTarihi}
                onChange={(e) => setSinavTarihi(e.target.value)}
                className="input flex-1"
                disabled={!sinavTuru}
              >
                <option value="">Sınav Türü Seçiniz..</option>
                {sinavTarihleri.map(tarih => (
                  <option key={tarih} value={tarih}>
                    {new Date(tarih).toLocaleDateString('tr-TR')}
                  </option>
                ))}
              </select>
              <button onClick={handleOzelTarih} className="btn btn-outline text-sm">
                Özel Tarih
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleKursiyerEkle}
            disabled={!sinavTarihi || !sinavTuru}
            className="btn btn-primary text-sm"
          >
            Kursiyer Ekle
          </button>
        </div>
      </div>

      {/* Eklenen Kursiyerler */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Eklenen Kursiyerler</h3>
        </div>

        {sortedKursiyerler.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-2">Henüz kursiyer eklenmedi.</p>
            <p className="text-sm">Sınav türü ve tarihi seçtikten sonra "Kursiyer Ekle" butonuna tıklayın.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table text-sm">
              <thead>
                <tr>
                  <th>Aday No</th>
                  <th>T.C No</th>
                  <th>Adı Soyadı</th>
                  <th>Dönemi</th>
                  <th>İstediği Sertifika</th>
                  <th>Sınav Notu</th>
                  <th>Sınav Durumu</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {sortedKursiyerler.map((kursiyer) => (
                  <tr key={kursiyer.id} className="hover:bg-gray-50">
                    <td
                      className="cursor-pointer"
                      onClick={() => handleSort('adayNo')}
                    >
                      {kursiyer.adayNo}
                      {sortField === 'adayNo' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </td>
                    <td
                      className="cursor-pointer"
                      onClick={() => handleSort('tcNo')}
                    >
                      {kursiyer.tcNo}
                      {sortField === 'tcNo' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </td>
                    <td
                      className="cursor-pointer font-medium"
                      onClick={() => handleSort('adiSoyadi')}
                    >
                      {kursiyer.adiSoyadi}
                      {sortField === 'adiSoyadi' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </td>
                    <td
                      className="cursor-pointer"
                      onClick={() => handleSort('donemi')}
                    >
                      {kursiyer.donemi}
                      {sortField === 'donemi' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </td>
                    <td
                      className="cursor-pointer"
                      onClick={() => handleSort('istedigiSertifika')}
                    >
                      {kursiyer.istedigiSertifika}
                      {sortField === 'istedigiSertifika' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </td>
                    <td>
                      <input
                        ref={(el) => {
                          if (el) notInputRefs.current[kursiyer.id] = el;
                        }}
                        type="number"
                        min="0"
                        max="100"
                        value={kursiyer.sinavNotu}
                        onChange={(e) => handleNotChange(kursiyer.id, e.target.value)}
                        onBlur={() => handleNotBlur(kursiyer.id)}
                        onKeyDown={(e) => handleNotKeyDown(kursiyer.id, e)}
                        className="input text-sm w-20"
                        placeholder="Not"
                      />
                    </td>
                    <td>
                      <select
                        ref={(el) => {
                          if (el) durumSelectRefs.current[kursiyer.id] = el;
                        }}
                        value={kursiyer.sinavDurumu}
                        onChange={(e) => handleDurumChange(kursiyer.id, e.target.value)}
                        className="input text-sm"
                        aria-label="Sınav durumu"
                      >
                        <option value="">Seçiniz</option>
                        <option value="gecti">Geçti</option>
                        <option value="kaldi">Kaldı</option>
                        <option value="beklemede">Beklemede</option>
                      </select>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const not = notInputRefs.current[kursiyer.id]?.value || '';
                            const durum = durumSelectRefs.current[kursiyer.id]?.value || '';
                            handleNotKaydet(kursiyer.id, not, durum);
                          }}
                          className="btn btn-primary text-xs"
                        >
                          Not Gir
                        </button>
                        <button
                          onClick={() => handleKursiyerSil(kursiyer.id)}
                          className="btn btn-outline text-xs text-red-600 hover:bg-red-50"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Kursiyer Seçim Modal */}
      {showKursiyerEkleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Kursiyer Seç</h3>
              <button
                onClick={() => setShowKursiyerEkleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {kaynak === 'mebbisten'
                  ? 'MEBBİS\'ten kursiyerler çekilecek. (Yakında)'
                  : 'Sistemden kursiyerler listelenecek. (Yakında)'}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  // Mock kursiyer seçimi
                  const mockKursiyerler = [
                    { id: 1, adi: 'Ahmet', soyadi: 'Yılmaz', tc_kimlik: '11111111111', aday_no: 'A001', mebbis_donemi: '2024-1', istedigi_sertifika: 'B' },
                    { id: 2, adi: 'Ayşe', soyadi: 'Demir', tc_kimlik: '22222222222', aday_no: 'A002', mebbis_donemi: '2024-1', istedigi_sertifika: 'A2' },
                  ];
                  handleKursiyerSec(mockKursiyerler);
                }}
                className="btn btn-primary text-sm"
              >
                Örnek Kursiyerler Ekle
              </button>
              <button
                onClick={() => setShowKursiyerEkleModal(false)}
                className="btn btn-outline text-sm"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
