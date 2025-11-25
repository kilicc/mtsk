
export type Page = 
  | 'dashboard'
  | 'kursiyer'
  | 'kursiyer-detail'
  | 'kursiyer-yeni-kayit'
  | 'kursiyer-sinav-listesi'
  | 'kursiyer-sinav-islemleri'
  | 'kursiyer-sinav-not-girisi'
  | 'kursiyer-toplu-mebbis'
  | 'kursiyer-bakiye-raporu'
  | 'kursiyer-detayli-bakiye-raporu'
  | 'kursiyer-fatura-listesi'
  | 'kursiyer-e-kursiyer-listesi'
  | 'kursiyer-e-kursiyer-analiz'
  | 'kursiyer-istatistik'
  | 'kursiyer-donem-istatistik'
  | 'kursiyer-gorusme-listesi'
  | 'kursiyer-evrak-listesi'
  | 'kursiyer-fotograf-karsilastirma'
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
  | 'tanimlar'
  | 'kasa-listesi'
  | 'kasa-toplamlari'
  | 'kasa-para-giris-cikis'
  | 'kasa-hareketleri'
  | 'kasa-transfer'
  | 'kasa-yeni-kayit'
  | 'odeme-plani'
  | 'tahsilat'
  | 'borc-sms'
  | 'sanal-pos-tahsilat'
  | 'ders-programi-teorik'
  | 'ders-programi-uygulama'
  | 'ders-programi-listesi'
  | 'ders-programi-analizi'
  | 'kurumsal-ders-listesi'
  | 'sms-sablonlari'
  | 'sms-raporlari'
  | 'personel-yeni-kayit'
  | 'arac-yeni-kayit'
  | 'donem-sube-tanimlama'
  | 'sinav-tarihi-tanimlama';

import { useState, useEffect } from 'react';
import { useSube } from '../contexts/SubeContext';

interface TopMenuProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function TopMenu({ currentPage, onPageChange }: TopMenuProps) {
  const [selectedMainTab, setSelectedMainTab] = useState<Page | null>(null);
  const { aktifSube, kullaniciSubeleri, setAktifSube } = useSube();
  const [showSubeMenu, setShowSubeMenu] = useState(false);

  // Ana menü tab'ları
  const mainTabs = [
    { id: 'dashboard' as Page, label: 'ANA MENÜ' },
    { id: 'kursiyer-toplu-mebbis' as Page, label: 'MEBBİS' },
    { id: 'kursiyer' as Page, label: 'KURSİYER/GRUP' },
    { id: 'ders-programi' as Page, label: 'DERS PROGRAMI' },
    { id: 'kursiyer-sinav-listesi' as Page, label: 'SINAV' },
    { id: 'finans' as Page, label: 'FİNANS' },
    { id: 'arac-personel' as Page, label: 'TAKİP/SMS/PERSONEL' },
    { id: 'raporlar' as Page, label: 'RAPORLAR' },
    { id: 'parametreler' as Page, label: 'PARAMETRELER' },
    { id: 'yedekleme' as Page, label: 'YARDIM' },
  ];

  // Ana tab'a göre alt menüler
  const getSubMenuItems = (mainTabId: Page) => {
    switch (mainTabId) {
      case 'dashboard':
        return [
          { id: 'dashboard' as Page, label: 'Ana Sayfa', icon: '🏠' },
        ];
      case 'kursiyer-toplu-mebbis':
        return [
          { id: 'kursiyer-toplu-mebbis' as Page, label: 'Toplu MEBBİS', icon: '📤' },
        ];
      case 'kursiyer':
        return [
          { id: 'kursiyer-yeni-kayit' as Page, label: 'Kursiyer Yeni Kayıt', icon: '➕' },
          { id: 'kursiyer' as Page, label: 'Kursiyer Listesi', icon: '📋' },
          { id: 'kursiyer-on-kayit' as Page, label: 'Ön Kayıt İşlemleri', icon: '📝' },
          { id: 'kursiyer-bakiye-raporu' as Page, label: 'Bakiye Raporu', icon: '💰' },
          { id: 'kursiyer-fatura-listesi' as Page, label: 'Fatura Listesi', icon: '🧾' },
          { id: 'kursiyer-istatistik' as Page, label: 'İstatistik', icon: '📈' },
          { id: 'eksik-evrak' as Page, label: 'Eksik Evrak', icon: '📄' },
        ];
      case 'ders-programi':
        return [
          { id: 'ders-programi-teorik' as Page, label: 'Teorik Ders Programı', icon: '📚' },
          { id: 'ders-programi-uygulama' as Page, label: 'Direksiyon Programı', icon: '🚗' },
          { id: 'kurumsal-ders-programi' as Page, label: 'Kurumsal Direksiyon', icon: '🏢' },
          { id: 'ders-programi-listesi' as Page, label: 'Ders Programı Listesi', icon: '📋' },
          { id: 'ders-programi-analizi' as Page, label: 'Ders Programı Analizi', icon: '📊' },
        ];
      case 'kursiyer-sinav-listesi':
        return [
          { id: 'kursiyer-sinav-listesi' as Page, label: 'E-Sınav Listesi', icon: '💻' },
          { id: 'kursiyer-sinav-islemleri' as Page, label: 'Sınav İşlemleri', icon: '⚙️' },
          { id: 'kursiyer-sinav-not-girisi' as Page, label: 'Sınav Not Girişi', icon: '✏️' },
        ];
      case 'finans':
        return [
          { id: 'kasa-listesi' as Page, label: 'Kasa Listesi', icon: '💰' },
          { id: 'kasa-yeni-kayit' as Page, label: 'Kasa Yeni Kayıt', icon: '➕' },
          { id: 'kasa-toplamlari' as Page, label: 'Kasa Toplamları', icon: '📊' },
          { id: 'kasa-para-giris-cikis' as Page, label: 'Para Giriş/Çıkış', icon: '💵' },
          { id: 'kasa-hareketleri' as Page, label: 'Kasa Hareketleri', icon: '📋' },
          { id: 'kasa-transfer' as Page, label: 'Kasalar Arası Transfer', icon: '🔄' },
          { id: 'odeme-plani' as Page, label: 'Ödeme Planı', icon: '📅' },
          { id: 'tahsilat' as Page, label: 'Tahsilat', icon: '💳' },
          { id: 'borc-sms' as Page, label: 'Borç SMS', icon: '📱' },
          { id: 'sanal-pos-tahsilat' as Page, label: 'Sanal Pos Tahsilat', icon: '💳' },
        ];
      case 'arac-personel':
        return [
          { id: 'arac-personel' as Page, label: 'Araç & Personel', icon: '🚗' },
          { id: 'arac-yeni-kayit' as Page, label: 'Araç Yeni Kayıt', icon: '➕' },
          { id: 'personel-yeni-kayit' as Page, label: 'Personel Yeni Kayıt', icon: '👤' },
          { id: 'arac-yakit' as Page, label: 'Yakıt Takibi', icon: '⛽' },
          { id: 'sms' as Page, label: 'SMS Servisi', icon: '📱' },
          { id: 'sms-sablonlari' as Page, label: 'SMS Şablonları', icon: '📝' },
          { id: 'sms-raporlari' as Page, label: 'SMS Raporları', icon: '📊' },
        ];
      case 'raporlar':
        return [
          { id: 'raporlar' as Page, label: 'Raporlar', icon: '📊' },
          { id: 'kursiyer-istatistik' as Page, label: 'Kursiyer İstatistik', icon: '📈' },
          { id: 'kursiyer-bakiye-raporu' as Page, label: 'Bakiye Raporu', icon: '💰' },
        ];
      case 'parametreler':
        return [
          { id: 'parametreler' as Page, label: 'Parametreler', icon: '⚙️' },
          { id: 'tanimlar' as Page, label: 'Tanımlar', icon: '📁' },
          { id: 'donem-sube-tanimlama' as Page, label: 'Dönem Şube Tanımlama', icon: '📅' },
          { id: 'sinav-tarihi-tanimlama' as Page, label: 'Sınav Tarihi Tanımlama', icon: '📆' },
        ];
      case 'yedekleme':
        return [
          { id: 'yedekleme' as Page, label: 'Yedekleme', icon: '💾' },
        ];
      default:
        return [];
    }
  };

  // Aktif ana tab'ı belirle - daha spesifik kontrol
  useEffect(() => {
    let activeTab: Page | null = null;
    
    // Önce spesifik eşleşmeleri kontrol et
    if (currentPage === 'dashboard') {
      activeTab = 'dashboard';
    } else if (currentPage === 'kursiyer-toplu-mebbis') {
      activeTab = 'kursiyer-toplu-mebbis';
    } else if (currentPage === 'yedekleme') {
      activeTab = 'yedekleme';
    } else if (currentPage === 'raporlar') {
      activeTab = 'raporlar';
    } else if (currentPage === 'parametreler' || currentPage === 'tanimlar' || currentPage === 'donem-sube-tanimlama' || currentPage === 'sinav-tarihi-tanimlama') {
      activeTab = 'parametreler';
    } else if (currentPage.startsWith('kursiyer-sinav')) {
      // Sınav sayfaları öncelikli olarak SINAV tab'ına ait
      activeTab = 'kursiyer-sinav-listesi';
    } else if (currentPage.startsWith('ders-programi') || currentPage === 'kurumsal-ders-programi' || currentPage === 'kurumsal-ders-listesi') {
      activeTab = 'ders-programi';
    } else if (currentPage.startsWith('kasa') || currentPage.startsWith('odeme') || currentPage.startsWith('tahsilat') || currentPage.startsWith('borc') || currentPage.startsWith('sanal-pos') || currentPage === 'finans') {
      activeTab = 'finans';
    } else if (currentPage.startsWith('arac') || currentPage.startsWith('personel') || currentPage.startsWith('sms')) {
      activeTab = 'arac-personel';
    } else if (currentPage.startsWith('kursiyer')) {
      // Kursiyer sayfaları (sınav ve mebbis hariç)
      activeTab = 'kursiyer';
    } else {
      // Varsayılan olarak dashboard
      activeTab = 'dashboard';
    }
    
    setSelectedMainTab(activeTab);
  }, [currentPage]);

  const handleMainTabClick = (tabId: Page) => {
    setSelectedMainTab(tabId);
    onPageChange(tabId);
  };

  const subMenuItems = selectedMainTab ? getSubMenuItems(selectedMainTab) : [];

  return (
    <nav className="bg-gray-800 text-white fixed top-0 left-0 right-0 z-[100] shadow-xl border-b-2 border-gray-600">
      {/* Üst Bar - Aktif Kurs Bilgisi */}
      <div className="bg-gray-700 px-3 py-1 text-xs border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">SÜRÜCÜ KURSU</span>
            {kullaniciSubeleri.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowSubeMenu(!showSubeMenu)}
                  className="text-gray-200 hover:text-white transition-colors cursor-pointer border border-gray-500 px-2 py-0.5 rounded hover:bg-gray-600 hover:border-gray-400 text-xs font-medium"
                >
                  Şubeler Arası Geçiş ▼
                </button>
                {showSubeMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-gray-800 border-2 border-gray-600 rounded shadow-xl z-50 min-w-[250px]">
                    {kullaniciSubeleri.map((sube) => (
                      <button
                        key={sube.id}
                        onClick={() => {
                          setAktifSube({
                            id: sube.id,
                            adi: sube.adi,
                            kodu: sube.kodu,
                          });
                          setShowSubeMenu(false);
                          // Sayfayı yenile (şube değiştiği için)
                          window.location.reload();
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors border-b border-gray-700 ${
                          aktifSube?.id === sube.id ? 'bg-gray-700 font-semibold border-l-4 border-l-blue-500' : ''
                        }`}
                      >
                        <div className="text-white">{sube.adi}</div>
                        {sube.kodu && (
                          <div className="text-xs text-gray-400">Kod: {sube.kodu}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="bg-green-600 px-3 py-1 rounded border border-green-500 shadow-sm">
            <span className="font-bold text-white text-xs">
              AKTİF KURS: {aktifSube ? aktifSube.adi : 'Şube Seçilmedi'}
            </span>
          </div>
        </div>
      </div>

      {/* Ana Tab Menüsü */}
      <div className="bg-gray-800 px-3 py-1.5 border-b border-gray-600">
        <div className="flex items-center gap-1 overflow-x-auto">
          {mainTabs.map((tab) => {
            const isActive = selectedMainTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleMainTabClick(tab.id)}
                className={`px-4 py-1.5 rounded-t-lg font-bold text-xs whitespace-nowrap transition-all duration-200 border-b-2 ${
                  isActive
                    ? 'bg-gray-700 text-white border-blue-500 shadow-md'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-transparent hover:border-gray-500'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alt Menü - Seçili Ana Tab'a Göre Dinamik */}
      {selectedMainTab && subMenuItems.length > 0 && (
        <div className="bg-gray-700 px-3 py-2 border-b border-gray-600">
          <div className="flex items-center gap-1 overflow-x-auto">
            {subMenuItems.map((item, index) => (
              <button
                key={`${selectedMainTab}-${item.id}-${index}`}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-600 transition-all duration-200 min-w-[75px] border ${
                  currentPage === item.id 
                    ? 'bg-gray-600 border-blue-400 shadow-md' 
                    : 'bg-gray-800 border-gray-500 hover:border-gray-400 hover:shadow-sm'
                }`}
                title={item.label}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] text-center leading-tight font-semibold">{item.label}</span>
              </button>
            ))}
            
            {/* Utility Butonlar */}
            <div className="flex-shrink-0 ml-auto flex items-center gap-1.5">
              <button className="p-1.5 rounded-lg border border-gray-500 hover:border-gray-400 hover:bg-gray-600 transition-all duration-200 bg-gray-800 shadow-sm" title="ANYDESK">
                <span className="text-lg">🔴</span>
              </button>
              <button className="p-1.5 rounded-lg border border-gray-500 hover:border-gray-400 hover:bg-gray-600 transition-all duration-200 bg-gray-800 shadow-sm" title="Kapat">
                <span className="text-lg">✕</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alt Bar - Hızlı Erişim */}
      <div className="bg-gray-100 px-3 py-1 border-t border-gray-300">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onPageChange('kursiyer-toplu-mebbis')}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            MEBBİS
          </button>
          <button 
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            KURS WEB
          </button>
          <button 
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            GÜNLÜK AJANDA
          </button>
          <button 
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            GEÇERLİLİK KONTROL
          </button>
          <button 
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-200 transition-colors text-gray-700 text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            SINAV SORULARI
          </button>
          <button 
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition-colors text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            İSTATİSTİK
          </button>
        </div>
      </div>
    </nav>
  );
}
