/**
 * Parametreler & Yetkilendirme domain types
 */

export interface Parametreler {
  id: number;
  [key: string]: any; // Flexible structure for different parameter types
}

export interface GenelParametreler {
  id: number;
  son_refno?: number;
  check_minimum?: boolean;
  minimum_tutar?: string;
  check_maksimum_taksit_say?: boolean;
  maksimum_taksit_say?: number;
  ref_varsayilan_kdv?: number;
  ref_varsayilan_isk?: number;
  kurs_varsayilan_kdv?: number;
  kurs_varsayilan_isk?: number;
}

export interface SMSParametreleri {
  id: number;
  sms_bil_yeni_kayit?: boolean;
  sms_bil_kursiyer_odeme?: boolean;
  sms_bil_referans_odeme?: boolean;
  sms_bil_gelir?: boolean;
  sms_bil_gider?: boolean;
  sms_bil_odeme_degisiklik?: boolean;
  sms_kur_karsilama_sms_durumu?: boolean;
  sms_kur_odeme_durumu?: boolean;
  sms_kur_dogum_gunu_pazar_durumu?: boolean;
  sms_kur_e_sinav_bil_durumu?: boolean;
  sms_kur_e_sinav_giris_bel_durumu?: boolean;
  sms_kur_drks_sinav_giris_bel_durumu?: boolean;
  sms_kur_gsm_2_durumu?: boolean;
}

export interface KullaniciYetki {
  id_yetki: number;
  id: number; // Kullanıcı ID
  parentid: number; // Menü/Modül ID
  yetki: boolean;
}

export interface KullaniciYonetimi {
  id: number;
  kullanici_adi?: string;
  adi?: string;
  soyadi?: string;
  email?: string;
  rol?: string;
  aktif?: boolean;
  yetkiler?: KullaniciYetki[];
}

