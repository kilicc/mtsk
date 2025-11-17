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
  | 'yedekleme'
  | 'cari-firma'
  | 'banka'
  | 'raporlar'
  | 'hizmet'
  | 'tanimlar';

interface TopMenuProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function TopMenu({ currentPage, onPageChange }: TopMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'kursiyer' as Page, label: 'Kursiyerler', color: 'bg-green-600 hover:bg-green-700' },
    { id: 'kursiyer-on-kayit' as Page, label: 'Ön Kayıt', color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'dogum-gunu' as Page, label: 'Doğum Günleri', color: 'bg-pink-600 hover:bg-pink-700' },
    { id: 'eksik-evrak' as Page, label: 'Eksik Evrak', color: 'bg-orange-600 hover:bg-orange-700' },
    { id: 'ders-programi' as Page, label: 'Ders Programı', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { id: 'kurumsal-ders-programi' as Page, label: 'Kurumsal Ders', color: 'bg-cyan-600 hover:bg-cyan-700' },
    { id: 'finans' as Page, label: 'Finans & Kasa', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { id: 'banka' as Page, label: 'Banka', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { id: 'cari-firma' as Page, label: 'Cari / Firma', color: 'bg-amber-600 hover:bg-amber-700' },
    { id: 'sms' as Page, label: 'SMS Servisi', color: 'bg-teal-600 hover:bg-teal-700' },
    { id: 'kullanici-mesajlari' as Page, label: 'Mesajlar', color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'arac-personel' as Page, label: 'Araç & Personel', color: 'bg-gray-600 hover:bg-gray-700' },
    { id: 'arac-yakit' as Page, label: 'Yakıt Takibi', color: 'bg-red-600 hover:bg-red-700' },
    { id: 'referans' as Page, label: 'Referanslar', color: 'bg-violet-600 hover:bg-violet-700' },
    { id: 'hizmet' as Page, label: 'Hizmet', color: 'bg-rose-600 hover:bg-rose-700' },
    { id: 'raporlar' as Page, label: 'Raporlar', color: 'bg-fuchsia-600 hover:bg-fuchsia-700' },
    { id: 'tanimlar' as Page, label: 'Tanımlar', color: 'bg-slate-600 hover:bg-slate-700' },
    { id: 'parametreler' as Page, label: 'Parametreler', color: 'bg-slate-500 hover:bg-slate-600' },
    { id: 'yedekleme' as Page, label: 'Yedekleme', color: 'bg-emerald-600 hover:bg-emerald-700' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
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

        {/* Desktop Menu - Single Row */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto pb-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 whitespace-nowrap ${
                currentPage === item.id
                  ? `${item.color} shadow-lg ring-2 ring-offset-2 ring-blue-300`
                  : `${item.color}`
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden flex flex-wrap gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium text-white transition-all ${
                  currentPage === item.id
                    ? `${item.color} shadow-md ring-2 ring-offset-1 ring-blue-300`
                    : `${item.color}`
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
