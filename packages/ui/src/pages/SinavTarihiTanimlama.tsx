import { useState, useEffect, useMemo } from 'react';

const API_URL = 'http://localhost:3001/api';

interface SinavTarihi {
  id: number;
  kurs_tipi?: string;
  sinav_tipi?: string;
  sinav_tarihi?: Date | string;
  akt?: number;
}

export default function SinavTarihiTanimlama() {
  const [sinavTarihleri, setSinavTarihleri] = useState<SinavTarihi[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<SinavTarihi>>({
    kurs_tipi: 'MTSK',
    sinav_tipi: 'Uygulama',
    sinav_tarihi: new Date().toISOString().split('T')[0],
    akt: 1,
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
      const response = await fetch(`${API_URL}/tanimlar/sinav-tarihi`);
      if (response.ok) {
        const data = await response.json();
        setSinavTarihleri(Array.isArray(data) ? data : []);
      } else {
        setSinavTarihleri([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setSinavTarihleri([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sinav_tarihi) {
      alert('Lütfen sınav tarihini seçiniz.');
      return;
    }

    try {
      setLoading(true);
      const url = editingId 
        ? `${API_URL}/tanimlar/sinav-tarihi/${editingId}`
        : `${API_URL}/tanimlar/sinav-tarihi`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'İşlem başarısız' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      alert(editingId ? 'Sınav tarihi başarıyla güncellendi!' : 'Sınav tarihi başarıyla oluşturuldu!');
      setShowForm(false);
      setEditingId(null);
      setFormData({
        kurs_tipi: 'MTSK',
        sinav_tipi: 'Uygulama',
        sinav_tarihi: new Date().toISOString().split('T')[0],
        akt: 1,
      });
      loadData();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: SinavTarihi) => {
    setFormData({
      ...item,
      sinav_tarihi: item.sinav_tarihi ? (typeof item.sinav_tarihi === 'string' ? item.sinav_tarihi.split('T')[0] : new Date(item.sinav_tarihi).toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tanimlar/sinav-tarihi/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Silme işlemi başarısız');
      }

      alert('Kayıt başarıyla silindi!');
      loadData();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    }
  };

  const filteredData = useMemo(() => {
    if (!filterText) return sinavTarihleri;
    const search = filterText.toLowerCase();
    return sinavTarihleri.filter(
      (item) =>
        item.kurs_tipi?.toLowerCase().includes(search) ||
        item.sinav_tipi?.toLowerCase().includes(search) ||
        (item.sinav_tarihi && new Date(item.sinav_tarihi).toLocaleDateString('tr-TR').toLowerCase().includes(search))
    );
  }, [sinavTarihleri, filterText]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sınav Tarihi Tanımlama</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingId(null);
                setFormData({
                  kurs_tipi: 'MTSK',
                  sinav_tipi: 'Uygulama',
                  sinav_tarihi: new Date().toISOString().split('T')[0],
                  akt: 1,
                });
              }
            }}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            {showForm ? 'İptal' : '+ Yeni Sınav Tarihi'}
          </button>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Yenile
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Sınav Tarihi Düzenle' : 'Yeni Sınav Tarihi Oluştur'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kurs Tipi</label>
                <input
                  type="text"
                  value={formData.kurs_tipi || 'MTSK'}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sınav Tipi</label>
                <select
                  value={formData.sinav_tipi || 'Uygulama'}
                  onChange={(e) => setFormData({ ...formData, sinav_tipi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="Teorik">Teorik</option>
                  <option value="Uygulama">Uygulama</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sınav Tarihi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.sinav_tarihi ? (typeof formData.sinav_tarihi === 'string' ? formData.sinav_tarihi.split('T')[0] : new Date(formData.sinav_tarihi).toISOString().split('T')[0]) : ''}
                  onChange={(e) => setFormData({ ...formData, sinav_tarihi: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <select
                  value={formData.akt ?? 1}
                  onChange={(e) => setFormData({ ...formData, akt: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Pasif</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {loading ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Kaydet'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    kurs_tipi: 'MTSK',
                    sinav_tipi: 'Uygulama',
                    sinav_tarihi: new Date().toISOString().split('T')[0],
                    akt: 1,
                  });
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Vazgeç
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Kurs tipi, sınav tipi veya tarih ile ara..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kurs Tipi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sınav Tipi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sınav Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Kayıt bulunamadı
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.kurs_tipi || 'MTSK'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.sinav_tipi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sinav_tarihi
                        ? new Date(item.sinav_tarihi).toLocaleDateString('tr-TR')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.akt === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.akt === 1 ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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

