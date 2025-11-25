import { useState, useEffect } from 'react';
import type { Kasa, KasaIslemi } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function KasaParaGirisCikis() {
  const [kasas, setKasas] = useState<Kasa[]>([]);
  const [selectedKasa, setSelectedKasa] = useState<number | ''>('');
  const [islemTarihi, setIslemTarihi] = useState(new Date().toISOString().split('T')[0]);
  const [islemTipi, setIslemTipi] = useState<'giris' | 'cikis'>('giris');
  const [tutar, setTutar] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [odemeYontemi, setOdemeYontemi] = useState('nakit');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadKasas();
  }, []);

  const loadKasas = async () => {
    try {
      const response = await fetch(`${API_URL}/kasa`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setKasas(data || []);
      if (data && data.length > 0 && !selectedKasa) {
        setSelectedKasa(data[0].id);
      }
    } catch (error) {
      console.error('Error loading kasas:', error);
      setKasas([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedKasa || !tutar || parseFloat(tutar) <= 0) {
      alert('Lütfen kasa seçin ve geçerli bir tutar girin.');
      return;
    }

    try {
      setLoading(true);
      const islem: Omit<KasaIslemi, 'id' | 'kayit_tarihi'> = {
        id_kasa: Number(selectedKasa),
        islem_tarihi: islemTarihi,
        islem_tipi: islemTipi,
        tutar: parseFloat(tutar),
        aciklama: aciklama || undefined,
        odeme_yontemi: odemeYontemi,
      };

      const response = await fetch(`${API_URL}/kasa/islemi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(islem),
      });

      if (response.ok) {
        alert('İşlem başarıyla kaydedildi!');
        setTutar('');
        setAciklama('');
        await loadKasas(); // Kasa bakiyelerini güncelle
      } else {
        const error = await response.json();
        alert(`Hata: ${error.error || 'İşlem kaydedilemedi'}`);
      }
    } catch (error) {
      console.error('Error saving islem:', error);
      alert('İşlem kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="card">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Para Giriş/Çıkışı Ekle
        </h1>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="kasa-select">
                Kasa <span className="text-red-500">*</span>
              </label>
              <select
                id="kasa-select"
                value={selectedKasa}
                onChange={(e) => setSelectedKasa(e.target.value ? Number(e.target.value) : '')}
                className="input"
                required
              >
                <option value="">Kasa Seçiniz</option>
                {kasas.map(kasa => (
                  <option key={kasa.id} value={kasa.id}>
                    {kasa.kasa_adi} {kasa.bakiye !== undefined && `(Bakiye: ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(kasa.bakiye)})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="islem-tarihi">
                İşlem Tarihi <span className="text-red-500">*</span>
              </label>
              <input
                id="islem-tarihi"
                type="date"
                value={islemTarihi}
                onChange={(e) => setIslemTarihi(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="islem-tipi">
                İşlem Tipi <span className="text-red-500">*</span>
              </label>
              <select
                id="islem-tipi"
                value={islemTipi}
                onChange={(e) => setIslemTipi(e.target.value as 'giris' | 'cikis')}
                className="input"
                required
              >
                <option value="giris">Para Girişi</option>
                <option value="cikis">Para Çıkışı</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tutar">
                Tutar <span className="text-red-500">*</span>
              </label>
              <input
                id="tutar"
                type="number"
                step="0.01"
                min="0.01"
                value={tutar}
                onChange={(e) => setTutar(e.target.value)}
                className="input"
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="odeme-yontemi">
                Ödeme Yöntemi
              </label>
              <select
                id="odeme-yontemi"
                value={odemeYontemi}
                onChange={(e) => setOdemeYontemi(e.target.value)}
                className="input"
              >
                <option value="nakit">Nakit</option>
                <option value="kredi_karti">Kredi Kartı</option>
                <option value="banka">Banka</option>
                <option value="havale">Havale</option>
                <option value="cek">Çek</option>
                <option value="diger">Diğer</option>
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
                placeholder="İşlem açıklaması..."
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button
              type="button"
              onClick={() => {
                setTutar('');
                setAciklama('');
              }}
              className="btn btn-outline"
            >
              Temizle
            </button>
          </div>
        </form>
      </div>

      {/* Bilgi Notu */}
      <div className="card bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Not:</strong> Para girişi işlemleri kasa bakiyesini artırır, para çıkışı işlemleri azaltır. 
          İşlem kaydedildikten sonra kasa bakiyesi otomatik olarak güncellenir.
        </p>
      </div>
    </div>
  );
}

