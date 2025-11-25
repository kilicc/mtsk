interface TanimlarProps {
  onPageChange?: (page: any) => void;
}

export default function Tanimlar({ onPageChange }: TanimlarProps) {
  const categories = [
    { id: 'donem-sube-tanimlama', name: 'Dönem Şube Tanımlama', icon: '📅', description: 'Dönem ve şube tanımları' },
    { id: 'sinav-tarihi-tanimlama', name: 'Sınav Tarihi Tanımlama', icon: '📝', description: 'Sınav tarihleri tanımları' },
    { id: 'genel', name: 'Genel Tanımlar', icon: '⚙️', description: 'Genel sistem tanımları' },
    { id: 'arac', name: 'Araç Tanımları', icon: '🚗', description: 'Araç tanımları' },
    { id: 'personel', name: 'Personel Tanımları', icon: '👔', description: 'Personel tanımları' },
    { id: 'ders', name: 'Ders Tanımları', icon: '📚', description: 'Ders tanımları' },
    { id: 'evrak', name: 'Evrak Tanımları', icon: '📄', description: 'Evrak tanımları' },
    { id: 'finans', name: 'Finans Tanımları', icon: '💰', description: 'Finans tanımları' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    if (onPageChange && (categoryId === 'donem-sube-tanimlama' || categoryId === 'sinav-tarihi-tanimlama')) {
      onPageChange(categoryId as any);
    }
  };

  return (
    <div className="p-4 space-y-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tanımlar</h1>
        <p className="text-gray-600 mt-1">Sistem parametreleri ve tanımları yönetin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
              category.id === 'donem-sube-tanimlama' || category.id === 'sinav-tarihi-tanimlama'
                ? 'border-2 border-gray-300 hover:border-gray-500'
                : 'border-2 border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

