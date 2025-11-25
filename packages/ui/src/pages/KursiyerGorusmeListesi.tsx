import { useState, useEffect } from 'react';

export default function KursiyerGorusmeListesi() {
  const [gorusmeler, setGorusmeler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    firma_adi: '',
    adi: '',
    soyadi: '',
    konu: '',
    etiket: '',
    islem_tarihi_baslangic: '',
    islem_tarihi_bitis: '',
    kontrol_tarihi_baslangic: '',
    kontrol_tarihi_bitis: '',
    kaydeden: '',
    degistiren: '',
    kayit_sayisi: '30',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setGorusmeler([]);
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
          Görüşme Listesi
        </h1>
        <p className="text-dark-600">Kaydı açmak için çift tıklayınız.</p>
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
            <label className="block text-sm font-medium text-dark-700 mb-1">Firma Adı</label>
            <input
              type="text"
              value={filters.firma_adi}
              onChange={(e) => setFilters({ ...filters, firma_adi: e.target.value })}
              className="input"
            />
          </div>
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
            <label className="block text-sm font-medium text-dark-700 mb-1">Konu</label>
            <input
              type="text"
              value={filters.konu}
              onChange={(e) => setFilters({ ...filters, konu: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Etiket</label>
            <select
              value={filters.etiket}
              onChange={(e) => setFilters({ ...filters, etiket: e.target.value })}
              className="input"
            >
              <option value="">Tümü</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">İşlem Tarihi (Başlangıç)</label>
            <input
              type="date"
              value={filters.islem_tarihi_baslangic}
              onChange={(e) => setFilters({ ...filters, islem_tarihi_baslangic: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">İşlem Tarihi (Bitiş)</label>
            <input
              type="date"
              value={filters.islem_tarihi_bitis}
              onChange={(e) => setFilters({ ...filters, islem_tarihi_bitis: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Kontrol Tarihi (Başlangıç)</label>
            <input
              type="date"
              value={filters.kontrol_tarihi_baslangic}
              onChange={(e) => setFilters({ ...filters, kontrol_tarihi_baslangic: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Kontrol Tarihi (Bitiş)</label>
            <input
              type="date"
              value={filters.kontrol_tarihi_bitis}
              onChange={(e) => setFilters({ ...filters, kontrol_tarihi_bitis: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Kayıt Sayısı</label>
            <select
              value={filters.kayit_sayisi}
              onChange={(e) => setFilters({ ...filters, kayit_sayisi: e.target.value })}
              className="input"
            >
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="150">150</option>
              <option value="300">300</option>
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
                  <th>Adı Soyadı</th>
                  <th>İşlem Tarihi</th>
                  <th>Kontrol Tarihi</th>
                  <th>Etiket</th>
                  <th>Konu</th>
                  <th>Görüşme Detayı</th>
                  <th>Kaydeden</th>
                  <th>Kayıt Tarihi</th>
                  <th>Değiştiren</th>
                  <th>Değiştirme Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {gorusmeler.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-8 text-dark-500">
                      Görüşme kaydı bulunamadı
                    </td>
                  </tr>
                ) : (
                  gorusmeler.map((gorusme, index) => (
                    <tr
                      key={gorusme.id}
                      className="cursor-pointer hover:bg-primary-50"
                      onDoubleClick={() => console.log('Detay:', gorusme.id)}
                    >
                      <td>{index + 1}</td>
                      <td className="font-medium">{gorusme.adi_soyadi}</td>
                      <td>{gorusme.islem_tarihi || '-'}</td>
                      <td>{gorusme.kontrol_tarihi || '-'}</td>
                      <td>{gorusme.etiket || '-'}</td>
                      <td>{gorusme.konu || '-'}</td>
                      <td>{gorusme.detay || '-'}</td>
                      <td>{gorusme.kaydeden || '-'}</td>
                      <td>{gorusme.kayit_tarihi || '-'}</td>
                      <td>{gorusme.degistiren || '-'}</td>
                      <td>{gorusme.degistirme_tarihi || '-'}</td>
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

