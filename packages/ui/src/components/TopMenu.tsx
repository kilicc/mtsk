import { useState } from 'react';

export type Page = 
  | 'dashboard'
  | 'kursiyer'
  | 'kursiyer-detail'
  | 'arac-detail'
  | 'personel-detail'
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

interface TopMenuProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function TopMenu({ currentPage, onPageChange }: TopMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: '📊', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { id: 'kursiyer' as Page, label: 'Kursiyerler', icon: '👥', color: 'bg-gradient-to-br from-green-500 to-green-600' },
    { id: 'kursiyer-on-kayit' as Page, label: 'Ön Kayıt', icon: '📝', color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
    { id: 'dogum-gunu' as Page, label: 'Doğum Günleri', icon: '🎂', color: 'bg-gradient-to-br from-pink-500 to-pink-600' },
    { id: 'eksik-evrak' as Page, label: 'Eksik Evrak', icon: '📄', color: 'bg-gradient-to-br from-orange-500 to-orange-600' },
    { id: 'ders-programi' as Page, label: 'Ders Programı', icon: '📅', color: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
    { id: 'kurumsal-ders-programi' as Page, label: 'Kurumsal Ders', icon: '🚗', color: 'bg-gradient-to-br from-cyan-500 to-cyan-600' },
    { id: 'finans' as Page, label: 'Finans & Kasa', icon: '💰', color: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
    { id: 'sms' as Page, label: 'SMS Servisi', icon: '💬', color: 'bg-gradient-to-br from-teal-500 to-teal-600' },
    { id: 'kullanici-mesajlari' as Page, label: 'Mesajlar', icon: '✉️', color: 'bg-gradient-to-br from-blue-400 to-blue-500' },
    { id: 'arac-personel' as Page, label: 'Araç & Personel', icon: '🚙', color: 'bg-gradient-to-br from-gray-600 to-gray-700' },
    { id: 'arac-yakit' as Page, label: 'Yakıt Takibi', icon: '⛽', color: 'bg-gradient-to-br from-red-500 to-red-600' },
    { id: 'referans' as Page, label: 'Referanslar', icon: '🔗', color: 'bg-gradient-to-br from-violet-500 to-violet-600' },
    { id: 'parametreler' as Page, label: 'Parametreler', icon: '⚙️', color: 'bg-gradient-to-br from-slate-600 to-slate-700' },
    { id: 'yedekleme' as Page, label: 'Yedekleme', icon: '💾', color: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-xl">🚗</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">MTSK</h1>
              <p className="text-xs text-gray-500">Motorlu Taşıtlar Sürücü Kursu</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Desktop Menu - Grid Layout */}
        <div className="hidden lg:grid grid-cols-5 xl:grid-cols-8 gap-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                currentPage === item.id
                  ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-105'
                  : 'hover:shadow-md'
              }`}
            >
              <div className={`${item.color} absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity`}></div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <span className="text-3xl">{item.icon}</span>
                <span className={`text-xs font-semibold text-center ${
                  currentPage === item.id ? 'text-white' : 'text-white'
                }`}>
                  {item.label}
                </span>
              </div>
              {currentPage === item.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
              )}
            </button>
          ))}
        </div>

        {/* Mobile Menu - Grid Layout */}
        {isMenuOpen && (
          <div className="lg:hidden grid grid-cols-2 gap-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMenuOpen(false);
                }}
                className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                  currentPage === item.id
                    ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg'
                    : ''
                }`}
              >
                <div className={`${item.color} absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-semibold text-center text-white">
                    {item.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
