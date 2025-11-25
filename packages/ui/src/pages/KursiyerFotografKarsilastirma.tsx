import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function KursiyerFotografKarsilastirma() {
  const [kursiyerler, setKursiyerler] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          Fotoğraf Karşılaştırma Listesi
        </h1>
        <p className="text-dark-600">Kaydı açmak için çift tıklayınız.</p>
      </div>

      {/* Filtreleme - Kursiyer Listesi ile aynı */}
      <div className="card">
        <p className="text-dark-600 text-center py-4">
          Filtreleme sistemi Kursiyer Listesi ile aynıdır (4 Tab: F-1, F-2, F-3, S-1)
        </p>
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
                  <th>#</th>
                  <th>No</th>
                  <th>Aday No</th>
                  <th>TC Kimlik No</th>
                  <th>Adı</th>
                  <th>Soyadı</th>
                  <th>Adı Soyadı</th>
                  <th>Biyometrik Fotoğraf</th>
                  <th>Webcam Fotoğrafı</th>
                </tr>
              </thead>
              <tbody>
                {kursiyerler.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-dark-500">
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
                      <td>{kursiyer.id}</td>
                      <td>-</td>
                      <td>{kursiyer.tc_kimlik || '-'}</td>
                      <td className="font-medium">{kursiyer.adi}</td>
                      <td className="font-medium">{kursiyer.soyadi}</td>
                      <td className="font-medium">{kursiyer.adi} {kursiyer.soyadi}</td>
                      <td>
                        <div className="w-16 h-16 bg-dark-100 rounded flex items-center justify-center">
                          <span className="text-2xl">📷</span>
                        </div>
                      </td>
                      <td>
                        <div className="w-16 h-16 bg-dark-100 rounded flex items-center justify-center">
                          <span className="text-2xl">📷</span>
                        </div>
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

