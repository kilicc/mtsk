import { useState, useEffect } from 'react';
import { KursiyerOnKayit } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function KursiyerOnKayitPage() {
  const [onKayitlar, setOnKayitlar] = useState<KursiyerOnKayit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedOnKayit, setSelectedOnKayit] = useState<KursiyerOnKayit | null>(null);
  const [filterDurum, setFilterDurum] = useState<string>('0'); // 0: Pending, 1: Converted, 2: Cancelled, '': All

  const [formData, setFormData] = useState<Partial<KursiyerOnKayit>>({
    adi: '',
    soyadi: '',
    tc_kimlik: '',
    telefon: '',
    email: '',
    adres: '',
    dogum_tarihi: '',
    gorusme_tarihi: new Date().toISOString().split('T')[0],
    notlar: '',
    durum: 0,
  });

  // Fetch pre-registrations
  const fetchOnKayitlar = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filterDurum === '' 
        ? `${API_URL}/kursiyer-on-kayit`
        : `${API_URL}/kursiyer-on-kayit?durum=${filterDurum}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch pre-registrations');
      const data = await response.json();
      setOnKayitlar(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnKayitlar();
  }, [filterDurum]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = selectedOnKayit
        ? `${API_URL}/kursiyer-on-kayit/${selectedOnKayit.id}`
        : `${API_URL}/kursiyer-on-kayit`;
      const method = selectedOnKayit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save pre-registration');
      
      await fetchOnKayitlar();
      setShowForm(false);
      setSelectedOnKayit(null);
      setFormData({
        adi: '',
        soyadi: '',
        tc_kimlik: '',
        telefon: '',
        email: '',
        adres: '',
        dogum_tarihi: '',
        gorusme_tarihi: new Date().toISOString().split('T')[0],
        notlar: '',
        durum: 0,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle convert to full registration
  const handleConvert = async (id: number) => {
    if (!confirm('Bu ön kaydı kesin kayda aktarmak istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/kursiyer-on-kayit/${id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to convert pre-registration');
      
      alert('Ön kayıt kesin kayda başarıyla aktarıldı!');
      await fetchOnKayitlar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (onKayit: KursiyerOnKayit) => {
    setSelectedOnKayit(onKayit);
    setFormData({
      adi: onKayit.adi,
      soyadi: onKayit.soyadi,
      tc_kimlik: onKayit.tc_kimlik,
      telefon: onKayit.telefon,
      email: onKayit.email,
      adres: onKayit.adres,
      dogum_tarihi: onKayit.dogum_tarihi ? new Date(onKayit.dogum_tarihi).toISOString().split('T')[0] : '',
      gorusme_tarihi: onKayit.gorusme_tarihi ? new Date(onKayit.gorusme_tarihi).toISOString().split('T')[0] : '',
      notlar: onKayit.notlar,
      durum: onKayit.durum,
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Bu ön kaydı silmek istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/kursiyer-on-kayit/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete pre-registration');
      
      await fetchOnKayitlar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDurumLabel = (durum: number) => {
    switch (durum) {
      case 0: return 'Ön Kayıt';
      case 1: return 'Kesin Kayda Aktarıldı';
      case 2: return 'İptal';
      default: return 'Bilinmiyor';
    }
  };

  const getDurumColor = (durum: number) => {
    switch (durum) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Kursiyer Ön Kayıt</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setSelectedOnKayit(null);
            setFormData({
              adi: '',
              soyadi: '',
              tc_kimlik: '',
              telefon: '',
              email: '',
              adres: '',
              dogum_tarihi: '',
              gorusme_tarihi: new Date().toISOString().split('T')[0],
              notlar: '',
              durum: 0,
            });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Yeni Ön Kayıt
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Durum Filtresi
        </label>
        <select
          value={filterDurum}
          onChange={(e) => setFilterDurum(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="0">Ön Kayıt (Bekleyen)</option>
          <option value="1">Kesin Kayda Aktarıldı</option>
          <option value="2">İptal</option>
          <option value="">Tümü</option>
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedOnKayit ? 'Ön Kayıt Düzenle' : 'Yeni Ön Kayıt'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adı *</label>
                  <input
                    type="text"
                    required
                    value={formData.adi}
                    onChange={(e) => setFormData({ ...formData, adi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyadı *</label>
                  <input
                    type="text"
                    required
                    value={formData.soyadi}
                    onChange={(e) => setFormData({ ...formData, soyadi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik</label>
                  <input
                    type="text"
                    value={formData.tc_kimlik}
                    onChange={(e) => setFormData({ ...formData, tc_kimlik: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="text"
                    value={formData.telefon}
                    onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                <textarea
                  value={formData.adres}
                  onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                  <input
                    type="date"
                    value={typeof formData.dogum_tarihi === 'string' ? formData.dogum_tarihi : ''}
                    onChange={(e) => setFormData({ ...formData, dogum_tarihi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Görüşme Tarihi *</label>
                  <input
                    type="date"
                    required
                    value={typeof formData.gorusme_tarihi === 'string' ? formData.gorusme_tarihi : ''}
                    onChange={(e) => setFormData({ ...formData, gorusme_tarihi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                <textarea
                  value={formData.notlar}
                  onChange={(e) => setFormData({ ...formData, notlar: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedOnKayit(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {selectedOnKayit ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">Yükleniyor...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adı Soyadı</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TC Kimlik</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görüşme Tarihi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {onKayitlar.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Kayıt bulunamadı
                    </td>
                  </tr>
                ) : (
                  onKayitlar.map((onKayit) => (
                    <tr key={onKayit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {onKayit.adi} {onKayit.soyadi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {onKayit.tc_kimlik || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {onKayit.telefon || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {onKayit.gorusme_tarihi
                          ? new Date(onKayit.gorusme_tarihi).toLocaleDateString('tr-TR')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDurumColor(onKayit.durum)}`}>
                          {getDurumLabel(onKayit.durum)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {onKayit.durum === 0 && (
                            <button
                              onClick={() => handleConvert(onKayit.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Kesin Kayda Aktar"
                            >
                              ✓ Aktar
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(onKayit)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(onKayit.id)}
                            className="text-red-600 hover:text-red-900"
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
        </div>
      )}
    </div>
  );
}

