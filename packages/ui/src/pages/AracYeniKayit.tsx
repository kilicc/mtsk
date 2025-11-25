import { useState, useEffect } from 'react';
import type { Arac } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

interface AracYeniKayitProps {
  id?: string;
  onBack?: () => void;
  onSave?: () => void;
}

export default function AracYeniKayit({ id, onBack, onSave }: AracYeniKayitProps) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!!id);
  const [formData, setFormData] = useState<Partial<Arac>>({
    plaka: '',
    arac_tescil_tar: '',
    hiz_bas_tar: '',
    muhayene_tar: '',
    sigorta_bas_tar: '',
    sigorta_bit_tar: '',
    kasko_bas_tar: '',
    kasko_bit_tar: '',
    kasko_isl_bedeli: '',
    akt: 1,
  });

  useEffect(() => {
    if (id) {
      loadArac();
    }
  }, [id]);

  const loadArac = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/arac-personel/arac/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error loading arac:', error);
      alert('Araç bilgileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.plaka) {
      alert('Plaka zorunludur');
      return;
    }

    try {
      setLoading(true);
      const url = isEditing 
        ? `${API_URL}/arac-personel/arac/${id}`
        : `${API_URL}/arac-personel/arac`;
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

      alert(isEditing ? 'Araç başarıyla güncellendi!' : 'Araç başarıyla oluşturuldu!');
      if (onSave) onSave();
      if (onBack && !isEditing) onBack();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Arac, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return new Date(date).toISOString().split('T')[0];
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
            {isEditing ? 'Araç Düzenle' : 'Araç Yeni Kayıt'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFormData({
                plaka: '',
                arac_tescil_tar: '',
                hiz_bas_tar: '',
                muhayene_tar: '',
                sigorta_bas_tar: '',
                sigorta_bit_tar: '',
                kasko_bas_tar: '',
                kasko_bit_tar: '',
                kasko_isl_bedeli: '',
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
              Plaka <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.plaka || ''}
              onChange={(e) => handleChange('plaka', e.target.value.toUpperCase())}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="34 ABC 123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Araç Tescil Tarihi</label>
            <input
              type="date"
              value={formatDate(formData.arac_tescil_tar)}
              onChange={(e) => handleChange('arac_tescil_tar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hizmet Başlangıç Tarihi</label>
            <input
              type="date"
              value={formatDate(formData.hiz_bas_tar)}
              onChange={(e) => handleChange('hiz_bas_tar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Muayene Tarihi</label>
            <input
              type="date"
              value={formatDate(formData.muhayene_tar)}
              onChange={(e) => handleChange('muhayene_tar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sigorta Başlangıç Tarihi</label>
            <input
              type="date"
              value={formatDate(formData.sigorta_bas_tar)}
              onChange={(e) => handleChange('sigorta_bas_tar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sigorta Bitiş Tarihi</label>
            <input
              type="date"
              value={formatDate(formData.sigorta_bit_tar)}
              onChange={(e) => handleChange('sigorta_bit_tar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kasko Başlangıç Tarihi</label>
            <input
              type="date"
              value={formatDate(formData.kasko_bas_tar)}
              onChange={(e) => handleChange('kasko_bas_tar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kasko Bitiş Tarihi</label>
            <input
              type="date"
              value={formatDate(formData.kasko_bit_tar)}
              onChange={(e) => handleChange('kasko_bit_tar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kasko İşlem Bedeli</label>
            <input
              type="text"
              value={formData.kasko_isl_bedeli || ''}
              onChange={(e) => handleChange('kasko_isl_bedeli', e.target.value)}
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

