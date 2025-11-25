import { useState, useEffect, useMemo } from 'react';
import type { SMSTemplate } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function SMSSablonlari() {
  const [sablonlar, setSablonlar] = useState<SMSTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showYeniSablon, setShowYeniSablon] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [yeniSablon, setYeniSablon] = useState({
    baslik: '',
    icerik: '',
    aktif: true,
  });
  const [filterText, setFilterText] = useState('');
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/sms/sablonlar`);
      if (response.ok) {
        const data = await response.json();
        setSablonlar(Array.isArray(data) ? data : []);
      } else {
        setSablonlar([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setSablonlar([]);
    } finally {
      setLoading(false);
    }
  };

  const handleYeniSablonOlustur = async () => {
    if (!yeniSablon.baslik || !yeniSablon.icerik) {
      alert('Lütfen başlık ve içerik alanlarını doldurunuz.');
      return;
    }

    try {
      const url = editingId 
        ? `${API_URL}/sms/sablonlar/${editingId}`
        : `${API_URL}/sms/sablonlar`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(yeniSablon),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'İşlem başarısız' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      alert(editingId ? 'Şablon başarıyla güncellendi!' : 'Şablon başarıyla oluşturuldu!');
      setShowYeniSablon(false);
      setEditingId(null);
      setYeniSablon({ baslik: '', icerik: '', aktif: true });
      loadData();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    }
  };

  const handleEdit = (sablon: SMSTemplate) => {
    setYeniSablon({
      baslik: sablon.baslik,
      icerik: sablon.icerik,
      aktif: sablon.aktif ?? true,
    });
    setEditingId(sablon.id);
    setShowYeniSablon(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu şablonu silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/sms/sablonlar/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız');
      }

      alert('Şablon başarıyla silindi!');
      loadData();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    }
  };

  const handleKullan = (sablon: SMSTemplate) => {
    // Şablonu SMS sayfasına yönlendir (localStorage veya state ile)
    window.location.hash = `sms?template=${sablon.id}`;
  };

  const filteredData = useMemo(() => {
    if (!filterText) return sablonlar;
    const search = filterText.toLowerCase();
    return sablonlar.filter(
      (sablon) =>
        sablon.baslik?.toLowerCase().includes(search) ||
        sablon.icerik?.toLowerCase().includes(search)
    );
  }, [sablonlar, filterText]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">SMS Şablonları</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowYeniSablon(!showYeniSablon);
              if (showYeniSablon) {
                setEditingId(null);
                setYeniSablon({ baslik: '', icerik: '', aktif: true });
              }
            }}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            {showYeniSablon ? 'İptal' : '+ Yeni Şablon'}
          </button>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Yenile
          </button>
        </div>
      </div>

      {showYeniSablon && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Şablon Düzenle' : 'Yeni SMS Şablonu Oluştur'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
              <input
                type="text"
                value={yeniSablon.baslik}
                onChange={(e) => setYeniSablon({ ...yeniSablon, baslik: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Şablon başlığı"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik ({yeniSablon.icerik.length}/160)
              </label>
              <textarea
                value={yeniSablon.icerik}
                onChange={(e) => setYeniSablon({ ...yeniSablon, icerik: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                rows={5}
                maxLength={160}
                placeholder="SMS mesaj içeriği..."
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={yeniSablon.aktif}
                  onChange={(e) => setYeniSablon({ ...yeniSablon, aktif: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Aktif</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleYeniSablonOlustur}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                {editingId ? 'Güncelle' : 'Oluştur'}
              </button>
              <button
                onClick={() => {
                  setShowYeniSablon(false);
                  setEditingId(null);
                  setYeniSablon({ baslik: '', icerik: '', aktif: true });
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Başlık veya içerik ile ara..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İçerik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Şablon bulunamadı
                  </td>
                </tr>
              ) : (
                paginatedData.map((sablon, index) => (
                  <tr key={sablon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sablon.baslik}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {sablon.icerik}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          sablon.aktif
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {sablon.aktif ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleKullan(sablon)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Kullan
                        </button>
                        <button
                          onClick={() => handleEdit(sablon)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(sablon.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Sil
                        </button>
                      </div>
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

