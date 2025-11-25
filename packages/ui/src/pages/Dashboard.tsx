import { useState, useEffect } from 'react';
import { type Page } from '../components/TopMenu';

const API_URL = 'http://localhost:3001/api';

interface DashboardStats {
  toplamKursiyer: number;
  aktifKursiyer: number;
  bugunDogumGunu: number;
  eksikEvrak: number;
  yaklasanDersler: number;
  kalanSMS: number;
}

interface DashboardTile {
  id: string;
  label: string;
  icon: string;
  color: string;
  page?: Page;
  value?: string | number;
}

interface DashboardProps {
  onPageChange?: (page: Page) => void;
}

export default function Dashboard({ onPageChange }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    toplamKursiyer: 0,
    aktifKursiyer: 0,
    bugunDogumGunu: 0,
    eksikEvrak: 0,
    yaklasanDersler: 0,
    kalanSMS: 8610,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [kursiyerler] = await Promise.all([
        fetch(`${API_URL}/kursiyer`).then(r => r.json()).catch(() => []),
      ]);

      setStats({
        toplamKursiyer: kursiyerler?.length || 0,
        aktifKursiyer: kursiyerler?.filter((k: any) => k.akt === 1 || k.durum === 1)?.length || 0,
        bugunDogumGunu: 0,
        eksikEvrak: 0,
        yaklasanDersler: 0,
        kalanSMS: 8610,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Büyük kare butonlar - görüntülere göre renkler ve boyutlar
  const tiles: (DashboardTile & { span?: number })[] = [
    { id: 'yeni-kursiyer', label: 'YENİ KURSİYER KARTI', icon: '👤', color: 'bg-orange-500', page: 'kursiyer-on-kayit', span: 2 },
    { id: 'kurumsal-direksiyon', label: 'KURUMSAL DİREKSİYON DERS PROGRAMI', icon: '📅', color: 'bg-gray-600', page: 'kurumsal-ders-programi', span: 2 },
    { id: 'kasa', label: 'KASA İŞLEMLERİ', icon: '💰', color: 'bg-green-500', page: 'kasa-listesi' },
    { id: 'takvim', label: 'TAKVİM', icon: '📆', color: 'bg-amber-700', page: 'dashboard' },
    { id: 'kursiyer-ara', label: 'KURSİYER ARA', icon: '🔍', color: 'bg-blue-500', page: 'kursiyer' },
    { id: 'mebbis-aktarim', label: 'MEBBİS AKTARIM', icon: '📤', color: 'bg-amber-700', page: 'kursiyer-toplu-mebbis' },
    { id: 'teorik-ders', label: 'TEORİK DERS PROGRAMI', icon: '📚', color: 'bg-red-500', page: 'ders-programi-teorik' },
    { id: 'direksiyon-ders', label: 'DİREKSİYON DERS PROGRAMI', icon: '🚗', color: 'bg-blue-500', page: 'ders-programi-uygulama' },
    { id: 'toplu-sms', label: 'TOPLU SMS', icon: '📱', color: 'bg-orange-500', page: 'sms' },
    { id: 'kalan-sms', label: 'KALAN SMS', icon: '📱', color: 'bg-purple-500', value: stats.kalanSMS },
    { id: 'grup-donem', label: 'GRUP/DÖNEM KARTI', icon: '📁', color: 'bg-pink-500', page: 'tanimlar' },
    { id: 'subeler-arasi', label: 'ŞUBELER ARASI AKTARIM', icon: '🔄', color: 'bg-purple-300', page: 'kursiyer' },
    { id: 'e-sinav', label: 'E-SINAV LİSTESİ', icon: '💻', color: 'bg-blue-500', page: 'kursiyer-sinav-listesi' },
    { id: 'direksiyon-sinav', label: 'DİREKSİYON SINAV LİSTESİ', icon: '⏰', color: 'bg-orange-500', page: 'kursiyer-sinav-listesi' },
    { id: 'aktif-kursiyer', label: 'AKTİF KURSİYER', icon: '👥', color: 'bg-lime-400', value: stats.aktifKursiyer },
    { id: 'yedek-al', label: 'YEDEK AL', icon: '💾', color: 'bg-red-500', page: 'yedekleme' },
  ];

  const handleTileClick = (tile: DashboardTile) => {
    if (tile.page && onPageChange) {
      onPageChange(tile.page);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      {/* Ana İçerik Alanı */}
      <div className="flex h-full" style={{ paddingTop: '220px' }}>
        {/* Sol Panel - Başlık ve Logolar */}
        <div className="w-64 bg-gray-800 border-r-2 border-gray-700 p-4 flex flex-col items-center justify-start overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
          <div className="text-center mb-3">
            <h1 className="text-xl font-bold mb-1 text-white">SÜRÜCÜ KURSU</h1>
            <h2 className="text-sm font-semibold text-gray-300">Otomasyonu</h2>
          </div>
          
          {/* Milli Eğitim Bakanlığı Logosu */}
          <div className="mb-3 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-gray-300">
              <div className="text-center">
                <div className="text-sm font-bold text-gray-800 mb-0.5">T.C.</div>
                <div className="text-[8px] font-semibold text-gray-800">MİLLÎ EĞİTİM</div>
                <div className="text-[8px] font-semibold text-gray-800">BAKANLIĞI</div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="mt-auto">
            <div className="text-center text-gray-400 text-[10px]">
              <div className="font-semibold mb-0.5">MTSK</div>
              <div className="text-[8px]">Otomasyon Sistemi</div>
            </div>
          </div>
        </div>

        {/* Sağ Panel - Dashboard Tiles */}
        <div className="flex-1 bg-black overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
          <div className="grid grid-cols-4 gap-1.5 p-2 h-full overflow-hidden">
            {tiles.map((tile) => {
              const span = tile.span || 1;
              return (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile)}
                  className={`${tile.color} rounded-lg p-2 text-white shadow-xl transform transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl flex flex-col items-start justify-between relative border-0 hover:brightness-110`}
                  style={{ 
                    gridColumn: `span ${span}`,
                    gridRow: span === 2 ? 'span 2' : 'span 1',
                    height: '100%',
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
                  }}
                >
                  {/* Metin - Üstte */}
                  <div className="text-left w-full">
                    <div className="text-[9px] font-bold leading-tight uppercase">{tile.label}</div>
                  </div>
                  
                  {/* İkon veya Değer - Altta */}
                  <div className="w-full flex items-end justify-center mt-auto">
                    {tile.value !== undefined ? (
                      <div className="text-2xl font-extrabold">{tile.value}</div>
                    ) : (
                      <div className="text-3xl opacity-90">{tile.icon}</div>
                    )}
                  </div>
                  
                  {/* Hover efekti için overlay */}
                  <div className="absolute inset-0 bg-white/0 hover:bg-white/10 rounded-lg transition-all duration-200"></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
