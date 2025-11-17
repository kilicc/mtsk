import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (supabase) {
      (async () => {
        try {
          await supabase.from('kullanicilar').select('count').limit(1);
          setConnected(true);
        } catch (err: unknown) {
          console.error('Supabase connection error:', err);
          setConnected(false);
        }
      })();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">MTSK - Motorlu Taşıtlar Sürücü Kursu</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg mb-2">
            Durum: <span className={connected ? 'text-green-600' : 'text-red-600'}>
              {connected ? '✅ Supabase Bağlı' : '❌ Supabase Bağlantı Hatası'}
            </span>
          </p>
          <p className="text-gray-600">Geliştirme modunda...</p>
        </div>
      </div>
    </div>
  );
}

export default App;

