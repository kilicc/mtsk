import { useState, useEffect, useMemo } from 'react';

const API_URL = 'http://localhost:3001/api';

interface DonemSube {
  id: number;
  kurs_tipi?: string;
  yil?: number;
  ay?: number;
  donem?: string;
  grup_adi?: string;
  sube_adi?: string;
  grup_baslangic_tarihi?: Date | string;
  ozel_kodu?: string;
}

export default function DonemSubeTanimlama() {
  const [donemSubeler, setDonemSubeler] = useState<DonemSube[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<DonemSube>>({
    kurs_tipi: 'MTSK',
    yil: new Date().getFullYear(),
    ay: new Date().getMonth() + 1,
    grup_adi: '',
    sube_adi: '',
    grup_baslangic_tarihi: new Date().toISOString().split('T')[0],
    ozel_kodu: '',
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
      const response = await fetch(`${API_URL}/tanimlar/donem-sube`);
      if (response.ok) {
        const data = await response.json();
        setDonemSubeler(Array.isArray(data) ? data : []);
      } else {
        setDonemSubeler([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setDonemSubeler([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.yil || !formData.ay || !formData.grup_adi || !formData.sube_adi) {
      alert('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    try {
      setLoading(true);
      const donem = `${formData.yil}-${String(formData.ay).padStart(2, '0')}`;
      const url = editingId 
        ? `${API_URL}/tanimlar/donem-sube/${editingId}`
        : `${API_URL}/tanimlar/donem-sube`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          donem,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'İşlem başarısız' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      alert(editingId ? 'Dönem Şube başarıyla güncellendi!' : 'Dönem Şube başarıyla oluşturuldu!');
      setShowForm(false);
      setEditingId(null);
      setFormData({
        kurs_tipi: 'MTSK',
        yil: new Date().getFullYear(),
        ay: new Date().getMonth() + 1,
        grup_adi: '',
        sube_adi: '',
        grup_baslangic_tarihi: new Date().toISOString().split('T')[0],
        ozel_kodu: '',
      });
      loadData();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: DonemSube) => {
    const donemParts = item.donem?.split('-') || [];
    setFormData({
      ...item,
      yil: item.yil || (donemParts[0] ? parseInt(donemParts[0]) : new Date().getFullYear()),
      ay: item.ay || (donemParts[1] ? parseInt(donemParts[1]) : new Date().getMonth() + 1),
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tanimlar/donem-sube/${id}`, {
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

  const ayIsimleri = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const filteredData = useMemo(() => {
    if (!filterText) return donemSubeler;
    const search = filterText.toLowerCase();
    return donemSubeler.filter(
      (item) =>
        item.donem?.toLowerCase().includes(search) ||
        item.grup_adi?.toLowerCase().includes(search) ||
        item.sube_adi?.toLowerCase().includes(search) ||
        item.ozel_kodu?.toLowerCase().includes(search)
    );
  }, [donemSubeler, filterText]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dönem Şube Tanımlama</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingId(null);
                setFormData({
                  kurs_tipi: 'MTSK',
                  yil: new Date().getFullYear(),
                  ay: new Date().getMonth() + 1,
                  grup_adi: '',
                  sube_adi: '',
                  grup_baslangic_tarihi: new Date().toISOString().split('T')[0],
                  ozel_kodu: '',
                });
              }
            }}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            {showForm ? 'İptal' : '+ Yeni Dönem Şube'}
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
            {editingId ? 'Dönem Şube Düzenle' : 'Yeni Dönem Şube Oluştur'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Yıl</label>
                <select
                  value={formData.yil || new Date().getFullYear()}
                  onChange={(e) => setFormData({ ...formData, yil: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {Array.from({ length: 17 }, (_, i) => 2010 + i).map((yil) => (
                    <option key={yil} value={yil}>{yil}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ay</label>
                <select
                  value={formData.ay || 1}
                  onChange={(e) => setFormData({ ...formData, ay: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {ayIsimleri.map((ay, index) => (
                    <option key={index + 1} value={index + 1}>{ay}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grup Adı</label>
                <input
                  type="text"
                  value={formData.grup_adi || ''}
                  onChange={(e) => setFormData({ ...formData, grup_adi: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Grup 1, Grup 2, vb."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şube Adı</label>
                <input
                  type="text"
                  value={formData.sube_adi || ''}
                  onChange={(e) => setFormData({ ...formData, sube_adi: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="A Şubesi, B Şubesi, vb."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grup Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={formData.grup_baslangic_tarihi ? (typeof formData.grup_baslangic_tarihi === 'string' ? formData.grup_baslangic_tarihi.split('T')[0] : new Date(formData.grup_baslangic_tarihi).toISOString().split('T')[0]) : ''}
                  onChange={(e) => setFormData({ ...formData, grup_baslangic_tarihi: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Özel Kod</label>
                <input
                  type="text"
                  value={formData.ozel_kodu || ''}
                  onChange={(e) => setFormData({ ...formData, ozel_kodu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
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
                    yil: new Date().getFullYear(),
                    ay: new Date().getMonth() + 1,
                    grup_adi: '',
                    sube_adi: '',
                    grup_baslangic_tarihi: new Date().toISOString().split('T')[0],
                    ozel_kodu: '',
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
          placeholder="Dönem, grup, şube veya özel kod ile ara..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dönemi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grup Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grup Başlangıç Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Şube Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Özel Kod</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
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
                      {item.donem || `${item.yil}-${String(item.ay).padStart(2, '0')}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.grup_adi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.grup_baslangic_tarihi
                        ? new Date(item.grup_baslangic_tarihi).toLocaleDateString('tr-TR')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.sube_adi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.ozel_kodu || '-'}
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

