/**
 * SMS Servisi domain types
 */

export interface SMSTemplate {
  id: number;
  baslik: string;
  icerik: string;
  aktif?: boolean;
}

export interface SMSGonderim {
  id: number;
  id_kursiyer?: number;
  telefon: string;
  mesaj: string;
  durum?: number; // 0: bekliyor, 1: gönderildi, 2: hata
  gonderim_tarihi?: Date | string;
  hata_mesaji?: string;
}

export interface TopluSMS {
  id: number;
  baslik: string;
  mesaj: string;
  gonderim_tarihi?: Date | string;
  toplam_kisi?: number;
  basarili?: number;
  basarisiz?: number;
  durum?: number; // 0: bekliyor, 1: gönderiliyor, 2: tamamlandı, 3: hata
}

export interface BorcSMS {
  id_kursiyer: number;
  telefon: string;
  adi: string;
  soyadi: string;
  borc_tutari: number;
  vade_tarihi?: Date | string;
  gecikme_gunu?: number;
}

