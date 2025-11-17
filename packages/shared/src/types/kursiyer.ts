/**
 * Kursiyer (Student/Trainee) domain types
 */

export interface Kursiyer {
  id: number;
  adi: string;
  soyadi: string;
  tc_kimlik?: string;
  telefon?: string;
  email?: string;
  adres?: string;
  dogum_tarihi?: Date | string;
  kayit_tarihi: Date | string;
  durum: number;
  id_grup?: number;
  id_referans?: number;
  notlar?: string;
  foto?: string;
  silme_tarihi?: Date | string;
}

export interface KursiyerOnKayit {
  id: number;
  adi: string;
  soyadi: string;
  tc_kimlik?: string;
  telefon?: string;
  email?: string;
  adres?: string;
  dogum_tarihi?: Date | string;
  gorusme_tarihi: Date | string;
  id_gorusen_personel?: number;
  durum: number; // 0: Ön Kayıt, 1: Kesin Kayda Aktarıldı, 2: İptal
  notlar?: string;
  kayit_tarihi?: Date | string;
}

export interface KursiyerEvrak {
  id: number;
  id_kursiyer: number;
  evrak_tipi: string;
  dosya_yolu?: string;
  durum: number;
  tarih?: Date | string;
}

export interface KursiyerOdeme {
  id: number;
  id_kursiyer: number;
  tutar: number;
  odeme_tarihi: Date | string;
  odeme_tipi: string;
  aciklama?: string;
}

