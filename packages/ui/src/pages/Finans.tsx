import { useState, useEffect } from 'react';
import { Muhasebe, KursiyerFatura, BorcRaporu, KasaRaporu } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

type FinansTab = 'odeme' | 'fatura' | 'kasa' | 'borc';

export default function Finans() {
  const [activeTab, setActiveTab] = useState<FinansTab>('odeme');
  const [odemeler, setOdemeler] = useState<Muhasebe[]>([]);
  const [faturalar, setFaturalar] = useState<KursiyerFatura[]>([]);
  const [borcRaporu, setBorcRaporu] = useState<BorcRaporu[]>([]);
  const [kasaRaporu, setKasaRaporu] = useState<KasaRaporu | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKursiyer, setSelectedKursiyer] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, [activeTab, selectedKursiyer]);

  const loadData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'odeme':
          const params = selectedKursiyer ? `?id_kursiyer=${selectedKursiyer}` : '';
          const odemeRes = await fetch(`${API_URL}/finans/muhasebe${params}`);
          setOdemeler(await odemeRes.json());
          break;
        case 'fatura':
          const faturaParams = selectedKursiyer ? `?id_kursiyer=${selectedKursiyer}` : '';
          const faturaRes = await fetch(`${API_URL}/finans/fatura${faturaParams}`);
          setFaturalar(await faturaRes.json());
          break;
        case 'kasa':
          const kasaRes = await fetch(`${API_URL}/finans/kasa/daily?tarih=${selectedDate}`);
          setKasaRaporu(await kasaRes.json());
          break;
        case 'borc':
          const borcRes = await fetch(`${API_URL}/finans/borc`);
          setBorcRaporu(await borcRes.json());
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    try {
      await fetch(`${API_URL}/finans/muhasebe/${id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ odeme_tarihi: new Date().toISOString() }),
      });
      loadData();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Finans & Kasa Yönetimi</h1>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('odeme')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'odeme' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Ödemeler
          </button>
          <button
            onClick={() => setActiveTab('fatura')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'fatura' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Faturalar
          </button>
          <button
            onClick={() => setActiveTab('kasa')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'kasa' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Kasa Raporu
          </button>
          <button
            onClick={() => setActiveTab('borc')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'borc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Borç Raporu
          </button>
        </div>

        {(activeTab === 'odeme' || activeTab === 'fatura') && (
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              placeholder="Kursiyer ID (opsiyonel)"
              value={selectedKursiyer || ''}
              onChange={(e) => setSelectedKursiyer(e.target.value ? parseInt(e.target.value) : null)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={loadData}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Filtrele
            </button>
          </div>
        )}

        {activeTab === 'kasa' && (
          <div className="flex gap-2 mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={loadData}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Raporu Getir
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">Yükleniyor...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {activeTab === 'odeme' && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursiyer ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vade Tarihi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ödeme Tarihi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {odemeler.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Kayıt bulunamadı</td>
                  </tr>
                ) : (
                  odemeler.map((odeme) => (
                    <tr key={odeme.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{odeme.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{odeme.id_kursiyer || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{odeme.tutar || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {odeme.vade_tarihi ? new Date(odeme.vade_tarihi).toLocaleDateString('tr-TR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {odeme.odeme_tarihi ? new Date(odeme.odeme_tarihi).toLocaleDateString('tr-TR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          odeme.kayit_durumu === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {odeme.kayit_durumu === 1 ? 'Ödendi' : 'Ödenmedi'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {odeme.kayit_durumu === 0 && (
                          <button
                            onClick={() => handleMarkAsPaid(odeme.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Ödendi İşaretle
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'fatura' && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursiyer ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fatura No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fatura Tarihi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faturalar.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Fatura bulunamadı</td>
                  </tr>
                ) : (
                  faturalar.map((fatura) => (
                    <tr key={fatura.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{fatura.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{fatura.id_kursiyer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{fatura.fatura_no || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {fatura.fatura_tarihi ? new Date(fatura.fatura_tarihi).toLocaleDateString('tr-TR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{fatura.fatura_toplam || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'kasa' && kasaRaporu && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Günlük Kasa Raporu - {new Date(selectedDate).toLocaleDateString('tr-TR')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Girişler</h3>
                  <p className="text-sm">Nakit: {kasaRaporu.nakit_giris?.toFixed(2) || '0.00'} ₺</p>
                  <p className="text-sm">Banka: {kasaRaporu.banka_giris?.toFixed(2) || '0.00'} ₺</p>
                  <p className="text-lg font-bold text-green-800 mt-2">
                    Toplam: {kasaRaporu.toplam_giris?.toFixed(2) || '0.00'} ₺
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Çıkışlar</h3>
                  <p className="text-sm">Nakit: {kasaRaporu.nakit_cikis?.toFixed(2) || '0.00'} ₺</p>
                  <p className="text-sm">Banka: {kasaRaporu.banka_cikis?.toFixed(2) || '0.00'} ₺</p>
                  <p className="text-lg font-bold text-red-800 mt-2">
                    Toplam: {kasaRaporu.toplam_cikis?.toFixed(2) || '0.00'} ₺
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg col-span-2">
                  <h3 className="font-semibold text-blue-800 mb-2">Gün Sonu Bakiyesi</h3>
                  <p className="text-2xl font-bold text-blue-800">
                    {kasaRaporu.bakiye?.toFixed(2) || '0.00'} ₺
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'borc' && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursiyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Borç</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vade Tarihi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gecikme (Gün)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borcRaporu.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Borç kaydı bulunamadı</td>
                  </tr>
                ) : (
                  borcRaporu.map((borc) => (
                    <tr key={borc.id_kursiyer} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {borc.kursiyer_adi} {borc.kursiyer_soyadi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                        {borc.toplam_borc.toFixed(2)} ₺
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {borc.vade_tarihi ? new Date(borc.vade_tarihi).toLocaleDateString('tr-TR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          (borc.gecikme_gunu || 0) > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {borc.gecikme_gunu || 0} gün
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

