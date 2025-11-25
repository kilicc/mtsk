import { useState, useEffect, useMemo } from 'react';
import type { BorcRaporu } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function BorcSMS() {
  const [borclular, setBorclular] = useState<BorcRaporu[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filterText, setFilterText] = useState('');
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [smsSonuc, setSmsSonuc] = useState<{ success: number; failed: number } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/finans/borc`);
      if (response.ok) {
        const data = await response.json();
        // Sadece vadesi geçen borçları getir
        const gecenler = Array.isArray(data)
          ? data.filter((borc: BorcRaporu) => (borc.gecikme_gunu || 0) > 0)
          : [];
        setBorclular(gecenler);
      } else {
        setBorclular([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setBorclular([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedData.map((item) => item.id_kursiyer));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleSMSGonder = async (toplu: boolean = false) => {
    if (!toplu && selectedIds.length === 0) {
      alert('Lütfen en az bir kursiyer seçiniz.');
      return;
    }

    if (!confirm(`${toplu ? 'Seçili' : 'Tüm'} borçlu kursiyerlere SMS gönderilecek. Devam edilsin mi?`)) {
      return;
    }

    try {
      setSending(true);
      setSmsSonuc(null);

      const response = await fetch(`${API_URL}/sms/debt-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kursiyer_ids: toplu ? selectedIds : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'İşlem başarısız' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSmsSonuc({ success: result.success || 0, failed: result.failed || 0 });
      alert(`SMS gönderimi tamamlandı!\nBaşarılı: ${result.success || 0}\nBaşarısız: ${result.failed || 0}`);
      setSelectedIds([]);
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!filterText) return borclular;
    const search = filterText.toLowerCase();
    return borclular.filter(
      (borc) =>
        borc.kursiyer_adi?.toLowerCase().includes(search) ||
        borc.kursiyer_soyadi?.toLowerCase().includes(search)
    );
  }, [borclular, filterText]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const toplamBorc = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.toplam_borc, 0);
  }, [filteredData]);

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Borç SMS Gönderimi</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleSMSGonder(true)}
            disabled={selectedIds.length === 0 || sending}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {sending ? 'Gönderiliyor...' : 'Seçililere SMS Gönder'}
          </button>
          <button
            onClick={() => handleSMSGonder(false)}
            disabled={borclular.length === 0 || sending}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {sending ? 'Gönderiliyor...' : 'Tümüne SMS Gönder'}
          </button>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Yenile
          </button>
        </div>
      </div>

      {smsSonuc && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">SMS Gönderim Sonucu:</span>
            <div className="flex gap-4">
              <span className="text-sm text-green-600">Başarılı: {smsSonuc.success}</span>
              <span className="text-sm text-red-600">Başarısız: {smsSonuc.failed}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 p-4 bg-red-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Toplam Borç:</span>
          <span className="text-xl font-bold text-red-800">{toplamBorc.toFixed(2)} ₺</span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Vadesi geçen {filteredData.length} kursiyer bulundu
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Kursiyer adı veya soyadı ile ara..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursiyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Borç</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vade Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gecikme (Gün)</th>
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
                    Vadesi geçen borç kaydı bulunamadı
                  </td>
                </tr>
              ) : (
                paginatedData.map((borc, index) => (
                  <tr key={borc.id_kursiyer} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(borc.id_kursiyer)}
                        onChange={(e) => handleSelectItem(borc.id_kursiyer, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {borc.kursiyer_adi} {borc.kursiyer_soyadi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                      {borc.toplam_borc.toFixed(2)} ₺
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {borc.vade_tarihi ? new Date(borc.vade_tarihi).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          (borc.gecikme_gunu || 0) > 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {borc.gecikme_gunu || 0} gün
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedIds([borc.id_kursiyer]);
                          handleSMSGonder(true);
                        }}
                        disabled={sending}
                        className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                      >
                        SMS Gönder
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

