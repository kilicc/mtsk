/**
 * Araç, Personel & Evrak domain types
 */

export interface Arac {
  id: number;
  plaka?: string;
  arac_tescil_tar?: Date | string;
  hiz_bas_tar?: Date | string;
  muhayene_tar?: Date | string;
  sigorta_bas_tar?: Date | string;
  sigorta_bit_tar?: Date | string;
  kasko_bas_tar?: Date | string;
  kasko_bit_tar?: Date | string;
  kasko_isl_bedeli?: string;
  akt?: number;
}

export interface AracBakim {
  id: number;
  id_arac: number;
  bakim_tarihi?: Date | string;
  bakim_tutari?: string;
  bakim_aciklama?: string;
  sonraki_bakim_tarihi?: Date | string;
}

export interface Personel {
  id: number;
  adi?: string;
  soyadi?: string;
  personel_no?: number;
  dogum_tarihi?: Date | string;
  kayit_tarihi?: Date | string;
  telefon?: string;
  email?: string;
  gorev?: string;
  bir_ders_saat_uc?: string;
  aylik_ucret?: string;
  maas?: string;
  calisma_izin_tar?: Date | string;
  gorev_bas_tarihi?: Date | string;
  soz_tanzim_tar?: Date | string;
  soz_baslama_tar?: Date | string;
  soz_bitis_tar?: Date | string;
  ehliyet_ver_tarihi?: Date | string;
  ayrilmis_tarihi?: Date | string;
  akt?: number;
}

// KursiyerEvrak moved to kursiyer.ts to avoid duplication

export interface AracDurumRaporu {
  id_arac: number;
  plaka?: string;
  kullanımda?: boolean;
  bakimda?: boolean;
  sigorta_yaklasan?: boolean;
  muayene_yaklasan?: boolean;
  kasko_yaklasan?: boolean;
  sigorta_kalan_gun?: number;
  muayene_kalan_gun?: number;
  kasko_kalan_gun?: number;
}

