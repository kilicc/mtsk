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
    <div className="min-h-screen bg-gray-50">
      <TopMenu currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="max-w-full">
        <header className="bg-white border-b border-gray-200 sticky top-[140px] z-30 shadow-sm">
          <div className="px-6 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
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
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                apiConnected 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {apiConnected ? 'Bağlı' : 'Bağlantı Hatası'}
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen bg-gray-50">
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
