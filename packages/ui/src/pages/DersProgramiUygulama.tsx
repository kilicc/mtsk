import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function DersProgramiUygulama() {
  const [mebbisDonemi, setMebbisDonemi] = useState('');
  const [kursiyer, setKursiyer] = useState('');
  const [programBaslamaTarihi, setProgramBaslamaTarihi] = useState('');
  const [egitimTuru, setEgitimTuru] = useState('normal');
  const [egitimAlinanYer, setEgitimAlinanYer] = useState('');
  const [esinavTarihi, setEsinavTarihi] = useState('');
  const [esinavTarihleri, setEsinavTarihleri] = useState<string[]>([]);
  const [gecenKursiyerler, setGecenKursiyerler] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [otomatikOlusturSonuc, setOtomatikOlusturSonuc] = useState<any>(null);

  useEffect(() => {
    loadESinavTarihleri();
  }, []);

  useEffect(() => {
    if (esinavTarihi) {
      loadGecenKursiyerler();
    } else {
      setGecenKursiyerler([]);
    }
  }, [esinavTarihi]);

  const loadESinavTarihleri = async () => {
    try {
      const response = await fetch(`${API_URL}/ders-programi/esinav/tarihler`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEsinavTarihleri(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading e-sınav tarihleri:', error);
      setEsinavTarihleri([]);
    }
  };

  const loadGecenKursiyerler = async () => {
    try {
      const response = await fetch(`${API_URL}/ders-programi/esinav/${esinavTarihi}/gecenler`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGecenKursiyerler(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading gecen kursiyerler:', error);
      setGecenKursiyerler([]);
    }
  };

  const dersTurleri = [
    { id: 'egitim-alani-simulator', label: 'Eğitim Alanı/Simülatör', toplam: 2, atanan: 0, kalan: 2 },
    { id: 'akan-trafik', label: 'Akan Trafik', toplam: 0, atanan: 0, kalan: 0 },
  ];

  const handleGoruntule = async () => {
    if (!mebbisDonemi || !kursiyer) {
      alert('Lütfen MEBBİS dönemi ve kursiyer seçiniz.');
      return;
    }
    try {
      setLoading(true);
      // TODO: Mevcut programları getir ve göster
      console.log('Görüntüle:', { mebbisDonemi, kursiyer, programBaslamaTarihi });
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOtomatikOlustur = async () => {
    if (!esinavTarihi || !programBaslamaTarihi) {
      alert('Lütfen E-sınav tarihi ve program başlama tarihi seçiniz.');
      return;
    }

    if (gecenKursiyerler.length === 0) {
      alert('Seçilen E-sınav tarihinde geçen kursiyer bulunamadı.');
      return;
    }

    if (!confirm(`${gecenKursiyerler.length} kursiyer için otomatik uygulama ders programı oluşturulacak. Devam edilsin mi?`)) {
      return;
    }

    try {
      setLoading(true);
      setOtomatikOlusturSonuc(null);
      
      const response = await fetch(`${API_URL}/ders-programi/otomatik/uygulama`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          esinavTarihi,
          mebbisDonemi: mebbisDonemi || undefined,
          programBaslamaTarihi,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'İşlem başarısız' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setOtomatikOlusturSonuc(result);
      alert(`Başarılı! ${result.olusturulan} ders programı oluşturuldu.${result.hatalar && result.hatalar.length > 0 ? `\n${result.hatalar.length} hata oluştu.` : ''}`);
      
      // Programı yeniden yükle
      handleGoruntule();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKaydet = async () => {
    if (!mebbisDonemi || !kursiyer) {
      alert('Lütfen MEBBİS dönemi ve kursiyer seçiniz.');
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
        <h1 className="text-2xl font-bold mb-4">Uygulama Ders Programı</h1>
        
        {/* Toolbar */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={handleOtomatikOlustur}
            disabled={!esinavTarihi || !programBaslamaTarihi || loading || gecenKursiyerler.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Oluşturuluyor...' : `Otomatik Oluştur (${gecenKursiyerler.length} kursiyer)`}
          </button>
          <button
            onClick={handleKaydet}
            disabled={!mebbisDonemi || !kursiyer || loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Ders Programını Kaydet
          </button>
          <button
            disabled={!mebbisDonemi || !kursiyer}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Mebbise Ders Programını Gönder
          </button>
          <button
            disabled={!mebbisDonemi || !kursiyer}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Mebbis Ders Programını Çek
          </button>
        </div>

        {/* Filtreleme */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-4">Otomatik Ders Programı Oluşturma</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-Sınav Tarihi</label>
              <select
                value={esinavTarihi}
                onChange={(e) => {
                  setEsinavTarihi(e.target.value);
                  if (!e.target.value) {
                    setGecenKursiyerler([]);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Seçiniz</option>
                {esinavTarihleri.map((tarih) => (
                  <option key={tarih} value={tarih}>
                    {new Date(tarih).toLocaleDateString('tr-TR')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Başlama Tarihi</label>
              <input
                type="date"
                value={programBaslamaTarihi}
                onChange={(e) => setProgramBaslamaTarihi(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Geçen Kursiyer Sayısı</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {gecenKursiyerler.length} kursiyer
              </div>
            </div>
          </div>
          
          {gecenKursiyerler.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>{gecenKursiyerler.length} kursiyer</strong> için otomatik ders programı oluşturulabilir.
                Her kursiyer günde 2 saat ders alacak şekilde dağıtılacak.
              </p>
            </div>
          )}
        </div>

        {/* Manuel Filtreleme */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-semibold mb-4">Manuel Filtreleme</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MEBBİS Dönemi</label>
              <select
                value={mebbisDonemi}
                onChange={(e) => {
                  setMebbisDonemi(e.target.value);
                  if (!e.target.value) {
                    setKursiyer('');
                    setProgramBaslamaTarihi('');
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Kursiyer</label>
              <select
                value={kursiyer}
                onChange={(e) => {
                  setKursiyer(e.target.value);
                  if (e.target.value) {
                    setProgramBaslamaTarihi('');
                  }
                }}
                disabled={!mebbisDonemi}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100"
              >
                <option value="">{mebbisDonemi ? 'Seçiniz' : 'Mebbis Dönemi Seçiniz'}</option>
                <option value="1">Ahmet Yılmaz</option>
                <option value="2">Ayşe Demir</option>
                <option value="3">Mehmet Kaya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prg.Bşl.Trh.</label>
              <input
                type="date"
                value={programBaslamaTarihi}
                onChange={(e) => setProgramBaslamaTarihi(e.target.value)}
                disabled={!mebbisDonemi || !kursiyer}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGoruntule}
                disabled={!mebbisDonemi || !kursiyer || loading}
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
                disabled={!mebbisDonemi || !kursiyer}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100"
              >
                <option value="normal">Normal</option>
                <option value="telafi">Telafi</option>
                <option value="2-dir">2.Dir.</option>
                <option value="basarisiz">Başarısız</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eğitim Alınan Yer</label>
              <select
                value={egitimAlinanYer}
                onChange={(e) => setEgitimAlinanYer(e.target.value)}
                disabled={!mebbisDonemi || !kursiyer}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100"
              >
                <option value="">Seçiniz</option>
                <option value="egitim-alani">Eğitim Alanı</option>
                <option value="simulator">Simülator</option>
                <option value="akan-trafik">Akan Trafik</option>
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
            {otomatikOlusturSonuc.analiz && (
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-sm font-semibold text-blue-900">Personel Yük Dağılımı:</p>
                  <div className="mt-1 space-y-1">
                    {otomatikOlusturSonuc.analiz.personelYuk?.map((p: any, idx: number) => (
                      <div key={idx} className="text-sm text-blue-700">
                        {p.personelAdi}: {p.haftalikSaat}/40 saat (Kalan: {p.kalanKapasite} saat)
                      </div>
                    ))}
                  </div>
                </div>
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
          </div>
        )}

        {(!mebbisDonemi || !kursiyer) && !esinavTarihi && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Programı oluşturma işlemine başlamak/devam etmek için lütfen yukarıda yer alan E-sınav tarihini seçip otomatik oluştur butonuna basınız, veya manuel filtreleme için MEBBİS dönemi ve kursiyer seçip 'Görüntüle' butonuna basınız.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

