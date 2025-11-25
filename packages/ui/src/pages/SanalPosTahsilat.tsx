import { useState } from 'react';

export default function SanalPosTahsilat() {
  const [formData, setFormData] = useState({
    kursiyer_adi: '',
    email: '',
    tutar: '',
  });
  const [loading, setLoading] = useState(false);
  const [odemeLinki, setOdemeLinki] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.kursiyer_adi || !formData.email || !formData.tutar) {
      alert('Lütfen tüm alanları doldurunuz.');
      return;
    }

    try {
      setLoading(true);
      // TODO: Backend API entegrasyonu - Paytr veya başka bir sanal pos servisi
      // Şimdilik mock response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock ödeme linki ve QR kod
      setOdemeLinki('https://www.paytr.com/odeme/guvenli/123456789');
      setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
      
      alert('Ödeme linki oluşturuldu!');
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (odemeLinki) {
      navigator.clipboard.writeText(odemeLinki);
      alert('Ödeme linki kopyalandı!');
    }
  };

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Sanal Pos - Tahsilat İşlemi</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Uyarı:</strong> Sanal Pos Paytr entegrasyon bilgilerini girmek gerekiyor. 
            Entegrasyon bilgilerini girdikten sonra bu bölümden ödeme alınabilir. 
            Entegrasyon bilgilerini almak için paytr.com üzerinden ücretsiz sanal pos başvurusunda bulunmak gerekiyor.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Ödeme Linki Oluştur</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kursiyer / Cari Adı Soyadı
              </label>
              <input
                type="text"
                value={formData.kursiyer_adi}
                onChange={(e) => setFormData({ ...formData, kursiyer_adi: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Adı Soyadı"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta Adresi</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İşlem Tutarı (₺)</label>
              <input
                type="number"
                step="0.01"
                value={formData.tutar}
                onChange={(e) => setFormData({ ...formData, tutar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="0.00"
                min="0"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !formData.kursiyer_adi || !formData.email || !formData.tutar}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Oluşturuluyor...' : 'Ödeme Linki Al'}
          </button>
        </form>
      </div>

      {odemeLinki && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Ödeme Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">QR Kod</h3>
              {qrCode && (
                <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Ödeme Linki</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={odemeLinki}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Kopyala
                </button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Geçerlilik Tarihi:</strong> {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Paylaş:</strong> Linki kopyalayarak paylaşabilirsiniz
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Bilgi:</strong> Bilgileri doldurduktan sonra ödeme linkini ve QR kodu yukarıda görebilirsiniz.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

