import { useState, useEffect } from 'react';
import { KullaniciMesaji } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

// Mock user ID - gerçek uygulamada auth'dan gelecek
const CURRENT_USER_ID = 1;

export default function KullaniciMesajlari() {
  const [mesajlar, setMesajlar] = useState<KullaniciMesaji[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMesaj, setSelectedMesaj] = useState<KullaniciMesaji | null>(null);
  const [newMessage, setNewMessage] = useState({ baslik: '', mesaj: '', id_alici: '' });

  useEffect(() => {
    loadMesajlar();
    loadUnreadCount();
  }, []);

  const loadMesajlar = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/kullanici-mesajlari/${CURRENT_USER_ID}`);
      const data = await response.json();
      setMesajlar(data);
    } catch (error) {
      console.error('Error loading mesajlar:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await fetch(`${API_URL}/kullanici-mesajlari/${CURRENT_USER_ID}/unread-count`);
      const data = await response.json();
      setUnreadCount(data);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await fetch(`${API_URL}/kullanici-mesajlari/${id}/read`, { method: 'PUT' });
      await loadMesajlar();
      await loadUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/kullanici-mesajlari`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newMessage,
          id_gonderen: CURRENT_USER_ID,
          id_alici: newMessage.id_alici ? parseInt(newMessage.id_alici) : null,
        }),
      });
      setNewMessage({ baslik: '', mesaj: '', id_alici: '' });
      await loadMesajlar();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">✉️ Kullanıcı Mesajları</h1>
        <p className="text-gray-600">Kullanıcılar arası mesajlaşma sistemi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Gelen Kutusu</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {unreadCount} yeni
              </span>
            )}
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {mesajlar.map((mesaj) => (
              <div
                key={mesaj.id}
                onClick={() => {
                  setSelectedMesaj(mesaj);
                  if (!mesaj.okundu) {
                    handleMarkAsRead(mesaj.id);
                  }
                }}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  mesaj.id === selectedMesaj?.id
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : mesaj.okundu
                    ? 'bg-gray-50 hover:bg-gray-100'
                    : 'bg-blue-50 border-2 border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{mesaj.baslik}</h3>
                  {!mesaj.okundu && (
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{mesaj.mesaj}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(mesaj.gonderim_tarihi || '').toLocaleDateString('tr-TR')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          {selectedMesaj ? (
            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-800">{selectedMesaj.baslik}</h2>
                <button
                  onClick={() => setSelectedMesaj(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(selectedMesaj.gonderim_tarihi || '').toLocaleString('tr-TR')}
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedMesaj.mesaj}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✉️</div>
              <p className="text-gray-600 text-lg">Mesaj seçin</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Yeni Mesaj Gönder</h3>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <input
                type="text"
                placeholder="Başlık"
                value={newMessage.baslik}
                onChange={(e) => setNewMessage({ ...newMessage, baslik: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Alıcı ID (boş bırakırsanız tüm kullanıcılara gönderilir)"
                value={newMessage.id_alici}
                onChange={(e) => setNewMessage({ ...newMessage, id_alici: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Mesaj"
                value={newMessage.mesaj}
                onChange={(e) => setNewMessage({ ...newMessage, mesaj: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

