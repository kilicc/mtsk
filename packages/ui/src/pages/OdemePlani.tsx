import { useState, useEffect, useMemo } from 'react';
import type { OdemePlani } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

interface KursiyerOdemePlani extends OdemePlani {
  kursiyer_adi?: string;
  kursiyer_soyadi?: string;
  kursiyer_tc?: string;
}

export default function OdemePlani() {
  const [odemePlanlari, setOdemePlanlari] = useState<KursiyerOdemePlani[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKursiyer, setSelectedKursiyer] = useState<number | null>(null);
  const [kursiyerler, setKursiyerler] = useState<any[]>([]);
  const [showYeniPlan, setShowYeniPlan] = useState(false);
  const [yeniPlan, setYeniPlan] = useState({
    id_kursiyer: '',
    taksit_sayisi: '',
    toplam_tutar: '',
    baslangic_tarihi: new Date().toISOString().split('T')[0],
  });
  const [filterText, setFilterText] = useState('');
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadKursiyerler();
  }, []);

  useEffect(() => {
    if (kursiyerler.length > 0) {
      loadData();
    }
  }, [selectedKursiyer, kursiyerler.length]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = selectedKursiyer ? `?id_kursiyer=${selectedKursiyer}` : '';
      const response = await fetch(`${API_URL}/finans/odeme-plani${params}`);
      if (response.ok) {
        const data = await response.json();
        const plans = Array.isArray(data) ? data : [];
        
        // Kursiyer bilgilerini birleştir
        const plansWithKursiyer = await Promise.all(
          plans.map(async (plan: any) => {
            const kursiyer = kursiyerler.find((k) => k.id === plan.id_kursiyer);
            return {
              ...plan,
              kursiyer_adi: kursiyer?.adi,
              kursiyer_soyadi: kursiyer?.soyadi,
              kursiyer_tc: kursiyer?.tc_kimlik,
            };
          })
        );
        
        setOdemePlanlari(plansWithKursiyer);
      } else {
        setOdemePlanlari([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setOdemePlanlari([]);
    } finally {
      setLoading(false);
    }
  };

  const loadKursiyerler = async () => {
    try {
      const response = await fetch(`${API_URL}/kursiyer`);
      if (response.ok) {
        const data = await response.json();
        setKursiyerler(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading kursiyerler:', error);
    }
  };

  const handleYeniPlanOlustur = async () => {
    if (!yeniPlan.id_kursiyer || !yeniPlan.taksit_sayisi || !yeniPlan.toplam_tutar) {
      alert('Lütfen tüm alanları doldurunuz.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/finans/odeme-plani`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_kursiyer: parseInt(yeniPlan.id_kursiyer),
          taksit_sayisi: parseInt(yeniPlan.taksit_sayisi),
          toplam_tutar: parseFloat(yeniPlan.toplam_tutar),
          baslangic_tarihi: yeniPlan.baslangic_tarihi,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'İşlem başarısız' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      alert('Ödeme planı başarıyla oluşturuldu!');
      setShowYeniPlan(false);
      setYeniPlan({
        id_kursiyer: '',
        taksit_sayisi: '',
        toplam_tutar: '',
        baslangic_tarihi: new Date().toISOString().split('T')[0],
      });
      loadData();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    }
  };

  const handleOdemeIsaretle = async (id: number, taksitNo: number) => {
    if (!confirm(`${taksitNo}. taksiti ödendi olarak işaretlemek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/finans/odeme-plani/${id}/odeme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          odeme_tarihi: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('İşlem başarısız');
      }

      alert('Ödeme başarıyla işaretlendi!');
      loadData();
    } catch (error: any) {
      alert(`Hata: ${error.message}`);
    }
  };

  const filteredData = useMemo(() => {
    if (!filterText) return odemePlanlari;
    const search = filterText.toLowerCase();
    return odemePlanlari.filter(
      (plan) =>
        plan.kursiyer_adi?.toLowerCase().includes(search) ||
        plan.kursiyer_soyadi?.toLowerCase().includes(search) ||
        plan.kursiyer_tc?.includes(search)
    );
  }, [odemePlanlari, filterText]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ödeme Planı</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowYeniPlan(!showYeniPlan)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            {showYeniPlan ? 'İptal' : '+ Yeni Ödeme Planı'}
          </button>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Yenile
          </button>
        </div>
      </div>

      {showYeniPlan && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Yeni Ödeme Planı Oluştur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kursiyer</label>
              <select
                value={yeniPlan.id_kursiyer}
                onChange={(e) => setYeniPlan({ ...yeniPlan, id_kursiyer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">Kursiyer Seçiniz</option>
                {kursiyerler.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.adi} {k.soyadi} - {k.tc_kimlik}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taksit Sayısı</label>
              <input
                type="number"
                value={yeniPlan.taksit_sayisi}
                onChange={(e) => setYeniPlan({ ...yeniPlan, taksit_sayisi: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Örn: 6"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Tutar (₺)</label>
              <input
                type="number"
                step="0.01"
                value={yeniPlan.toplam_tutar}
                onChange={(e) => setYeniPlan({ ...yeniPlan, toplam_tutar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="0.00"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
              <input
                type="date"
                value={yeniPlan.baslangic_tarihi}
                onChange={(e) => setYeniPlan({ ...yeniPlan, baslangic_tarihi: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleYeniPlanOlustur}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Planı Oluştur
            </button>
            <button
              onClick={() => setShowYeniPlan(false)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-4 items-center">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Kursiyer adı, soyadı veya TC ile ara..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <select
          value={selectedKursiyer || ''}
          onChange={(e) => setSelectedKursiyer(e.target.value ? parseInt(e.target.value) : null)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option value="">Tüm Kursiyerler</option>
          {kursiyerler.map((k) => (
            <option key={k.id} value={k.id}>
              {k.adi} {k.soyadi}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursiyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TC Kimlik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taksit No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vade Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ödeme Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    Kayıt bulunamadı
                  </td>
                </tr>
              ) : (
                paginatedData.map((plan, index) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {plan.kursiyer_adi} {plan.kursiyer_soyadi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.kursiyer_tc || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.taksit_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {plan.tutar?.toFixed(2)} ₺
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plan.vade_tarihi ? new Date(plan.vade_tarihi).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plan.odeme_tarihi ? new Date(plan.odeme_tarihi).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          plan.odeme_durumu === 1
                            ? 'bg-green-100 text-green-800'
                            : new Date(plan.vade_tarihi) < new Date()
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {plan.odeme_durumu === 1 ? 'Ödendi' : new Date(plan.vade_tarihi) < new Date() ? 'Vadesi Geçti' : 'Beklemede'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {plan.odeme_durumu === 0 && (
                        <button
                          onClick={() => handleOdemeIsaretle(plan.id, plan.taksit_no)}
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
        </div>

        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Toplam {filteredData.length} kayıt</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value={10}>10</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            <span className="text-sm text-gray-700">
              Sayfa {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

