import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

interface BankaHesabi {
  id: number;
  banka_adi: string;
  hesap_adi?: string;
  hesap_no?: string;
  iban?: string;
  sube_adi?: string;
  sube_kodu?: string;
  bakiye?: number;
  notlar?: string;
  akt?: number;
}

interface BankaIslemi {
  id: number;
  id_banka_hesabi: number;
  islem_tarihi: Date | string;
  islem_tipi: 'giris' | 'cikis';
  tutar: number;
  aciklama?: string;
  id_kursiyer?: number;
  id_fatura?: number;
  kayit_tarihi?: Date | string;
}

export default function Banka() {
  const [hesaplar, setHesaplar] = useState<BankaHesabi[]>([]);
  const [islemler, setIslemler] = useState<BankaIslemi[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hesaplar' | 'islemler'>('hesaplar');
  const [selectedHesap, setSelectedHesap] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, [activeTab, selectedHesap, dateFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'hesaplar') {
        const response = await fetch(`${API_URL}/banka/hesaplar`);
        const data = await response.json();
        setHesaplar(data || []);
      } else {
        const params = new URLSearchParams();
        if (selectedHesap) params.append('id_banka_hesabi', selectedHesap.toString());
        params.append('tarih', dateFilter);
        const response = await fetch(`${API_URL}/banka/islemler?${params}`);
        const data = await response.json();
        setIslemler(data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Banka Yönetimi</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('hesaplar')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'hesaplar'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Banka Hesapları
            </button>
            <button
              onClick={() => setActiveTab('islemler')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'islemler'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Banka İşlemleri
            </button>
          </nav>
        </div>

        <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
          {activeTab === 'hesaplar' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hesaplar.map((hesap) => (
                  <div key={hesap.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{hesap.banka_adi}</h3>
                    <p className="text-sm text-gray-600 mb-1">Hesap: {hesap.hesap_adi || '-'}</p>
                    <p className="text-sm text-gray-600 mb-1">IBAN: {hesap.iban || '-'}</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      Bakiye: {hesap.bakiye?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) || '0,00 ₺'}
                    </p>
                  </div>
                ))}
              </div>
              {hesaplar.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Henüz banka hesabı kaydı bulunmamaktadır.
                </div>
              )}
            </div>
          )}

          {activeTab === 'islemler' && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <select
                  value={selectedHesap || ''}
                  onChange={(e) => setSelectedHesap(e.target.value ? Number(e.target.value) : null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tüm Hesaplar</option>
                  {hesaplar.map((h) => (
                    <option key={h.id} value={h.id}>{h.banka_adi}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem Tipi</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {islemler.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                          İşlem kaydı bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      islemler.map((islem) => (
                        <tr key={islem.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {new Date(islem.islem_tarihi).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded ${
                              islem.islem_tipi === 'giris' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {islem.islem_tipi === 'giris' ? 'Giriş' : 'Çıkış'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {islem.tutar.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{islem.aciklama || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

