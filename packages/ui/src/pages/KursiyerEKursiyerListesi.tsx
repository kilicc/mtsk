import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function KursiyerEKursiyerListesi() {
  const [kursiyerler, setKursiyerler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    mebbis_donemi: '',
    istedigi_sertifika: '',
    adi: '',
    soyadi: '',
    tc_kimlik: '',
    mevcut_belge: '',
    aday_no_min: '',
    aday_no_max: '',
    aday_no_durumu: '',
    genel_durum: '',
    kategori: '',
    alt_kategori: '',
    kurs_ozel_donemi: '',
    siralama: '',
    ters: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/kursiyer`);
      const data = await response.json();
      setKursiyerler(data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopluKayit = async () => {
    if (!confirm('E-Sınav MTSK toplu kayıt işlemi yapılacak. Devam edilsin mi?')) {
      return;
    }
    try {
      // TODO: API call
      alert('Toplu kayıt işlemi başlatıldı!');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="card">
        <h1 className="text-2xl font-bold text-gradient-primary mb-2">
          E-Kursiyer Listesi
        </h1>
        <p className="text-dark-600">Kaydı açmak için çift tıklayınız.</p>
      </div>

      {/* Toolbar */}
      <div className="card flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button className="btn btn-accent">💬 SMS</button>
          <button onClick={handleTopluKayit} className="btn btn-primary">
            📥 E-Sınav MTSK - Toplu Kayıt
          </button>
        </div>
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
            <label className="block text-sm font-medium text-dark-700 mb-1">Mebbis Dönemi</label>
            <select
              value={filters.mebbis_donemi}
              onChange={(e) => setFilters({ ...filters, mebbis_donemi: e.target.value })}
              className="input"
            >
              <option value="">Lütfen Dönem Seçiniz</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">İstediği Sertifika</label>
            <select
              value={filters.istedigi_sertifika}
              onChange={(e) => setFilters({ ...filters, istedigi_sertifika: e.target.value })}
              className="input"
              disabled={!filters.mebbis_donemi}
            >
              <option value="">Lütfen Sertifika Seçiniz</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Sıralama</label>
            <select
              value={filters.siralama}
              onChange={(e) => setFilters({ ...filters, siralama: e.target.value })}
              className="input"
            >
              <option value="">Yok</option>
              <option value="adi">Adı</option>
              <option value="soyadi">Soyadı</option>
              <option value="aday_no">Aday No</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.ters}
              onChange={(e) => setFilters({ ...filters, ters: e.target.checked })}
              className="w-4 h-4 text-primary-600"
            />
            <label className="ml-2 text-sm text-dark-700">Ters</label>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="btn btn-primary">🔍 Filtrele</button>
          <button className="btn btn-outline">🗑️ Temizle</button>
        </div>
      </div>

      {/* Tablo */}
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
                  <th>No</th>
                  <th>İşlem</th>
                  <th>Seçim</th>
                  <th>Aday No</th>
                  <th>TC Kimlik No</th>
                  <th>Adı</th>
                  <th>Soyadı</th>
                  <th>Cep Telefonu</th>
                  <th>İstediği Sertifika</th>
                  <th>E-Kursiyer</th>
                  <th>E-Sınav MTSK</th>
                </tr>
              </thead>
              <tbody>
                {kursiyerler.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-8 text-dark-500">
                      Kayıt bulunamadı
                    </td>
                  </tr>
                ) : (
                  kursiyerler.map((kursiyer, index) => (
                    <tr
                      key={kursiyer.id}
                      className="cursor-pointer hover:bg-primary-50"
                      onDoubleClick={() => console.log('Detay:', kursiyer.id)}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <button className="text-primary-600 hover:text-primary-800">👁️</button>
                      </td>
                      <td>
                        <input type="checkbox" className="w-4 h-4" />
                      </td>
                      <td>-</td>
                      <td>{kursiyer.tc_kimlik || '-'}</td>
                      <td className="font-medium">{kursiyer.adi}</td>
                      <td className="font-medium">{kursiyer.soyadi}</td>
                      <td>{kursiyer.telefon || '-'}</td>
                      <td>-</td>
                      <td>
                        <span className="badge badge-success">✓</span>
                      </td>
                      <td>
                        <span className="badge badge-success">✓</span>
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

