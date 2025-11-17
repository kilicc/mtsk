import { useState } from 'react';

type Page = 
  | 'dashboard'
  | 'kursiyer'
  | 'kursiyer-on-kayit'
  | 'ders-programi'
  | 'kurumsal-ders-programi'
  | 'finans'
  | 'sms'
  | 'arac-personel'
  | 'arac-yakit'
  | 'referans'
  | 'dogum-gunu'
  | 'eksik-evrak'
  | 'kullanici-mesajlari'
  | 'parametreler'
  | 'yedekleme';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: '📊' },
    { id: 'kursiyer' as Page, label: 'Kursiyerler', icon: '👥' },
    { id: 'kursiyer-on-kayit' as Page, label: 'Ön Kayıt', icon: '📝' },
    { id: 'ders-programi' as Page, label: 'Ders Programı', icon: '📅' },
    { id: 'kurumsal-ders-programi' as Page, label: 'Kurumsal Ders', icon: '🚗' },
    { id: 'finans' as Page, label: 'Finans & Kasa', icon: '💰' },
    { id: 'sms' as Page, label: 'SMS Servisi', icon: '💬' },
    { id: 'arac-personel' as Page, label: 'Araç & Personel', icon: '🚙' },
    { id: 'arac-yakit' as Page, label: 'Yakıt Takibi', icon: '⛽' },
    { id: 'referans' as Page, label: 'Referanslar', icon: '🔗' },
    { id: 'dogum-gunu' as Page, label: 'Doğum Günleri', icon: '🎂' },
    { id: 'eksik-evrak' as Page, label: 'Eksik Evrak', icon: '📄' },
    { id: 'kullanici-mesajlari' as Page, label: 'Mesajlar', icon: '✉️' },
    { id: 'parametreler' as Page, label: 'Parametreler', icon: '⚙️' },
    { id: 'yedekleme' as Page, label: 'Yedekleme', icon: '💾' },
  ];

  return (
    <div className={`bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    } min-h-screen fixed left-0 top-0 z-40 shadow-2xl`}>
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-white">MTSK</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-blue-700 border-r-4 border-yellow-400 shadow-lg'
                : 'hover:bg-blue-700/50'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            {!isCollapsed && (
              <span className="font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-blue-700/50 rounded-lg p-3">
          {!isCollapsed && (
            <div className="text-sm">
              <div className="font-semibold">MTSK v1.0</div>
              <div className="text-blue-200 text-xs mt-1">Sürücü Kursu Yönetim</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

