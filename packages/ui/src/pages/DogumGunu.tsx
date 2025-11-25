import { useState, useEffect } from 'react';
import type { DogumGunuRaporu } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

export default function DogumGunu() {
  const [rapor, setRapor] = useState<DogumGunuRaporu | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bugun' | 'bu-hafta' | 'bu-ay' | 'yaklasan'>('bugun');

  useEffect(() => {
    loadRapor();
  }, []);

  const loadRapor = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/dogum-gunu/rapor`);
      const data = await response.json();
      setRapor(data);
    } catch (error) {
      console.error('Error loading dogum gunu raporu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActiveList = () => {
    if (!rapor) return [];
    switch (activeTab) {
      case 'bugun':
        return rapor.bugun_dogum_gunu;
      case 'bu-hafta':
        return rapor.bu_hafta_dogum_gunu;
      case 'bu-ay':
        return rapor.bu_ay_dogum_gunu;
      case 'yaklasan':
        return rapor.yaklasan_dogum_gunleri;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeList = getActiveList();

  return (
    <div className="p-4 space-y-6" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎂 Doğum Günü Takibi</h1>
        <p className="text-gray-600">Kursiyer doğum günleri ve yaklaşan kutlamalar</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('bugun')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'bugun'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Bugün ({rapor?.bugun_dogum_gunu.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('bu-hafta')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'bu-hafta'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Bu Hafta ({rapor?.bu_hafta_dogum_gunu.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('bu-ay')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'bu-ay'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Bu Ay ({rapor?.bu_ay_dogum_gunu.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('yaklasan')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'yaklasan'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Yaklaşan ({rapor?.yaklasan_dogum_gunleri.length || 0})
          </button>
        </div>

        {activeList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎂</div>
            <p className="text-gray-600 text-lg">Bu dönemde doğum günü bulunmuyor</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeList.map((kursiyer) => (
              <div
                key={kursiyer.id_kursiyer}
                className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-5 border-2 border-pink-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-4xl">🎂</div>
                  {kursiyer.kalan_gun === 0 && (
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      BUGÜN!
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {kursiyer.adi} {kursiyer.soyadi}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📅 {new Date(kursiyer.dogum_gunu_tarihi).toLocaleDateString('tr-TR')}</p>
                  <p>🎂 {kursiyer.yas} yaşında</p>
                  {kursiyer.kalan_gun > 0 && (
                    <p className="text-orange-600 font-medium">
                      ⏰ {kursiyer.kalan_gun} gün sonra
                    </p>
                  )}
                  {kursiyer.telefon && (
                    <p>📞 {kursiyer.telefon}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

