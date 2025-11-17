/**
 * Araç Yakıt Takip domain types
 */

export interface AracYakit {
  id: number;
  id_arac: number;
  yakit_tarihi: Date | string;
  yakit_tutari: number;
  yakit_miktari: number; // Litre
  yakit_tipi?: string; // Benzin, Dizel, LPG, Elektrik
  km_baslangic?: number;
  km_bitis?: number;
  km_fark?: number;
  litre_basina_km?: number;
  yakit_istasyonu?: string;
  faturano?: string;
  id_personel?: number;
  notlar?: string;
  kayit_tarihi?: Date | string;
}

export interface AracYakitRaporu {
  id_arac: number;
  plaka?: string;
  toplam_yakit_tutari: number;
  toplam_yakit_miktari: number;
  toplam_km: number;
  ortalama_litre_basina_km: number;
  ortalama_yakit_fiyati: number;
  son_yakit_tarihi?: Date | string;
  kayit_sayisi: number;
}

