import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

interface DashboardStats {
  toplamKursiyer: number;
  aktifKursiyer: number;
  bugunDogumGunu: number;
  eksikEvrak: number;
  yaklasanDersler: number;
  toplamArac: number;
  toplamPersonel: number;
  sonYedekleme?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    toplamKursiyer: 0,
    aktifKursiyer: 0,
    bugunDogumGunu: 0,
    eksikEvrak: 0,
    yaklasanDersler: 0,
    toplamArac: 0,
    toplamPersonel: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Parallel API calls
      const [kursiyerler, dogumGunu, eksikEvrak, yaklasanDersler, araclar, personel] = await Promise.all([
        fetch(`${API_URL}/kursiyer`).then(r => r.json()),
        fetch(`${API_URL}/dogum-gunu/bugun`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/eksik-evrak/rapor`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/kurumsal-ders-programi/yaklasan?days=7`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/arac-personel/arac`).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/arac-personel/personel`).then(r => r.json()).catch(() => []),
      ]);

      setStats({
        toplamKursiyer: kursiyerler?.length || 0,
        aktifKursiyer: kursiyerler?.filter((k: any) => k.akt === 1)?.length || 0,
        bugunDogumGunu: dogumGunu?.length || 0,
        eksikEvrak: eksikEvrak?.length || 0,
        yaklasanDersler: yaklasanDersler?.length || 0,
        toplamArac: araclar?.length || 0,
        toplamPersonel: personel?.length || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Toplam Kursiyer', value: stats.toplamKursiyer, icon: '👥', color: 'bg-blue-500' },
    { label: 'Aktif Kursiyer', value: stats.aktifKursiyer, icon: '✅', color: 'bg-green-500' },
    { label: 'Bugün Doğum Günü', value: stats.bugunDogumGunu, icon: '🎂', color: 'bg-pink-500' },
    { label: 'Eksik Evrak', value: stats.eksikEvrak, icon: '📄', color: 'bg-orange-500' },
    { label: 'Yaklaşan Dersler', value: stats.yaklasanDersler, icon: '📅', color: 'bg-purple-500' },
    { label: 'Toplam Araç', value: stats.toplamArac, icon: '🚗', color: 'bg-indigo-500' },
    { label: 'Toplam Personel', value: stats.toplamPersonel, icon: '👔', color: 'bg-teal-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Sistem özet bilgileri ve istatistikler</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className={`${card.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Hızlı İşlemler</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Yeni Kursiyer Ekle
            </button>
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Ön Kayıt Ekle
            </button>
            <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
              SMS Gönder
            </button>
            <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium">
              Yedekleme Yap
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Son Aktiviteler</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">👥</div>
              <div>
                <p className="font-medium text-gray-800">Yeni kursiyer eklendi</p>
                <p className="text-sm text-gray-500">2 saat önce</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">💬</div>
              <div>
                <p className="font-medium text-gray-800">SMS gönderildi</p>
                <p className="text-sm text-gray-500">5 saat önce</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">📅</div>
              <div>
                <p className="font-medium text-gray-800">Ders programı güncellendi</p>
                <p className="text-sm text-gray-500">1 gün önce</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

