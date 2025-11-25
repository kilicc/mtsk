import { useEffect, useState } from 'react';
import type { Kasa, KasaIslemi } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function KasaHareketleri() {
  const [kasas, setKasas] = useState<Kasa[]>([]);
  const [selectedKasa, setSelectedKasa] = useState<number | ''>('');
  const [hareketler, setHareketler] = useState<KasaIslemi[]>([]);
  const [loading, setLoading] = useState(true);
  const [baslangicTarih, setBaslangicTarih] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [bitisTarih, setBitisTarih] = useState(new Date().toISOString().split('T')[0]);
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadKasas();
  }, []);

  useEffect(() => {
    if (selectedKasa) {
      loadHareketler();
    }
  }, [selectedKasa, baslangicTarih, bitisTarih]);

  const loadKasas = async () => {
    try {
      const response = await fetch(`${API_URL}/kasa`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setKasas(data || []);
      if (data && data.length > 0 && !selectedKasa) {
        setSelectedKasa(data[0].id);
      }
    } catch (error) {
      console.error('Error loading kasas:', error);
      setKasas([]);
    }
  };

  const loadHareketler = async () => {
    if (!selectedKasa) {
      setHareketler([]);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/kasa/${selectedKasa}/islemi?baslangic=${baslangicTarih}&bitis=${bitisTarih}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHareketler(data || []);
    } catch (error) {
      console.error('Error loading hareketler:', error);
      setHareketler([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 }).format(value || 0);

  const formatDate = (date: string | Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR');
  };

  const totalPages = Math.ceil(hareketler.length / pageSize);
  const paginatedHareketler = hareketler.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageStart = (currentPage - 1) * pageSize;

  const toplamGiris = hareketler.filter(h => h.islem_tipi === 'giris').reduce((sum, h) => sum + h.tutar, 0);
  const toplamCikis = hareketler.filter(h => h.islem_tipi === 'cikis').reduce((sum, h) => sum + h.tutar, 0);

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="card">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Kasa Hareketleri
        </h1>
      </div>

      {/* Filtreler */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hareket-kasa">
              Kasa
            </label>
            <select
              id="hareket-kasa"
              value={selectedKasa}
              onChange={(e) => setSelectedKasa(e.target.value ? Number(e.target.value) : '')}
              className="input"
            >
              <option value="">Tüm Kasalar</option>
              {kasas.map(kasa => (
                <option key={kasa.id} value={kasa.id}>
                  {kasa.kasa_adi}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hareket-baslangic">
              Başlangıç Tarihi
            </label>
            <input
              id="hareket-baslangic"
              type="date"
              value={baslangicTarih}
              onChange={(e) => setBaslangicTarih(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hareket-bitis">
              Bitiş Tarihi
            </label>
            <input
              id="hareket-bitis"
              type="date"
              value={bitisTarih}
              onChange={(e) => setBitisTarih(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setBaslangicTarih(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
                setBitisTarih(new Date().toISOString().split('T')[0]);
                setSelectedKasa('');
              }}
              className="btn btn-outline w-full"
            >
              Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-gray-500">Toplam Giriş</p>
          <p className="text-xl font-bold text-green-600 mt-1">
            {formatCurrency(toplamGiris)}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Toplam Çıkış</p>
          <p className="text-xl font-bold text-red-600 mt-1">
            {formatCurrency(toplamCikis)}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Net Bakiye</p>
          <p className={`text-xl font-bold mt-1 ${
            (toplamGiris - toplamCikis) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(toplamGiris - toplamCikis)}
          </p>
        </div>
      </div>

      {/* Tablo */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Toplam: <span className="font-bold text-gray-900">{hareketler.length}</span> hareket
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="input text-sm"
                aria-label="Sayfa başına kayıt sayısı"
              >
                <option value={10}>10</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={150}>150</option>
                <option value={300}>300</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-outline text-sm" onClick={() => alert('Excel\'e aktarılıyor... (Yakında)')}>
                Excel
              </button>
              <button className="btn btn-outline text-sm" onClick={() => window.print()}>
                Yazdır
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table text-sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th>İşlem Tarihi</th>
                  <th>İşlem Tipi</th>
                  <th>Tutar</th>
                  <th>Ödeme Yöntemi</th>
                  <th>Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHareketler.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      Kayıt bulunamadı
                    </td>
                  </tr>
                ) : (
                  paginatedHareketler.map((hareket, index) => (
                    <tr key={hareket.id} className="hover:bg-gray-50">
                      <td>{pageStart + index + 1}</td>
                      <td>{formatDate(hareket.islem_tarihi)}</td>
                      <td>
                        <span className={`badge ${
                          hareket.islem_tipi === 'giris' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {hareket.islem_tipi === 'giris' ? 'Giriş' : 'Çıkış'}
                        </span>
                      </td>
                      <td className={`font-semibold ${
                        hareket.islem_tipi === 'giris' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {hareket.islem_tipi === 'giris' ? '+' : '-'}
                        {formatCurrency(hareket.tutar)}
                      </td>
                      <td>{hareket.odeme_yontemi || '-'}</td>
                      <td>{hareket.aciklama || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="btn btn-outline text-sm"
              >
                ⏮️
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline text-sm"
              >
                ⏪
              </button>
              <span className="text-sm text-gray-600 px-2">
                Sayfa {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="btn btn-outline text-sm"
              >
                ⏩
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="btn btn-outline text-sm"
              >
                ⏭️
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

