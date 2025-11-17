import { useState, useEffect } from 'react';
import TopMenu, { type Page } from './components/TopMenu';
import Dashboard from './pages/Dashboard';
import KursiyerList from './pages/KursiyerList';
import KursiyerDetail from './pages/KursiyerDetail';
import AracDetail from './pages/AracDetail';
import PersonelDetail from './pages/PersonelDetail';
import DersProgrami from './pages/DersProgrami';
import KurumsalDersProgrami from './pages/KurumsalDersProgrami';
import Finans from './pages/Finans';
import SMS from './pages/SMS';
import AracPersonel from './pages/AracPersonel';
import AracYakit from './pages/AracYakit';
import KursiyerOnKayit from './pages/KursiyerOnKayit';
import Referans from './pages/Referans';
import DogumGunu from './pages/DogumGunu';
import EksikEvrak from './pages/EksikEvrak';
import KullaniciMesajlari from './pages/KullaniciMesajlari';
import Parametreler from './pages/Parametreler';
import Yedekleme from './pages/Yedekleme';

function App() {
  const [apiConnected, setApiConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedKursiyerId, setSelectedKursiyerId] = useState<number | null>(null);
  const [selectedAracId, setSelectedAracId] = useState<number | null>(null);
  const [selectedPersonelId, setSelectedPersonelId] = useState<number | null>(null);

  useEffect(() => {
    // Check API health
    fetch('http://localhost:3001/health')
      .then(() => setApiConnected(true))
      .catch(() => setApiConnected(false));
    
    // Check every 30 seconds
    const interval = setInterval(() => {
      fetch('http://localhost:3001/health')
        .then(() => setApiConnected(true))
        .catch(() => setApiConnected(false));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopMenu currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="max-w-full">
        <header className="bg-white shadow-sm border-b sticky top-16 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {currentPage === 'dashboard' && '📊 Dashboard'}
                {currentPage === 'kursiyer' && '👥 Kursiyer Yönetimi'}
                {currentPage === 'kursiyer-detail' && '👤 Kursiyer Detay'}
                {currentPage === 'arac-detail' && '🚗 Araç Detay'}
                {currentPage === 'personel-detail' && '👔 Personel Detay'}
                {currentPage === 'kursiyer-on-kayit' && '📝 Ön Kayıt'}
                {currentPage === 'ders-programi' && '📅 Ders Programı'}
                {currentPage === 'kurumsal-ders-programi' && '🚗 Kurumsal Ders Programı'}
                {currentPage === 'finans' && '💰 Finans & Kasa'}
                {currentPage === 'sms' && '💬 SMS Servisi'}
                {currentPage === 'arac-personel' && '🚙 Araç & Personel'}
                {currentPage === 'arac-yakit' && '⛽ Yakıt Takibi'}
                {currentPage === 'referans' && '🔗 Referans İşlemleri'}
                {currentPage === 'dogum-gunu' && '🎂 Doğum Günü Takibi'}
                {currentPage === 'eksik-evrak' && '📄 Eksik Evrak Takibi'}
                {currentPage === 'kullanici-mesajlari' && '✉️ Kullanıcı Mesajları'}
                {currentPage === 'parametreler' && '⚙️ Parametreler'}
                {currentPage === 'yedekleme' && '💾 Yedekleme'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 text-sm rounded-full font-medium shadow-sm ${
                apiConnected 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {apiConnected ? '✅ API Bağlı' : '❌ API Bağlantı Hatası'}
              </span>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'kursiyer' && (
            <KursiyerList 
              onDetailClick={(id) => {
                setSelectedKursiyerId(id);
                setCurrentPage('kursiyer-detail');
              }}
            />
          )}
          {currentPage === 'kursiyer-detail' && selectedKursiyerId && (
            <KursiyerDetail 
              id={selectedKursiyerId.toString()}
              onBack={() => setCurrentPage('kursiyer')}
            />
          )}
          {currentPage === 'kursiyer-on-kayit' && <KursiyerOnKayit />}
          {currentPage === 'ders-programi' && <DersProgrami />}
          {currentPage === 'kurumsal-ders-programi' && <KurumsalDersProgrami />}
          {currentPage === 'finans' && <Finans />}
          {currentPage === 'sms' && <SMS />}
          {currentPage === 'arac-personel' && (
            <AracPersonel
              onAracDetailClick={(id) => {
                setSelectedAracId(id);
                setCurrentPage('arac-detail');
              }}
              onPersonelDetailClick={(id) => {
                setSelectedPersonelId(id);
                setCurrentPage('personel-detail');
              }}
            />
          )}
          {currentPage === 'arac-detail' && selectedAracId && (
            <AracDetail
              id={selectedAracId.toString()}
              onBack={() => setCurrentPage('arac-personel')}
            />
          )}
          {currentPage === 'personel-detail' && selectedPersonelId && (
            <PersonelDetail
              id={selectedPersonelId.toString()}
              onBack={() => setCurrentPage('arac-personel')}
            />
          )}
          {currentPage === 'arac-yakit' && <AracYakit />}
          {currentPage === 'referans' && <Referans />}
          {currentPage === 'dogum-gunu' && <DogumGunu />}
          {currentPage === 'eksik-evrak' && <EksikEvrak />}
          {currentPage === 'kullanici-mesajlari' && <KullaniciMesajlari />}
          {currentPage === 'parametreler' && <Parametreler />}
          {currentPage === 'yedekleme' && <Yedekleme />}
        </main>
      </div>
    </div>
  );
}

export default App;
