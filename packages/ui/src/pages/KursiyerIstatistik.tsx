import { useState } from 'react';

export default function KursiyerIstatistik() {
  const [istatistikTuru, setIstatistikTuru] = useState('istenen_sertifika');
  const [filters, setFilters] = useState({
    kayit_tarihi_baslangic: '',
    kayit_tarihi_bitis: '',
    kurs_ozel_donemi: '',
    kategori: '',
    alt_kategori: '',
    referans_grubu: '',
    donem_secimi: '',
    mebbis_donemi: '',
  });
  const [istatistikler, setIstatistikler] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const istatistikTurleri = [
    { value: 'istenen_sertifika', label: 'İstenen Sertifika' },
    { value: 'cinsiyet', label: 'Cinsiyet' },
    { value: 'donemi', label: 'Dönemi' },
    { value: 'kurs_ozel_donemi', label: 'Kurs Özel Dönemi' },
    { value: 'ozel_grubu', label: 'Özel Grubu' },
    { value: 'referans_grubu', label: 'Referans Grubu' },
    { value: 'ogrenim_durumu', label: 'Öğrenim durumu' },
    { value: 'riskli_kursiyer', label: 'Riskli Kursiyer' },
    { value: 'avukata_verildi', label: 'Avukata Verildi' },
    { value: 'genel_kursiyer_durumu', label: 'Genel Kursiyer Durumu' },
    { value: 'teorik_sinav_durumu', label: 'Teorik Sınav Durumu' },
    { value: 'uygulama_sinav_durumu', label: 'Uygulama Sınav Durumu' },
    { value: 'belge_durumu', label: 'Belge Durumu' },
    { value: 'odeme_durumu', label: 'Ödeme Durumu' },
    { value: 'kayit_tarihi', label: 'Kayıt Tarihi' },
    { value: 'arac_kullanabiliyor', label: 'Araç Kullanabiliyor' },
    { value: 'kan_grubu', label: 'Kan Grubu' },
  ];

  const handleFiltrele = async () => {
    setLoading(true);
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setIstatistikler([
        { kategori: 'B', adet: 150 },
        { kategori: 'C', adet: 80 },
        { kategori: 'D', adet: 45 },
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="card">
        <h1 className="text-2xl font-bold text-gradient-primary mb-2">
          İstatistik Listesi (Kayıt Tarihine Göre)
        </h1>
      </div>

      {/* Toolbar */}
      <div className="card flex items-center justify-between">
        <button className="btn btn-primary">📤 Excel'e Aktar</button>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline">⏮️</button>
          <button className="btn btn-outline">⏭️</button>
        </div>
      </div>

      {/* Detaylı Arama */}
      <div className="card">
        <h3 className="text-lg font-bold text-dark-900 mb-4">Detaylı Arama</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">İstatistik</label>
            <select
              value={istatistikTuru}
              onChange={(e) => setIstatistikTuru(e.target.value)}
              className="input"
            >
              {istatistikTurleri.map((tur) => (
                <option key={tur.value} value={tur.value}>
                  {tur.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Kayıt Tarihi (Başlangıç)</label>
            <input
              type="date"
              value={filters.kayit_tarihi_baslangic}
              onChange={(e) => setFilters({ ...filters, kayit_tarihi_baslangic: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Kayıt Tarihi (Bitiş)</label>
            <input
              type="date"
              value={filters.kayit_tarihi_bitis}
              onChange={(e) => setFilters({ ...filters, kayit_tarihi_bitis: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Kurs Özel Dönemi</label>
            <select
              value={filters.kurs_ozel_donemi}
              onChange={(e) => setFilters({ ...filters, kurs_ozel_donemi: e.target.value })}
              className="input"
            >
              <option value="">Tümü</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Kategori</label>
            <select
              value={filters.kategori}
              onChange={(e) => setFilters({ ...filters, kategori: e.target.value })}
              className="input"
            >
              <option value="">Tümü</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Alt Kategori</label>
            <select
              value={filters.alt_kategori}
              onChange={(e) => setFilters({ ...filters, alt_kategori: e.target.value })}
              className="input"
              disabled={!filters.kategori}
            >
              <option value="">Öncelikle Kategori Seçiniz</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleFiltrele} className="btn btn-primary">
            🔍 Filtrele
          </button>
          <button className="btn btn-outline">🗑️ Temizle</button>
        </div>
      </div>

      {/* İstatistik Tablosu */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>{istatistikTurleri.find(t => t.value === istatistikTuru)?.label || 'Kategori'}</th>
                  <th>Adet</th>
                </tr>
              </thead>
              <tbody>
                {istatistikler.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-8 text-dark-500">
                      Filtreleme yaparak istatistikleri görüntüleyin
                    </td>
                  </tr>
                ) : (
                  istatistikler.map((istatistik, index) => (
                    <tr key={index} className="hover:bg-primary-50">
                      <td className="font-medium">{istatistik.kategori}</td>
                      <td className="font-bold text-primary-600">{istatistik.adet}</td>
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

