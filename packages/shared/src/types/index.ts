// Domain types for MTSK application

export interface Kursiyer {
  id: number;
  adi: string;
  soyadi: string;
  tc_kimlik?: string;
  telefon?: string;
  email?: string;
  adres?: string;
  dogum_tarihi?: Date;
  kayit_tarihi: Date;
  durum: number;
}

export interface Personel {
  id: number;
  adi: string;
  soyadi: string;
  telefon?: string;
  email?: string;
  gorev?: string;
}

export interface Arac {
  id: number;
  plaka: string;
  marka?: string;
  model?: string;
  yil?: number;
}

export interface GrupKarti {
  id: number;
  grup_adi: string;
  sinif?: string;
  baslangic_tarihi?: Date;
  bitis_tarihi?: Date;
}

export interface DersProgrami {
  id: number;
  id_kursiyer?: number;
  id_personel?: number;
  id_grup?: number;
  id_arac?: number;
  tarih?: Date;
  saat?: string;
  durum?: number;
}

// Add more types as needed

