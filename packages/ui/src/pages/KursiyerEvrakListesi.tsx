import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function KursiyerEvrakListesi() {
  const [kursiyerler, setKursiyerler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    adi: '',
    soyadi: '',
    tc_kimlik: '',
    aday_no: '',
    kurs_ozel_donemi: '',
    referans_grubu: '',
    donem_secimi: '',
    mebbis_donemi: '',
    durumu: '',
    evrak_secimi: [] as string[],
    genel_durum: '',
    kayit_sayisi: '30',
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

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="card">
        <h1 className="text-2xl font-bold text-gradient-primary mb-2">
          Evrak Listesi
        </h1>
        <p className="text-dark-600">Kaydı açmak için çift tıklayınız.</p>
      </div>

      {/* Toolbar */}
      <div className="card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="btn btn-outline">🖨️ Yazdır</button>
          <button className="btn btn-primary">📤 Excel'e Aktar</button>
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
            <label className="block text-sm font-medium text-dark-700 mb-1">Adı</label>
            <input
              type="text"
              value={filters.adi}
              onChange={(e) => setFilters({ ...filters, adi: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Soyadı</label>
            <input
              type="text"
              value={filters.soyadi}
              onChange={(e) => setFilters({ ...filters, soyadi: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">TC Kimlik No</label>
            <input
              type="text"
              value={filters.tc_kimlik}
              onChange={(e) => setFilters({ ...filters, tc_kimlik: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Durumu</label>
            <select
              value={filters.durumu}
              onChange={(e) => setFilters({ ...filters, durumu: e.target.value })}
              className="input"
            >
              <option value="">Tümü</option>
              <option value="var_tumu">Var (Tümü)</option>
              <option value="var_yuklendi">Var (Yüklendi)</option>
              <option value="var_yuklenmedi">Var (Yüklenmedi)</option>
              <option value="eksik">Eksik</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Evrak Seçimi</label>
            <select
              multiple
              value={filters.evrak_secimi}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setFilters({ ...filters, evrak_secimi: selected });
              }}
              className="input"
            >
              <option value="biyometrik">Biyometrik Fotoğraf</option>
              <option value="webcam">Kursiyer Webcam Fotoğrafı</option>
              <option value="ogrenim">Öğrenim Belgesi</option>
              <option value="saglik">Sağlık Raporu</option>
              <option value="sabika">Sabıka Kayıt Belgesi</option>
              <option value="imza">İmza Örneği</option>
              <option value="sozlesme_on">Sözleşme Belgesi Ön</option>
              <option value="sozlesme_arka">Sözleşme Belgesi Arka</option>
            </select>
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
                  <th>TC Kimlik No</th>
                  <th>Aday No</th>
                  <th>Adı</th>
                  <th>Soyadı</th>
                  <th>Biyometrik Fotoğraf</th>
                  <th>Kursiyer Webcam Fotoğrafı</th>
                  <th>Öğrenim Belgesi</th>
                  <th>Sağlık Raporu</th>
                  <th>Sabıka Kayıt Belgesi</th>
                  <th>İmza Örneği</th>
                  <th>Sözleşme Belgesi Ön</th>
                  <th>Sözleşme Belgesi Arka</th>
                </tr>
              </thead>
              <tbody>
                {kursiyerler.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center py-8 text-dark-500">
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
                      <td>{kursiyer.tc_kimlik || '-'}</td>
                      <td>-</td>
                      <td className="font-medium">{kursiyer.adi}</td>
                      <td className="font-medium">{kursiyer.soyadi}</td>
                      <td>
                        <span className="badge badge-danger">Eksik</span>
                      </td>
                      <td>
                        <span className="badge badge-danger">Eksik</span>
                      </td>
                      <td>
                        <span className="badge badge-danger">Eksik</span>
                      </td>
                      <td>
                        <span className="badge badge-danger">Eksik</span>
                      </td>
                      <td>
                        <span className="badge badge-danger">Eksik</span>
                      </td>
                      <td>
                        <span className="badge badge-danger">Eksik</span>
                      </td>
                      <td>
                        <span className="badge badge-danger">Eksik</span>
                      </td>
                      <td>
                        <span className="badge badge-danger">Eksik</span>
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

