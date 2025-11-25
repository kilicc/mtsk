import { useState, useEffect } from 'react';
import type { Kasa, KasaTransfer } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function KasaTransfer() {
  const [kasas, setKasas] = useState<Kasa[]>([]);
  const [idKaynakKasa, setIdKaynakKasa] = useState<number | ''>('');
  const [idHedefKasa, setIdHedefKasa] = useState<number | ''>('');
  const [transferTarihi, setTransferTarihi] = useState(new Date().toISOString().split('T')[0]);
  const [tutar, setTutar] = useState('');
  const [aciklama, setAciklama] = useState('');
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
    } catch (error) {
      console.error('Error loading kasas:', error);
      setKasas([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idKaynakKasa || !idHedefKasa || !tutar || parseFloat(tutar) <= 0) {
      alert('Lütfen tüm alanları doldurun ve geçerli bir tutar girin.');
      return;
    }

    if (idKaynakKasa === idHedefKasa) {
      alert('Kaynak ve hedef kasa aynı olamaz!');
      return;
    }

    const kaynakKasa = kasas.find(k => k.id === idKaynakKasa);
    if (kaynakKasa && (kaynakKasa.bakiye || 0) < parseFloat(tutar)) {
      if (!confirm(`Kaynak kasanın bakiyesi (${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(kaynakKasa.bakiye || 0)}) transfer tutarından küçük. Devam etmek istiyor musunuz?`)) {
        return;
      }
    }

    try {
      setLoading(true);
      const transfer: Omit<KasaTransfer, 'id' | 'kayit_tarihi'> = {
        id_kaynak_kasa: Number(idKaynakKasa),
        id_hedef_kasa: Number(idHedefKasa),
        transfer_tarihi: transferTarihi,
        tutar: parseFloat(tutar),
        aciklama: aciklama || undefined,
      };

      const response = await fetch(`${API_URL}/kasa/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transfer),
      });

      if (response.ok) {
        alert('Transfer başarıyla tamamlandı!');
        setTutar('');
        setAciklama('');
        setIdKaynakKasa('');
        setIdHedefKasa('');
        await loadKasas(); // Kasa bakiyelerini güncelle
      } else {
        const error = await response.json();
        alert(`Hata: ${error.error || 'Transfer tamamlanamadı'}`);
      }
    } catch (error) {
      console.error('Error creating transfer:', error);
      alert('Transfer sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 }).format(value || 0);

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="card">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Kasalar Arası Transfer
        </h1>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="kaynak-kasa">
                Kaynak Kasa <span className="text-red-500">*</span>
              </label>
              <select
                id="kaynak-kasa"
                value={idKaynakKasa}
                onChange={(e) => setIdKaynakKasa(e.target.value ? Number(e.target.value) : '')}
                className="input"
                required
              >
                <option value="">Kaynak Kasa Seçiniz</option>
                {kasas.map(kasa => (
                  <option key={kasa.id} value={kasa.id}>
                    {kasa.kasa_adi} {kasa.bakiye !== undefined && `(Bakiye: ${formatCurrency(kasa.bakiye)})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="hedef-kasa">
                Hedef Kasa <span className="text-red-500">*</span>
              </label>
              <select
                id="hedef-kasa"
                value={idHedefKasa}
                onChange={(e) => setIdHedefKasa(e.target.value ? Number(e.target.value) : '')}
                className="input"
                required
              >
                <option value="">Hedef Kasa Seçiniz</option>
                {kasas
                  .filter(kasa => kasa.id !== idKaynakKasa)
                  .map(kasa => (
                    <option key={kasa.id} value={kasa.id}>
                      {kasa.kasa_adi} {kasa.bakiye !== undefined && `(Bakiye: ${formatCurrency(kasa.bakiye)})`}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="transfer-tarihi">
                Transfer Tarihi <span className="text-red-500">*</span>
              </label>
              <input
                id="transfer-tarihi"
                type="date"
                value={transferTarihi}
                onChange={(e) => setTransferTarihi(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="transfer-tutar">
                Transfer Tutarı <span className="text-red-500">*</span>
              </label>
              <input
                id="transfer-tutar"
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="transfer-aciklama">
                Açıklama
              </label>
              <textarea
                id="transfer-aciklama"
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                className="input"
                rows={3}
                placeholder="Transfer açıklaması..."
              />
            </div>
          </div>

          {/* Özet Bilgi */}
          {idKaynakKasa && idHedefKasa && tutar && parseFloat(tutar) > 0 && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Transfer Özeti</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Kaynak Kasa</p>
                  <p className="font-medium text-gray-900">
                    {kasas.find(k => k.id === idKaynakKasa)?.kasa_adi}
                  </p>
                  <p className="text-red-600">
                    -{formatCurrency(parseFloat(tutar))}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Hedef Kasa</p>
                  <p className="font-medium text-gray-900">
                    {kasas.find(k => k.id === idHedefKasa)?.kasa_adi}
                  </p>
                  <p className="text-green-600">
                    +{formatCurrency(parseFloat(tutar))}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Transfer Ediliyor...' : 'Transfer Et'}
            </button>
            <button
              type="button"
              onClick={() => {
                setTutar('');
                setAciklama('');
                setIdKaynakKasa('');
                setIdHedefKasa('');
              }}
              className="btn btn-outline"
            >
              Temizle
            </button>
          </div>
        </form>
      </div>

      {/* Uyarı */}
      <div className="card bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>Dikkat:</strong> Transfer işlemi geri alınamaz. Transfer tamamlandıktan sonra kaynak kasadan tutar düşülür ve hedef kasaya eklenir.
        </p>
      </div>
    </div>
  );
}

