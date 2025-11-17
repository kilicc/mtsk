import { useState } from 'react';

export default function Tanimlar() {
  const [activeCategory, setActiveCategory] = useState<string>('genel');

  const categories = [
    { id: 'genel', name: 'Genel Tanımlar', icon: '⚙️' },
    { id: 'arac', name: 'Araç Tanımları', icon: '🚗' },
    { id: 'personel', name: 'Personel Tanımları', icon: '👔' },
    { id: 'ders', name: 'Ders Tanımları', icon: '📚' },
    { id: 'evrak', name: 'Evrak Tanımları', icon: '📄' },
    { id: 'finans', name: 'Finans Tanımları', icon: '💰' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tanımlar</h1>
        <p className="text-gray-600 mt-1">Sistem parametreleri ve tanımları yönetin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all ${
              activeCategory === category.id
                ? 'border-2 border-blue-500 shadow-xl'
                : 'border-2 border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">{category.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Tanımları görüntüle ve düzenle</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {categories.find(c => c.id === activeCategory)?.name}
        </h2>
        <div className="text-center py-12 text-gray-500">
          {activeCategory === 'genel' && 'Genel tanımlar yakında eklenecek...'}
          {activeCategory === 'arac' && 'Araç tanımları yakında eklenecek...'}
          {activeCategory === 'personel' && 'Personel tanımları yakında eklenecek...'}
          {activeCategory === 'ders' && 'Ders tanımları yakında eklenecek...'}
          {activeCategory === 'evrak' && 'Evrak tanımları yakında eklenecek...'}
          {activeCategory === 'finans' && 'Finans tanımları yakında eklenecek...'}
        </div>
      </div>
    </div>
  );
}

