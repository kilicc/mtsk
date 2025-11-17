/**
 * Referans İşlemleri domain types
 */

export interface Referans {
  id: number;
  ref_adi?: string;
  ref_soyadi?: string;
  ref_telefon?: string;
  ref_email?: string;
  ref_adres?: string;
  ref_kayit_tarihi?: Date | string;
  ref_kod?: number;
  ref_notlar?: string;
}

export interface ReferansRaporu {
  id_referans: number;
  ref_adi?: string;
  ref_soyadi?: string;
  kursiyer_sayisi: number;
  toplam_komisyon?: number;
  son_kursiyer_tarihi?: Date | string;
}

