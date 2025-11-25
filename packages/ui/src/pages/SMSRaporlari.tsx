import { useState, useEffect, useMemo } from 'react';
import type { SMSGonderim } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

interface ExtendedSMSGonderim extends SMSGonderim {
  kursiyer_adi?: string;
  kursiyer_soyadi?: string;
}

export default function SMSRaporlari() {
  const [raporlar, setRaporlar] = useState<ExtendedSMSGonderim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [durumFilter, setDurumFilter] = useState<string>('');
  const [tarihBaslangic, setTarihBaslangic] = useState('');
  const [tarihBitis, setTarihBitis] = useState('');
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/sms/raporlar`);
      if (response.ok) {
        const data = await response.json();
        const raporlarData = Array.isArray(data) ? data : [];
        
        // Kursiyer bilgilerini birleştir
        const kursiyerResponse = await fetch(`${API_URL}/kursiyer`).then(r => r.ok ? r.json() : []);
        const kursiyerler = Array.isArray(kursiyerResponse) ? kursiyerResponse : [];
        
        const extended = raporlarData.map((rapor: any) => {
          const kursiyer = kursiyerler.find((k: any) => k.id === rapor.id_kursiyer);
          return {
            ...rapor,
            kursiyer_adi: kursiyer?.adi,
            kursiyer_soyadi: kursiyer?.soyadi,
          };
        });
        
        setRaporlar(extended);
      } else {
        setRaporlar([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setRaporlar([]);
    } finally {
      setLoading(false);
    }
  };

  const getDurumLabel = (durum?: number) => {
    const durumMap: Record<number, string> = {
      0: 'Bekliyor',
      1: 'Gönderildi',
      2: 'Hata',
    };
    return durumMap[durum || 0] || 'Bilinmiyor';
  };

  const getDurumColor = (durum?: number) => {
    if (durum === 1) return 'bg-green-100 text-green-800';
    if (durum === 2) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const filteredData = useMemo(() => {
    let result = [...raporlar];

    if (filterText) {
      const search = filterText.toLowerCase();
      result = result.filter(
        (rapor) =>
          rapor.telefon?.toLowerCase().includes(search) ||
          rapor.mesaj?.toLowerCase().includes(search) ||
          rapor.kursiyer_adi?.toLowerCase().includes(search) ||
          rapor.kursiyer_soyadi?.toLowerCase().includes(search)
      );
    }

    if (durumFilter) {
      result = result.filter((rapor) => rapor.durum === parseInt(durumFilter));
    }

    if (tarihBaslangic) {
      result = result.filter((rapor) => {
        if (!rapor.gonderim_tarihi) return false;
        return new Date(rapor.gonderim_tarihi) >= new Date(tarihBaslangic);
      });
    }

    if (tarihBitis) {
      result = result.filter((rapor) => {
        if (!rapor.gonderim_tarihi) return false;
        return new Date(rapor.gonderim_tarihi) <= new Date(tarihBitis);
      });
    }

    return result;
  }, [raporlar, filterText, durumFilter, tarihBaslangic, tarihBitis]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const toplamGonderim = filteredData.length;
  const basariliGonderim = filteredData.filter((r) => r.durum === 1).length;
  const basarisizGonderim = filteredData.filter((r) => r.durum === 2).length;

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">SMS Raporları</h1>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Yenile
          </button>
          <button
            onClick={() => alert('Excel export yakında eklenecek')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Excel'e Aktar
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-700">Başarılı Gönderim</div>
          <div className="text-2xl font-bold text-green-800">{basariliGonderim}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-700">Başarısız Gönderim</div>
          <div className="text-2xl font-bold text-red-800">{basarisizGonderim}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-700">Toplam Gönderim</div>
          <div className="text-2xl font-bold text-blue-800">{toplamGonderim}</div>
        </div>
      </div>

      <div className="mb-4 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ara</label>
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Telefon, mesaj veya kursiyer..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
            <select
              value={durumFilter}
              onChange={(e) => setDurumFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Tümü</option>
              <option value="0">Bekliyor</option>
              <option value="1">Gönderildi</option>
              <option value="2">Hata</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
            <input
              type="date"
              value={tarihBaslangic}
              onChange={(e) => setTarihBaslangic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
            <input
              type="date"
              value={tarihBitis}
              onChange={(e) => setTarihBitis(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursiyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mesaj</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gönderim Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hata Mesajı</th>
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
                    Rapor bulunamadı
                  </td>
                </tr>
              ) : (
                paginatedData.map((rapor, index) => (
                  <tr key={rapor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rapor.kursiyer_adi && rapor.kursiyer_soyadi
                        ? `${rapor.kursiyer_adi} ${rapor.kursiyer_soyadi}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rapor.telefon}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{rapor.mesaj}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getDurumColor(rapor.durum)}`}>
                        {getDurumLabel(rapor.durum)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rapor.gonderim_tarihi
                        ? new Date(rapor.gonderim_tarihi).toLocaleDateString('tr-TR')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600 max-w-md truncate">
                      {rapor.hata_mesaji || '-'}
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

