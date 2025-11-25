import { useState } from 'react';

export default function KursiyerDonemIstatistik() {
  const [filters, setFilters] = useState({
    donem_baslama_yil: '2024',
    donem_baslama_ay: 'Eylül',
    istedilen_sertifika: '',
    donem_bitis_yil: '2025',
    donem_bitis_ay: 'Eylül',
  });
  const [istatistikler, setIstatistikler] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const yillar = Array.from({ length: 17 }, (_, i) => 2010 + i);
  const aylar = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const sertifikalar = [
    'Tümü', 'Muaf', 'M', 'M-Otomatik', 'A1', 'A1-Otomatik', 'A1-Yeni Nesil',
    'A1-Yeni Nesil(Otomatik)', 'A2', 'A2-Otomatik', 'A', 'A-Otomatik',
    'B1', 'B1-Otomatik', 'B', 'B-Otomatik', 'B-Engelli', 'BE', 'BE-Otomatik',
    'C1', 'C1-Otomatik', 'C1E', 'C1E-Otomatik', 'C', 'C-Otomatik', 'CE',
    'CE-Otomatik', 'D1', 'D1-Otomatik', 'D1E', 'D1E-Otomatik', 'D', 'D-Otomatik',
    'DE', 'DE-Otomatik', 'E', 'E-Otomatik', 'F', 'F-Otomatik', 'G', 'G-Otomatik', '100/CP'
  ];

  const handleFiltrele = async () => {
    setLoading(true);
    try {
      // TODO: API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setIstatistikler([]);
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
          Dönem (MEİS) İstatistiği Listesi
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
            <label className="block text-sm font-medium text-dark-700 mb-1">Dönem Başlama Yıl</label>
            <select
              value={filters.donem_baslama_yil}
              onChange={(e) => setFilters({ ...filters, donem_baslama_yil: e.target.value })}
              className="input"
            >
              {yillar.map((yil) => (
                <option key={yil} value={yil.toString()}>
                  {yil}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Dönem Başlama Ay</label>
            <select
              value={filters.donem_baslama_ay}
              onChange={(e) => setFilters({ ...filters, donem_baslama_ay: e.target.value })}
              className="input"
            >
              {aylar.map((ay) => (
                <option key={ay} value={ay}>
                  {ay}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">İstenilen Sertifika</label>
            <select
              value={filters.istedilen_sertifika}
              onChange={(e) => setFilters({ ...filters, istedilen_sertifika: e.target.value })}
              className="input"
            >
              {sertifikalar.map((sertifika) => (
                <option key={sertifika} value={sertifika}>
                  {sertifika}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Dönem Bitiş Yıl</label>
            <select
              value={filters.donem_bitis_yil}
              onChange={(e) => setFilters({ ...filters, donem_bitis_yil: e.target.value })}
              className="input"
            >
              {yillar.map((yil) => (
                <option key={yil} value={yil.toString()}>
                  {yil}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Dönem Bitiş Ay</label>
            <select
              value={filters.donem_bitis_ay}
              onChange={(e) => setFilters({ ...filters, donem_bitis_ay: e.target.value })}
              className="input"
            >
              {aylar.map((ay) => (
                <option key={ay} value={ay}>
                  {ay}
                </option>
              ))}
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
                  <th>Dönem Bilgileri</th>
                  <th>İstatistik Verileri</th>
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
                      <td className="font-medium">{istatistik.donem}</td>
                      <td>{istatistik.veri}</td>
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

