import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function KursiyerEKursiyerAnaliz() {
  const [kursiyerler, setKursiyerler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    adi: '',
    soyadi: '',
    tc_kimlik: '',
    cep_telefonu: '',
    mevcut_belge: '',
    istedigi_sertifika: '',
    aday_no_min: '',
    aday_no_max: '',
    basarili_sinav_min: '',
    basarili_sinav_max: '',
    basarisiz_sinav_min: '',
    basarisiz_sinav_max: '',
    toplam_giris_min: '',
    toplam_giris_max: '',
    basarili_oran_min: '',
    basarili_oran_max: '',
    basarisiz_oran_min: '',
    basarisiz_oran_max: '',
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
          Kursiyer E-Sınav Listesi
        </h1>
        <p className="text-dark-600">Kaydı açmak için çift tıklayınız.</p>
      </div>

      {/* Toolbar */}
      <div className="card flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button className="btn btn-accent">💬 SMS</button>
          <button className="btn btn-outline">📦 Toplu İşlem</button>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline">⏮️</button>
          <button className="btn btn-outline">⏪</button>
          <span className="text-sm text-dark-600 px-2">Sayfa 1</span>
          <button className="btn btn-outline">⏩</button>
          <button className="btn btn-outline">⏭️</button>
        </div>
      </div>

      {/* Detaylı Arama - F-1 Tab ile benzer + ek sınav filtreleri */}
      <div className="card">
        <h3 className="text-lg font-bold text-dark-900 mb-4">Filtreleme (F-1, F-2, F-3, S-1)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Başarılı Sınav (Min)</label>
            <input
              type="number"
              value={filters.basarili_sinav_min}
              onChange={(e) => setFilters({ ...filters, basarili_sinav_min: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Başarılı Sınav (Max)</label>
            <input
              type="number"
              value={filters.basarili_sinav_max}
              onChange={(e) => setFilters({ ...filters, basarili_sinav_max: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Başarısız Sınav (Min)</label>
            <input
              type="number"
              value={filters.basarisiz_sinav_min}
              onChange={(e) => setFilters({ ...filters, basarisiz_sinav_min: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Başarısız Sınav (Max)</label>
            <input
              type="number"
              value={filters.basarisiz_sinav_max}
              onChange={(e) => setFilters({ ...filters, basarisiz_sinav_max: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Toplam Giriş (Min)</label>
            <input
              type="number"
              value={filters.toplam_giris_min}
              onChange={(e) => setFilters({ ...filters, toplam_giris_min: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Toplam Giriş (Max)</label>
            <input
              type="number"
              value={filters.toplam_giris_max}
              onChange={(e) => setFilters({ ...filters, toplam_giris_max: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Başarılı Oran (Min)</label>
            <input
              type="number"
              step="0.01"
              value={filters.basarili_oran_min}
              onChange={(e) => setFilters({ ...filters, basarili_oran_min: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Başarılı Oran (Max)</label>
            <input
              type="number"
              step="0.01"
              value={filters.basarili_oran_max}
              onChange={(e) => setFilters({ ...filters, basarili_oran_max: e.target.value })}
              className="input"
            />
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
                  <th>TC Kimlik No</th>
                  <th>Adı</th>
                  <th>Soyadı</th>
                  <th>Cep Telefonu</th>
                  <th>Başarılı Sınav</th>
                  <th>Başarısız Sınav</th>
                  <th>Toplam Giriş</th>
                  <th>Başarılı Oran</th>
                  <th>Başarısız Oran</th>
                </tr>
              </thead>
              <tbody>
                {kursiyerler.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center py-8 text-dark-500">
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
                      <td>{kursiyer.tc_kimlik || '-'}</td>
                      <td className="font-medium">{kursiyer.adi}</td>
                      <td className="font-medium">{kursiyer.soyadi}</td>
                      <td>{kursiyer.telefon || '-'}</td>
                      <td className="text-success-600 font-bold">0</td>
                      <td className="text-danger-600 font-bold">0</td>
                      <td className="font-bold">0</td>
                      <td className="text-success-600 font-bold">0%</td>
                      <td className="text-danger-600 font-bold">0%</td>
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

