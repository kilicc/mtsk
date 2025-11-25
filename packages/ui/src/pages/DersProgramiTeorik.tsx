import { useState } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function DersProgramiTeorik() {
  const [mebbisDonemi, setMebbisDonemi] = useState('');
  const [grupBaslangicTarihi, setGrupBaslangicTarihi] = useState('');
  const [egitimTuru, setEgitimTuru] = useState('normal');
  const [dersTuru, setDersTuru] = useState('');
  const [loading, setLoading] = useState(false);
  const [otomatikOlusturSonuc, setOtomatikOlusturSonuc] = useState<any>(null);

  const dersTurleri = [
    { id: 'trafik-cevre', label: 'Trafik ve Çevre Bilgisi', toplam: 16, atanan: 0, kalan: 16 },
    { id: 'ilk-yardim', label: 'İlk Yardım', toplam: 8, atanan: 0, kalan: 8 },
    { id: 'arac-teknigi', label: 'Araç Tekniği', toplam: 6, atanan: 0, kalan: 6 },
    { id: 'trafik-adabi', label: 'Trafik Adabı', toplam: 4, atanan: 0, kalan: 4 },
  ];

  const handleGoruntule = async () => {
    if (!mebbisDonemi) {
      alert('Lütfen MEBBİS dönemi seçiniz.');
      return;
    }
    try {
      setLoading(true);
      // TODO: Mevcut programları getir ve göster
      console.log('Görüntüle:', { mebbisDonemi, grupBaslangicTarihi });
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOtomatikOlustur = async () => {
    if (!mebbisDonemi || !grupBaslangicTarihi) {
      alert('Lütfen MEBBİS dönemi ve grup başlangıç tarihi seçiniz.');
      return;
    }

    if (!confirm('Otomatik teorik ders programı oluşturulacak. Devam edilsin mi?')) {
      return;
    }

    try {
      setLoading(true);
      setOtomatikOlusturSonuc(null);
      
      const response = await fetch(`${API_URL}/ders-programi/otomatik/teorik`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mebbisDonemi,
          grupBaslangicTarihi,
          egitimTuru,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'İşlem başarısız' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setOtomatikOlusturSonuc(result);
      alert(`Başarılı! ${result.olusturulan} ders programı oluşturuldu.${result.hatalar.length > 0 ? `\n${result.hatalar.length} hata oluştu.` : ''}`);
      
      // Programı yeniden yükle
      handleGoruntule();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKaydet = async () => {
    if (!mebbisDonemi) {
      alert('Lütfen MEBBİS dönemi seçiniz.');
      return;
    }
    try {
      setLoading(true);
      // TODO: API call - mevcut programı kaydet
      alert('Ders programı kaydedildi!');
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-amber-50 min-h-screen" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Teorik Ders Programı</h1>
        
        {/* Toolbar */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={handleOtomatikOlustur}
            disabled={!mebbisDonemi || !grupBaslangicTarihi || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Oluşturuluyor...' : 'Otomatik Ders Programı Oluştur'}
          </button>
          <button
            onClick={handleKaydet}
            disabled={!mebbisDonemi || loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Ders Programını Kaydet
          </button>
          <button
            disabled={!mebbisDonemi}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Ders Programını Yazdır
          </button>
          <button
            disabled={!mebbisDonemi}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Yoklama Çizelgesi Bastır
          </button>
          <button
            disabled={!mebbisDonemi}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Mebbise Ders Programını Gönder
          </button>
          <button
            disabled={!mebbisDonemi}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Mebbis Ders Programını Çek
          </button>
        </div>

        {/* Filtreleme */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MEBBİS Dönemi</label>
              <select
                value={mebbisDonemi}
                onChange={(e) => {
                  setMebbisDonemi(e.target.value);
                  if (e.target.value) {
                    setGrupBaslangicTarihi('');
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Seçiniz</option>
                <option value="2024-1">2024-1</option>
                <option value="2024-2">2024-2</option>
                <option value="2025-1">2025-1</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grup Başlangıç Tarihi</label>
              <input
                type="date"
                value={grupBaslangicTarihi}
                onChange={(e) => setGrupBaslangicTarihi(e.target.value)}
                disabled={!mebbisDonemi}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGoruntule}
                disabled={!mebbisDonemi}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Görüntüle
              </button>
            </div>
          </div>
        </div>

        {/* Ders Ekleme Paneli */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-4">Ders Ekleme Paneli</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eğitim Türü</label>
              <select
                value={egitimTuru}
                onChange={(e) => setEgitimTuru(e.target.value)}
                disabled={!mebbisDonemi}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100"
              >
                <option value="normal">Normal Eğitim</option>
                <option value="telafi">Telafi Eğitim</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ders Türü</label>
              <select
                value={dersTuru}
                onChange={(e) => setDersTuru(e.target.value)}
                disabled={!mebbisDonemi}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100"
              >
                <option value="">Seçiniz</option>
                <option value="trafik-cevre">Trafik ve Çevre Bilgisi</option>
                <option value="ilk-yardim">İlk Yardım</option>
                <option value="arac-teknigi">Araç Tekniği</option>
                <option value="trafik-adabi">Trafik Adabı</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ders Türü Özet Tablosu */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-4">Ders Türü Özet Tablosu</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ders Türü</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Atanan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kalan</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dersTurleri.map((ders) => (
                <tr key={ders.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ders.label}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ders.toplam}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ders.atanan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ders.kalan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Personel Atama Tablosu */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Personel Atama Tablosu</h2>
          <div className="text-center py-8 text-gray-500">
            Atama Yapılmadı
          </div>
        </div>

        {otomatikOlusturSonuc && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Otomatik Oluşturma Sonucu</h3>
            <p className="text-blue-800 mb-2">Oluşturulan: {otomatikOlusturSonuc.olusturulan} ders programı</p>
            {otomatikOlusturSonuc.hatalar && otomatikOlusturSonuc.hatalar.length > 0 && (
              <div className="mt-2">
                <p className="text-red-800 font-semibold">Hatalar:</p>
                <ul className="list-disc list-inside text-red-700 text-sm">
                  {otomatikOlusturSonuc.hatalar.map((hata: string, idx: number) => (
                    <li key={idx}>{hata}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!mebbisDonemi && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Programı oluşturma işlemine başlamak/devam etmek için lütfen yukarıda yer alan mebbis dönemini seçip, 'Görüntüle' butonuna basınız.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

