import { useState, useEffect } from 'react';
import KursiyerList from './pages/KursiyerList';

function App() {
  const [apiConnected, setApiConnected] = useState(false);

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
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">MTSK - Motorlu Taşıtlar Sürücü Kursu</h1>
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
        <KursiyerList />
      </main>
    </div>
  );
}

export default App;

