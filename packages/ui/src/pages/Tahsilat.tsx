import { useState, useEffect, useMemo } from 'react';
import type { Muhasebe } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

interface TahsilatItem extends Muhasebe {
  kursiyer_adi?: string;
  kursiyer_soyadi?: string;
  kursiyer_tc?: string;
  kursiyer_telefon?: string;
  odeme_tipi?: string;
}

export default function Tahsilat() {
  const [tahsilatlar, setTahsilatlar] = useState<TahsilatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKursiyer, setSelectedKursiyer] = useState<number | null>(null);
  const [kursiyerler, setKursiyerler] = useState<any[]>([]);
  const [showTahsilatForm, setShowTahsilatForm] = useState(false);
  const [yeniTahsilat, setYeniTahsilat] = useState({
    id_kursiyer: '',
    tutar: '',
    odeme_tarihi: new Date().toISOString().split('T')[0],
    odeme_tipi: 'nakit',
    aciklama: '',
  });
  const [filterText, setFilterText] = useState('');
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
    loadKursiyerler();
  }, [selectedKursiyer]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = selectedKursiyer ? `?id_kursiyer=${selectedKursiyer}` : '';
      const response = await fetch(`${API_URL}/finans/muhasebe${params}`);
      if (response.ok) {
        const data = await response.json();
        // Kursiyer bilgilerini birleştir
        const tahsilatData = Array.isArray(data) ? data : [];
        const extended = await Promise.all(
          tahsilatData.map(async (item: any) => {
            if (item.id_kursiyer) {
              const kursiyer = kursiyerler.find((k) => k.id === item.id_kursiyer);
              return {
                ...item,
                kursiyer_adi: kursiyer?.adi,
                kursiyer_soyadi: kursiyer?.soyadi,
                kursiyer_tc: kursiyer?.tc_kimlik,
                kursiyer_telefon: kursiyer?.telefon,
              };
            }
            return item;
          })
        );
        setTahsilatlar(extended);
      } else {
        setTahsilatlar([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setTahsilatlar([]);
    } finally {
      setLoading(false);
    }
  };

  const loadKursiyerler = async () => {
    try {
      const response = await fetch(`${API_URL}/kursiyer`);
      if (response.ok) {
        const data = await response.json();
        setKursiyerler(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading kursiyerler:', error);
    }
  };

  const handleTahsilatEkle = async () => {
    if (!yeniTahsilat.id_kursiyer || !yeniTahsilat.tutar) {
      alert('Lütfen kursiyer ve tutar bilgilerini giriniz.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/finans/muhasebe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_kursiyer: parseInt(yeniTahsilat.id_kursiyer),
          tutar: yeniTahsilat.tutar,
          odeme_tarihi: yeniTahsilat.odeme_tarihi,
          odeme_tipi: yeniTahsilat.odeme_tipi,
          kayit_durumu: 1, // Ödendi
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'İşlem başarısız' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      alert('Tahsilat başarıyla kaydedildi!');
      setShowTahsilatForm(false);
      setYeniTahsilat({
        id_kursiyer: '',
        tutar: '',
        odeme_tarihi: new Date().toISOString().split('T')[0],
        odeme_tipi: 'nakit',
        aciklama: '',
      });
      loadData();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    }
  };

  const handleMakbuzYazdir = () => {
    // Makbuz yazdırma işlemi
    window.print();
  };

  const filteredData = useMemo(() => {
    if (!filterText) return tahsilatlar;
    const search = filterText.toLowerCase();
    return tahsilatlar.filter(
      (item) =>
        item.kursiyer_adi?.toLowerCase().includes(search) ||
        item.kursiyer_soyadi?.toLowerCase().includes(search) ||
        item.kursiyer_tc?.includes(search)
    );
  }, [tahsilatlar, filterText]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const toplamTahsilat = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + (parseFloat(item.tutar || '0') || 0), 0);
  }, [filteredData]);

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tahsilat İşlemleri</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTahsilatForm(!showTahsilatForm)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            {showTahsilatForm ? 'İptal' : '+ Yeni Tahsilat'}
          </button>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Yenile
          </button>
        </div>
      </div>

      {showTahsilatForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Yeni Tahsilat Ekle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kursiyer</label>
              <select
                value={yeniTahsilat.id_kursiyer}
                onChange={(e) => setYeniTahsilat({ ...yeniTahsilat, id_kursiyer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Kursiyer Seçiniz</option>
                {kursiyerler.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.adi} {k.soyadi} - {k.tc_kimlik}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tutar (₺)</label>
              <input
                type="number"
                step="0.01"
                value={yeniTahsilat.tutar}
                onChange={(e) => setYeniTahsilat({ ...yeniTahsilat, tutar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="0.00"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Tarihi</label>
              <input
                type="date"
                value={yeniTahsilat.odeme_tarihi}
                onChange={(e) => setYeniTahsilat({ ...yeniTahsilat, odeme_tarihi: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Tipi</label>
              <select
                value={yeniTahsilat.odeme_tipi}
                onChange={(e) => setYeniTahsilat({ ...yeniTahsilat, odeme_tipi: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="nakit">Nakit</option>
                <option value="banka">Banka</option>
                <option value="pos">POS</option>
                <option value="havale">Havale</option>
                <option value="cek">Çek</option>
                <option value="senet">Senet</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea
                value={yeniTahsilat.aciklama}
                onChange={(e) => setYeniTahsilat({ ...yeniTahsilat, aciklama: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                rows={3}
                placeholder="Açıklama (opsiyonel)"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleTahsilatEkle}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Tahsilat Ekle
            </button>
            <button
              onClick={() => setShowTahsilatForm(false)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-4 items-center">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Kursiyer adı, soyadı veya TC ile ara..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <select
          value={selectedKursiyer || ''}
          onChange={(e) => setSelectedKursiyer(e.target.value ? parseInt(e.target.value) : null)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option value="">Tüm Kursiyerler</option>
          {kursiyerler.map((k) => (
            <option key={k.id} value={k.id}>
              {k.adi} {k.soyadi}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 p-4 bg-green-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Toplam Tahsilat:</span>
          <span className="text-xl font-bold text-green-800">{toplamTahsilat.toFixed(2)} ₺</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursiyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TC Kimlik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ödeme Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ödeme Tipi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Kayıt bulunamadı
                  </td>
                </tr>
              ) : (
                paginatedData.map((tahsilat, index) => (
                  <tr key={tahsilat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tahsilat.kursiyer_adi} {tahsilat.kursiyer_soyadi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tahsilat.kursiyer_tc || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {parseFloat(tahsilat.tutar || '0').toFixed(2)} ₺
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tahsilat.odeme_tarihi ? new Date(tahsilat.odeme_tarihi).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {tahsilat.odeme_tipi || 'nakit'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={handleMakbuzYazdir}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Makbuz Yazdır
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Toplam {filteredData.length} kayıt</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value={10}>10</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            <span className="text-sm text-gray-700">
              Sayfa {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

