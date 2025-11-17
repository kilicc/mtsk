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

  const menuGroups = [
    {
      label: 'Ana Sayfa',
      items: [
        { id: 'dashboard' as Page, label: 'Dashboard', icon: '📊' },
      ],
    },
    {
      label: 'Kursiyer İşlemleri',
      items: [
        { id: 'kursiyer' as Page, label: 'Kursiyerler', icon: '👥' },
        { id: 'kursiyer-on-kayit' as Page, label: 'Ön Kayıt', icon: '📝' },
        { id: 'dogum-gunu' as Page, label: 'Doğum Günleri', icon: '🎂' },
        { id: 'eksik-evrak' as Page, label: 'Eksik Evrak', icon: '📄' },
      ],
    },
    {
      label: 'Ders & Program',
      items: [
        { id: 'ders-programi' as Page, label: 'Ders Programı', icon: '📅' },
        { id: 'kurumsal-ders-programi' as Page, label: 'Kurumsal Ders', icon: '🚗' },
      ],
    },
    {
      label: 'Finans & Kasa',
      items: [
        { id: 'finans' as Page, label: 'Finans & Kasa', icon: '💰' },
      ],
    },
    {
      label: 'SMS & İletişim',
      items: [
        { id: 'sms' as Page, label: 'SMS Servisi', icon: '💬' },
        { id: 'kullanici-mesajlari' as Page, label: 'Mesajlar', icon: '✉️' },
      ],
    },
    {
      label: 'Araç & Personel',
      items: [
        { id: 'arac-personel' as Page, label: 'Araç & Personel', icon: '🚙' },
        { id: 'arac-yakit' as Page, label: 'Yakıt Takibi', icon: '⛽' },
      ],
    },
    {
      label: 'Diğer',
      items: [
        { id: 'referans' as Page, label: 'Referanslar', icon: '🔗' },
        { id: 'parametreler' as Page, label: 'Parametreler', icon: '⚙️' },
        { id: 'yedekleme' as Page, label: 'Yedekleme', icon: '💾' },
      ],
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚗</span>
              <span className="text-xl font-bold">MTSK</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-1">
              {menuGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="relative group">
                  <button className="px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                    <span>{group.label}</span>
                    <span className="text-xs">▼</span>
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => onPageChange(item.id)}
                          className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition-colors ${
                            currentPage === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-800'
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-blue-700"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-blue-800 border-t border-blue-700">
          <div className="px-4 py-2 space-y-1">
            {menuGroups.map((group) => (
              <div key={group.label} className="mb-4">
                <div className="text-blue-200 text-sm font-semibold mb-2 px-2">{group.label}</div>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${
                      currentPage === item.id
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-700'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

