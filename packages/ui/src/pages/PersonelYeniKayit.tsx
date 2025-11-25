import { useState, useEffect } from 'react';
import type { Personel } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

interface PersonelYeniKayitProps {
  id?: string;
  onBack?: () => void;
  onSave?: () => void;
}

export default function PersonelYeniKayit({ id, onBack, onSave }: PersonelYeniKayitProps) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!!id);
  const [formData, setFormData] = useState<Partial<Personel>>({
    adi: '',
    soyadi: '',
    personel_no: undefined,
    tc_kimlik: '',
    telefon: '',
    email: '',
    gorev: '',
    kayit_tarihi: new Date().toISOString().split('T')[0],
    gorev_bas_tarihi: '',
    calisma_izin_tar: '',
    dogum_tarihi: '',
    akt: 1,
  });

  useEffect(() => {
    if (id) {
      loadPersonel();
    }
  }, [id]);

  const loadPersonel = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/arac-personel/personel/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error loading personel:', error);
      alert('Personel bilgileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.adi || !formData.soyadi) {
      alert('Ad ve Soyad zorunludur');
      return;
    }

    try {
      setLoading(true);
      const url = isEditing 
        ? `${API_URL}/arac-personel/personel/${id}`
        : `${API_URL}/arac-personel/personel`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'İşlem başarısız' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      alert(isEditing ? 'Personel başarıyla güncellendi!' : 'Personel başarıyla oluşturuldu!');
      if (onSave) onSave();
      if (onBack && !isEditing) onBack();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Personel, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          {onBack && (
            <button onClick={onBack} className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2">
              ← Geri
            </button>
          )}
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Personel Düzenle' : 'Personel Yeni Kayıt'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFormData({
                adi: '',
                soyadi: '',
                personel_no: undefined,
                tc_kimlik: '',
                telefon: '',
                email: '',
                gorev: '',
                kayit_tarihi: new Date().toISOString().split('T')[0],
                gorev_bas_tarihi: '',
                calisma_izin_tar: '',
                dogum_tarihi: '',
                akt: 1,
              });
              setIsEditing(false);
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Yeni
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.adi || ''}
              onChange={(e) => handleChange('adi', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Soyadı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.soyadi || ''}
              onChange={(e) => handleChange('soyadi', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TC Kimlik No</label>
            <input
              type="text"
              value={formData.tc_kimlik || ''}
              onChange={(e) => handleChange('tc_kimlik', e.target.value)}
              maxLength={11}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personel No</label>
            <input
              type="number"
              value={formData.personel_no || ''}
              onChange={(e) => handleChange('personel_no', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="tel"
              value={formData.telefon || ''}
              onChange={(e) => handleChange('telefon', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Görev</label>
            <input
              type="text"
              value={formData.gorev || ''}
              onChange={(e) => handleChange('gorev', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kayıt Tarihi</label>
            <input
              type="date"
              value={formData.kayit_tarihi ? (typeof formData.kayit_tarihi === 'string' ? formData.kayit_tarihi.split('T')[0] : new Date(formData.kayit_tarihi).toISOString().split('T')[0]) : ''}
              onChange={(e) => handleChange('kayit_tarihi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Görev Başlangıç Tarihi</label>
            <input
              type="date"
              value={formData.gorev_bas_tarihi ? (typeof formData.gorev_bas_tarihi === 'string' ? formData.gorev_bas_tarihi.split('T')[0] : new Date(formData.gorev_bas_tarihi).toISOString().split('T')[0]) : ''}
              onChange={(e) => handleChange('gorev_bas_tarihi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
            <input
              type="date"
              value={formData.dogum_tarihi ? (typeof formData.dogum_tarihi === 'string' ? formData.dogum_tarihi.split('T')[0] : new Date(formData.dogum_tarihi).toISOString().split('T')[0]) : ''}
              onChange={(e) => handleChange('dogum_tarihi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
            <select
              value={formData.akt ?? 1}
              onChange={(e) => handleChange('akt', parseInt(e.target.value))}
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
            {loading ? 'Kaydediliyor...' : isEditing ? 'Güncelle' : 'Kaydet'}
          </button>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              İptal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

