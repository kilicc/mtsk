import { useState } from 'react';

export default function Raporlar() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const raporlar = [
    { id: 'kursiyer-raporu', name: 'Kursiyer Raporu', description: 'Kursiyer listesi ve detay raporu' },
    { id: 'finans-raporu', name: 'Finans Raporu', description: 'Gelir-gider ve kasa raporu' },
    { id: 'ders-raporu', name: 'Ders Programı Raporu', description: 'Ders programı ve katılım raporu' },
    { id: 'arac-raporu', name: 'Araç Raporu', description: 'Araç kullanım ve bakım raporu' },
    { id: 'personel-raporu', name: 'Personel Raporu', description: 'Personel performans raporu' },
    { id: 'evrak-raporu', name: 'Evrak Raporu', description: 'Evrak tamamlanma raporu' },
    { id: 'sms-raporu', name: 'SMS Raporu', description: 'SMS gönderim raporu' },
    { id: 'odeme-raporu', name: 'Ödeme Raporu', description: 'Ödeme planı ve tahsilat raporu' },
  ];

  return (
    <div className="p-4 space-y-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Raporlar</h1>
        <p className="text-gray-600 mt-1">Sistem raporlarını görüntüleyin ve dışa aktarın</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {raporlar.map((rapor) => (
          <div
            key={rapor.id}
            onClick={() => setSelectedReport(rapor.id)}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">{rapor.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{rapor.description}</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Raporu Görüntüle
            </button>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {raporlar.find(r => r.id === selectedReport)?.name}
          </h2>
          <div className="text-center py-12 text-gray-500">
            Rapor detayları yakında eklenecek...
          </div>
        </div>
      )}
    </div>
  );
}

