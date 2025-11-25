import { useState, useEffect } from 'react';
import { DersProgramiDireksiyon, DersProgramiTeori } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

type ProgramType = 'direksiyon' | 'teori';

export default function DersProgrami() {
  const [programType, setProgramType] = useState<ProgramType>('direksiyon');
  const [direksiyonPrograms, setDireksiyonPrograms] = useState<DersProgramiDireksiyon[]>([]);
  const [teoriPrograms, setTeoriPrograms] = useState<DersProgramiTeori[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrup, setSelectedGrup] = useState<number | null>(null);

  useEffect(() => {
    loadPrograms();
  }, [programType, selectedGrup]);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      if (programType === 'direksiyon') {
        const params = selectedGrup ? `?id_grup=${selectedGrup}` : '';
        const response = await fetch(`${API_URL}/ders-programi/direksiyon${params}`);
        const data = await response.json();
        setDireksiyonPrograms(data);
      } else {
        const params = selectedGrup ? `?id_grup_karti=${selectedGrup}` : '';
        const response = await fetch(`${API_URL}/ders-programi/teori${params}`);
        const data = await response.json();
        setTeoriPrograms(data);
      }
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMebbisExport = async (grupId: number) => {
    if (!confirm('Bu grup için MEBBİS export yapılacak. Devam edilsin mi?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/ders-programi/mebbis/export/${grupId}`, {
        method: 'POST',
      });
      const data = await response.json();
      alert(`MEBBİS export başarılı! ${data.length} kayıt oluşturuldu.`);
      loadPrograms();
    } catch (error: any) {
      alert(`MEBBİS export hatası: ${error.message}`);
    }
  };

  return (
    <div className="p-4" style={{ height: '100%', overflowY: 'auto' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Ders & Direksiyon Planlama</h1>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setProgramType('direksiyon')}
            className={`px-4 py-2 rounded-lg ${
              programType === 'direksiyon'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Direksiyon Programı
          </button>
          <button
            onClick={() => setProgramType('teori')}
            className={`px-4 py-2 rounded-lg ${
              programType === 'teori'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Teori Programı
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="Grup ID (opsiyonel)"
            value={selectedGrup || ''}
            onChange={(e) => setSelectedGrup(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={loadPrograms}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Filtrele
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Yükleniyor...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {programType === 'direksiyon' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kursiyer ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Personel ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grup ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Direksiyon No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Saat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {direksiyonPrograms.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      Program bulunamadı
                    </td>
                  </tr>
                ) : (
                  direksiyonPrograms.map((program) => (
                    <tr key={program.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{program.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.id_kursiyer || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.id_personel || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.id_grup || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.direksiyon_no || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.toplam_saat || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          program.durum === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {program.durum === 1 ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {program.id_grup && (
                          <button
                            onClick={() => handleMebbisExport(program.id_grup!)}
                            className="text-blue-600 hover:text-blue-800 mr-2"
                          >
                            MEBBİS Export
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grup Kartı ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hafta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Personel ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teoriPrograms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Program bulunamadı
                    </td>
                  </tr>
                ) : (
                  teoriPrograms.map((program) => (
                    <tr key={program.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{program.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.id_grup_karti || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.hafta || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{program.id_personel || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          program.durum === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {program.durum === 1 ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

