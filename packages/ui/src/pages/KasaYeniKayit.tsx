import { useState, useEffect } from 'react';
import type { Kasa } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

interface KasaYeniKayitProps {
  kasaId?: number;
  onBack?: () => void;
}

export default function KasaYeniKayit({ kasaId: propKasaId, onBack }: KasaYeniKayitProps = {}) {
  const [kasaAdi, setKasaAdi] = useState('');
  const [kasaKodu, setKasaKodu] = useState('');
  const [bakiye, setBakiye] = useState('0');
  const [aciklama, setAciklama] = useState('');
  const [akt, setAkt] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [kasaId, setKasaId] = useState<number | null>(propKasaId || null);

  useEffect(() => {
    if (propKasaId) {
      setKasaId(propKasaId);
      setEditMode(true);
      loadKasa(propKasaId);
    }
  }, [propKasaId]);

  const loadKasa = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/kasa/${id}`);
      const data = await response.json();
      setKasaAdi(data.kasa_adi || '');
      setKasaKodu(data.kasa_kodu || '');
      setBakiye(String(data.bakiye || 0));
      setAciklama(data.aciklama || '');
      setAkt(data.akt || 1);
    } catch (error) {
      console.error('Error loading kasa:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kasaAdi.trim()) {
      alert('Kasa adı zorunludur.');
      return;
    }

    try {
      setLoading(true);
      const kasaData: Omit<Kasa, 'id' | 'kayit_tarihi'> = {
        kasa_adi: kasaAdi.trim(),
        kasa_kodu: kasaKodu.trim() || undefined,
        bakiye: parseFloat(bakiye) || 0,
        aciklama: aciklama.trim() || undefined,
        akt: akt,
      };

      const url = editMode && kasaId ? `${API_URL}/kasa/${kasaId}` : `${API_URL}/kasa`;
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kasaData),
      });

      if (response.ok) {
        alert(editMode ? 'Kasa başarıyla güncellendi!' : 'Kasa başarıyla oluşturuldu!');
        if (!editMode) {
          // Yeni kayıt modunda formu temizle
          setKasaAdi('');
          setKasaKodu('');
          setBakiye('0');
          setAciklama('');
          setAkt(1);
        }
      } else {
        const error = await response.json();
        alert(`Hata: ${error.error || 'Kasa kaydedilemedi'}`);
      }
    } catch (error) {
      console.error('Error saving kasa:', error);
      alert('Kasa kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!kasaId) return;
    if (!confirm('Bu kasayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/kasa/${kasaId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Kasa başarıyla silindi!');
        onBack?.();
      } else {
        const error = await response.json();
        alert(`Hata: ${error.error || 'Kasa silinemedi'}`);
      }
    } catch (error) {
      console.error('Error deleting kasa:', error);
      alert('Kasa silinirken bir hata oluştu.');
    }
  };

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              {editMode ? 'Kasa Düzenle' : 'Kasa Yeni Kayıt'}
            </h1>
            <p className="text-sm text-gray-500">
              {editMode ? 'Kasa bilgilerini düzenleyin' : 'Yeni kasa kaydı oluşturun'}
            </p>
          </div>
          <div className="flex gap-2">
            {editMode && (
              <button
                onClick={handleDelete}
                className="btn btn-outline text-sm text-red-600 hover:bg-red-50"
              >
                Sil
              </button>
            )}
            <button
              onClick={() => onBack?.()}
              className="btn btn-outline text-sm"
            >
              Listeye Dön
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="kasa-adi">
                Kasa Adı <span className="text-red-500">*</span>
              </label>
              <input
                id="kasa-adi"
                type="text"
                value={kasaAdi}
                onChange={(e) => setKasaAdi(e.target.value)}
                className="input"
                placeholder="Örn: Ana Kasa, Şube Kasa"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="kasa-kodu">
                Kasa Kodu
              </label>
              <input
                id="kasa-kodu"
                type="text"
                value={kasaKodu}
                onChange={(e) => setKasaKodu(e.target.value)}
                className="input"
                placeholder="Opsiyonel kasa kodu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bakiye">
                Başlangıç Bakiye
              </label>
              <input
                id="bakiye"
                type="number"
                step="0.01"
                value={bakiye}
                onChange={(e) => setBakiye(e.target.value)}
                className="input"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="akt">
                Durum
              </label>
              <select
                id="akt"
                value={akt}
                onChange={(e) => setAkt(Number(e.target.value))}
                className="input"
              >
                <option value={1}>Aktif</option>
                <option value={0}>Pasif</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="aciklama">
                Açıklama
              </label>
              <textarea
                id="aciklama"
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                className="input"
                rows={3}
                placeholder="Kasa hakkında notlar..."
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Kaydediliyor...' : editMode ? 'Güncelle' : 'Kaydet'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!editMode) {
                  setKasaAdi('');
                  setKasaKodu('');
                  setBakiye('0');
                  setAciklama('');
                  setAkt(1);
                }
              }}
              className="btn btn-outline"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

