import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AktifSube, Sube } from '@mtsk/shared';

const API_URL = 'http://localhost:3001/api';

interface SubeContextType {
  aktifSube: AktifSube | null;
  kullaniciSubeleri: Sube[];
  setAktifSube: (sube: AktifSube | null) => void;
  loadKullaniciSubeleri: () => Promise<void>;
  loading: boolean;
}

const SubeContext = createContext<SubeContextType | undefined>(undefined);

export function SubeProvider({ children }: { children: ReactNode }) {
  const [aktifSube, setAktifSubeState] = useState<AktifSube | null>(null);
  const [kullaniciSubeleri, setKullaniciSubeleri] = useState<Sube[]>([]);
  const [loading, setLoading] = useState(true);

  // Aktif şubeyi localStorage'dan yükle
  useEffect(() => {
    const savedSube = localStorage.getItem('aktifSube');
    if (savedSube) {
      try {
        const sube = JSON.parse(savedSube);
        setAktifSubeState(sube);
      } catch (e) {
        console.error('Error loading aktif sube:', e);
      }
    }
  }, []);

  // Aktif şubeyi localStorage'a kaydet
  const setAktifSube = (sube: AktifSube | null) => {
    setAktifSubeState(sube);
    if (sube) {
      localStorage.setItem('aktifSube', JSON.stringify(sube));
    } else {
      localStorage.removeItem('aktifSube');
    }
  };

  // Kullanıcının şubelerini yükle
  const loadKullaniciSubeleri = async () => {
    try {
      setLoading(true);
      // TODO: Gerçek kullanıcı ID'sini al (şimdilik 1 kullanıyoruz)
      const kullaniciId = 1;
      const response = await fetch(`${API_URL}/sube/kullanici/${kullaniciId}`);
      if (response.ok) {
        const data = await response.json();
        setKullaniciSubeleri(data);
        
        // Eğer aktif şube yoksa ve varsayılan şube varsa, onu seç
        if (!aktifSube && data.length > 0) {
          const varsayilanSube = data.find((s: any) => s.varsayilan) || data[0];
          setAktifSube({
            id: varsayilanSube.id,
            adi: varsayilanSube.adi,
            kodu: varsayilanSube.kodu,
          });
        }
      }
    } catch (error) {
      console.error('Error loading kullanici subeleri:', error);
    } finally {
      setLoading(false);
    }
  };

  // İlk yüklemede şubeleri getir
  useEffect(() => {
    loadKullaniciSubeleri();
  }, []);

  return (
    <SubeContext.Provider
      value={{
        aktifSube,
        kullaniciSubeleri,
        setAktifSube,
        loadKullaniciSubeleri,
        loading,
      }}
    >
      {children}
    </SubeContext.Provider>
  );
}

export function useSube() {
  const context = useContext(SubeContext);
  if (context === undefined) {
    throw new Error('useSube must be used within a SubeProvider');
  }
  return context;
}

