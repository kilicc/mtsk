import { useEffect, useState } from 'react';
import type { Kasa } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

interface KasaListesiProps {
  onNewClick?: () => void;
  onDetailClick?: (id: number) => void;
}

export default function KasaListesi({ onNewClick, onDetailClick }: KasaListesiProps) {
  const [kasas, setKasas] = useState<Kasa[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadKasas();
  }, []);

  const loadKasas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/kasa`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setKasas(data || []);
    } catch (error) {
      console.error('Error loading kasas:', error);
      // Fallback: Empty array
      setKasas([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 }).format(value || 0);

  const totalPages = Math.ceil(kasas.length / pageSize);
  const paginatedKasas = kasas.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageStart = (currentPage - 1) * pageSize;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedKasas.map(k => k.id);
      setSelectedIds(new Set([...selectedIds, ...pageIds]));
    } else {
      const pageIds = paginatedKasas.map(k => k.id);
      const newSelected = new Set(selectedIds);
      pageIds.forEach(id => newSelected.delete(id));
      setSelectedIds(newSelected);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kasayı silmek istediğinize emin misiniz?')) return;
    try {
      await fetch(`${API_URL}/kasa/${id}`, { method: 'DELETE' });
      await loadKasas();
    } catch (error) {
      console.error('Error deleting kasa:', error);
      alert('Kasa silinirken bir hata oluştu.');
    }
  };

  return (
    <div className="p-4 space-y-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="card">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Kasa Listesi
        </h1>
        <p className="text-sm text-gray-500">Kaydı açmak için çift tıklayınız.</p>
      </div>

      {/* Toolbar */}
      <div className="card flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNewClick?.()}
            className="btn btn-primary text-sm"
          >
            Yeni Kasa Ekle
          </button>
          {selectedIds.size > 0 && (
            <button
              onClick={() => alert(`${selectedIds.size} kasa için toplu işlem. (Yakında)`)}
              className="btn btn-outline text-sm"
            >
              Toplu İşlem ({selectedIds.size})
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
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
            Sayfa {currentPage} / {totalPages || 1}
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
                Toplam: <span className="font-bold text-gray-900">{kasas.length}</span> kasa
                {selectedIds.size > 0 && (
                  <span className="ml-2 text-gray-500">({selectedIds.size} seçili)</span>
                )}
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
            <div className="flex items-center gap-2 flex-wrap">
              <button className="btn btn-outline text-sm" onClick={() => alert('Görünüm şablonları yakında.')}>
                Görünüm Şablonları
              </button>
              <button className="btn btn-outline text-sm" onClick={() => alert('Sütun görünürlüğü yakında.')}>
                Sütunları Aç/Kapat
              </button>
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
                  <th>
                    <input
                      type="checkbox"
                      checked={paginatedKasas.length > 0 && paginatedKasas.every(k => selectedIds.has(k.id))}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4"
                      aria-label="Tümünü seç"
                    />
                  </th>
                  <th>No</th>
                  <th>İşlem</th>
                  <th>Kasa Adı</th>
                  <th>Kasa Kodu</th>
                  <th>Bakiye</th>
                  <th>Durum</th>
                  <th>Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {paginatedKasas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      Kayıt bulunamadı
                    </td>
                  </tr>
                ) : (
                  paginatedKasas.map((kasa, index) => (
                    <tr
                      key={kasa.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onDoubleClick={() => onDetailClick?.(kasa.id)}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(kasa.id)}
                          onChange={(e) => handleSelectOne(kasa.id, e.target.checked)}
                          className="w-4 h-4"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td>{pageStart + index + 1}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDetailClick?.(kasa.id);
                            }}
                            className="text-gray-600 hover:text-gray-900 text-sm"
                          >
                            Detay
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(kasa.id);
                            }}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                      <td className="font-medium">{kasa.kasa_adi}</td>
                      <td>{kasa.kasa_kodu || '-'}</td>
                      <td className={`font-bold ${
                        (kasa.bakiye || 0) > 0 ? 'text-green-600' :
                        (kasa.bakiye || 0) < 0 ? 'text-red-600' : ''
                      }`}>
                        {formatCurrency(kasa.bakiye || 0)}
                      </td>
                      <td>
                        <span className={`badge ${
                          kasa.akt === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {kasa.akt === 1 ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td>{kasa.aciklama || '-'}</td>
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

