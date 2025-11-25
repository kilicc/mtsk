export interface Sube {
  id: number;
  adi: string;
  kodu?: string;
  adres?: string;
  telefon?: string;
  email?: string;
  yetkili_kisi?: string;
  akt: boolean;
  kayit_tarihi: Date | string;
}

export interface KullaniciSube {
  id: number;
  id_kullanici: number;
  id_sube: number;
  varsayilan: boolean;
  kayit_tarihi: Date | string;
}

export interface AktifSube {
  id: number;
  adi: string;
  kodu?: string;
}

