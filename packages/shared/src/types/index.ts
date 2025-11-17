// Domain types for MTSK application
export * from './kursiyer';
export * from './ders-programi';
export * from './finans';
export * from './sms';
export * from './arac-personel-evrak';
export * from './kullanici-mesajlari';
export * from './eksik-evrak';

// Personel interface moved to arac-personel-evrak.ts
// Arac interface is in arac-personel-evrak.ts

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
