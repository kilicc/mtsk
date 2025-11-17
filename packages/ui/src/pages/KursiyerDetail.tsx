import { useState, useEffect } from 'react';
import type { Kursiyer } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

interface KursiyerDetailProps {
  id: string;
  onBack: () => void;
}

export default function KursiyerDetail({ id, onBack }: KursiyerDetailProps) {
  const [kursiyer, setKursiyer] = useState<Kursiyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'genel' | 'evrak' | 'odeme' | 'ders' | 'sinav'>('genel');

  useEffect(() => {
    loadKursiyer();
  }, [id]);

  const loadKursiyer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/kursiyer/${id}`);
      const data = await response.json();
      setKursiyer(data);
    } catch (error) {
      console.error('Error loading kursiyer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!kursiyer) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Kursiyer bulunamadı</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
          >
            ← Geri
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {kursiyer.adi} {kursiyer.soyadi}
          </h1>
          <p className="text-gray-600">Kursiyer Detay Bilgileri</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-2 mb-6 border-b">
          {[
            { id: 'genel', label: 'Genel Bilgiler', icon: '📋' },
            { id: 'evrak', label: 'Evraklar', icon: '📄' },
            { id: 'odeme', label: 'Ödeme Planı', icon: '💰' },
            { id: 'ders', label: 'Dersler', icon: '📚' },
            { id: 'sinav', label: 'Sınavlar', icon: '📝' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'genel' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Ad</label>
                <p className="text-lg font-semibold text-gray-800">{kursiyer.adi}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Soyad</label>
                <p className="text-lg font-semibold text-gray-800">{kursiyer.soyadi}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">TC Kimlik No</label>
                <p className="text-lg font-semibold text-gray-800">{kursiyer.tc_kimlik || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Telefon</label>
                <p className="text-lg font-semibold text-gray-800">{kursiyer.telefon || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">E-posta</label>
                <p className="text-lg font-semibold text-gray-800">{kursiyer.email || '-'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Doğum Tarihi</label>
                <p className="text-lg font-semibold text-gray-800">
                  {kursiyer.dogum_tarihi ? new Date(kursiyer.dogum_tarihi).toLocaleDateString('tr-TR') : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Kayıt Tarihi</label>
                <p className="text-lg font-semibold text-gray-800">
                  {kursiyer.kayit_tarihi ? new Date(kursiyer.kayit_tarihi).toLocaleDateString('tr-TR') : '-'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Adres</label>
                <p className="text-lg font-semibold text-gray-800">{kursiyer.adres || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Durum</label>
                <p className="text-lg font-semibold text-gray-800">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    kursiyer.durum === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {kursiyer.durum === 1 ? 'Aktif' : 'Pasif'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evrak' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-600">Evrak listesi yakında eklenecek</p>
          </div>
        )}

        {activeTab === 'odeme' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-gray-600">Ödeme planı yakında eklenecek</p>
          </div>
        )}

        {activeTab === 'ders' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600">Ders listesi yakında eklenecek</p>
          </div>
        )}

        {activeTab === 'sinav' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600">Sınav listesi yakında eklenecek</p>
          </div>
        )}
      </div>
    </div>
  );
}

