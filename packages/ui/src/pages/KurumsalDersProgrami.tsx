import { useState, useEffect } from 'react';
import type { KurumsalDersProgrami, KurumsalDersRaporu } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function KurumsalDersProgrami() {
  const [dersler, setDersler] = useState<KurumsalDersProgrami[]>([]);
  const [raporlar, setRaporlar] = useState<KurumsalDersRaporu[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'rapor' | 'yaklasan'>('list');
  const [kursiyerler, setKursiyerler] = useState<any[]>([]);
  const [personeller, setPersoneller] = useState<any[]>([]);
  const [araclar, setAraclar] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<KurumsalDersProgrami>>({
    id_kursiyer: undefined,
    id_personel: undefined,
    id_arac: undefined,
    tarih: new Date().toISOString().split('T')[0],
    saat: 1,
    durum: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dersResponse, raporResponse, kursiyerResponse, personelResponse, aracResponse] = await Promise.all([
        fetch(`${API_URL}/kurumsal-ders-programi`).then(r => r.json()),
        fetch(`${API_URL}/kurumsal-ders-programi/rapor/tum`).then(r => r.json()),
        fetch(`${API_URL}/kursiyer`).then(r => r.json()),
        fetch(`${API_URL}/arac-personel/personel`).then(r => r.json()),
        fetch(`${API_URL}/arac-personel/arac`).then(r => r.json()),
      ]);
      setDersler(dersResponse);
      setRaporlar(raporResponse);
      setKursiyerler(kursiyerResponse);
      setPersoneller(personelResponse);
      setAraclar(aracResponse);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id
        ? `${API_URL}/kurumsal-ders-programi/${formData.id}`
        : `${API_URL}/kurumsal-ders-programi`;
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      setIsModalOpen(false);
      setFormData({
        id_kursiyer: undefined,
        id_personel: undefined,
        id_arac: undefined,
        tarih: new Date().toISOString().split('T')[0],
        saat: 1,
        durum: 0,
      });
      await loadData();
    } catch (error) {
      console.error('Error saving ders:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const yaklasanDersler = dersler.filter((d) => {
    const tarih = new Date(d.tarih);
    const bugun = new Date();
    const fark = (tarih.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24);
    return fark >= 0 && fark <= 7 && (d.durum === 0 || d.durum === undefined);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🚗 Kurumsal Ders Programı</h1>
          <p className="text-gray-600">Gerçek direksiyon eğitimleri takibi</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              id_kursiyer: undefined,
              id_personel: undefined,
              id_arac: undefined,
              tarih: new Date().toISOString().split('T')[0],
              saat: 1,
              durum: 0,
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
        >
          + Yeni Ders Ekle
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'list'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Tüm Dersler
        </button>
        <button
          onClick={() => setActiveTab('yaklasan')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'yaklasan'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Yaklaşan Dersler ({yaklasanDersler.length})
        </button>
        <button
          onClick={() => setActiveTab('rapor')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'rapor'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Raporlar
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursiyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eğitmen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Araç</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dersler.map((ders) => (
                  <tr key={ders.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {kursiyerler.find(k => k.id === ders.id_kursiyer)?.adi || 'N/A'}{' '}
                      {kursiyerler.find(k => k.id === ders.id_kursiyer)?.soyadi || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {personeller.find(p => p.id === ders.id_personel)?.adi || 'N/A'}{' '}
                      {personeller.find(p => p.id === ders.id_personel)?.soyadi || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {araclar.find(a => a.id === ders.id_arac)?.plaka || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(ders.tarih).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{ders.saat} saat</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ders.durum === 1
                            ? 'bg-green-100 text-green-800'
                            : ders.durum === 2
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {ders.durum === 1 ? 'Tamamlandı' : ders.durum === 2 ? 'İptal' : 'Planlandı'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'yaklasan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {yaklasanDersler.map((ders) => (
            <div
              key={ders.id}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border-2 border-blue-200"
            >
              <h3 className="font-bold text-gray-800 mb-2">
                {kursiyerler.find(k => k.id === ders.id_kursiyer)?.adi}{' '}
                {kursiyerler.find(k => k.id === ders.id_kursiyer)?.soyadi}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📅 {new Date(ders.tarih).toLocaleDateString('tr-TR')}</p>
                <p>👨‍🏫 {personeller.find(p => p.id === ders.id_personel)?.adi}</p>
                <p>🚗 {araclar.find(a => a.id === ders.id_arac)?.plaka}</p>
                <p>⏰ {ders.saat} saat</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rapor' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursiyer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Ders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamamlanan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Saat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Son Ders</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {raporlar.map((rapor) => (
                  <tr key={rapor.id_kursiyer} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {rapor.kursiyer_adi} {rapor.kursiyer_soyadi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{rapor.toplam_ders_sayisi}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                        {rapor.tamamlanan_ders_sayisi}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{rapor.toplam_ders_saati} saat</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {rapor.son_ders_tarihi
                        ? new Date(rapor.son_ders_tarihi).toLocaleDateString('tr-TR')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Yeni Ders Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kursiyer</label>
                <select
                  value={formData.id_kursiyer || ''}
                  onChange={(e) => setFormData({ ...formData, id_kursiyer: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Seçiniz</option>
                  {kursiyerler.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.adi} {k.soyadi}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Eğitmen</label>
                <select
                  value={formData.id_personel || ''}
                  onChange={(e) => setFormData({ ...formData, id_personel: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Seçiniz</option>
                  {personeller.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.adi} {p.soyadi}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Araç</label>
                <select
                  value={formData.id_arac || ''}
                  onChange={(e) => setFormData({ ...formData, id_arac: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Seçiniz</option>
                  {araclar.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.plaka || 'Araç #' + a.id}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                  <input
                    type="date"
                    value={typeof formData.tarih === 'string' ? formData.tarih : ''}
                    onChange={(e) => setFormData({ ...formData, tarih: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
                  <input
                    type="number"
                    value={formData.saat || ''}
                    onChange={(e) => setFormData({ ...formData, saat: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

