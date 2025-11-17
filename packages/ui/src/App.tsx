import { useState, useEffect } from 'react';
import KursiyerList from './pages/KursiyerList';
import DersProgrami from './pages/DersProgrami';
import Finans from './pages/Finans';
import SMS from './pages/SMS';
import AracPersonel from './pages/AracPersonel';
import KursiyerOnKayit from './pages/KursiyerOnKayit';

type Page = 'kursiyer' | 'ders-programi' | 'finans' | 'sms' | 'arac-personel' | 'kursiyer-on-kayit';

function App() {
  const [apiConnected, setApiConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('kursiyer');

  useEffect(() => {
    // Check API health
    fetch('http://localhost:3001/health')
      .then(() => setApiConnected(true))
      .catch(() => setApiConnected(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">MTSK - Motorlu Taşıtlar Sürücü Kursu</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage('kursiyer')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    currentPage === 'kursiyer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Kursiyer
                </button>
                <button
                  onClick={() => setCurrentPage('ders-programi')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    currentPage === 'ders-programi'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Ders Programı
                </button>
                <button
                  onClick={() => setCurrentPage('finans')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    currentPage === 'finans'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Finans & Kasa
                </button>
                <button
                  onClick={() => setCurrentPage('sms')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    currentPage === 'sms'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  SMS
                </button>
                <button
                  onClick={() => setCurrentPage('arac-personel')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    currentPage === 'arac-personel'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Araç & Personel
                </button>
                <button
                  onClick={() => setCurrentPage('kursiyer-on-kayit')}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    currentPage === 'kursiyer-on-kayit'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Ön Kayıt
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <span className={`px-3 py-1 text-sm rounded-full ${
                apiConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {apiConnected ? '✅ API Bağlı' : '❌ API Bağlantı Hatası'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {currentPage === 'kursiyer' && <KursiyerList />}
        {currentPage === 'ders-programi' && <DersProgrami />}
        {currentPage === 'finans' && <Finans />}
        {currentPage === 'sms' && <SMS />}
        {currentPage === 'arac-personel' && <AracPersonel />}
        {currentPage === 'kursiyer-on-kayit' && <KursiyerOnKayit />}
      </main>
    </div>
  );
}

export default App;

