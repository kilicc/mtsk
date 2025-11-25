/**
 * Finans & Kasa domain types
 */

export interface Muhasebe {
  id: number;
  id_kursiyer?: number;
  id_personel?: number;
  id_referans?: number;
  kasa?: number;
  vade_tarihi?: Date | string;
  tutar?: string;
  odeme_tarihi?: Date | string;
  kul_tarih?: Date | string;
  durum_kendisi?: boolean;
  kayit_durumu?: number;
  akt?: number;
  personel_yil?: number;
}

export interface KursiyerFatura {
  id: number;
  id_kursiyer: number;
  id_referans?: number;
  fatura_tarihi?: Date | string;
  fatura_kdv_hesabi?: boolean;
  fatura_no?: number;
  fatura_yekun?: string;
  fatura_isk_orani?: number;
  fatura_isk_tutari?: string;
  fatura_ara_toplam?: string;
  fatura_kdv_orani?: number;
  fatura_kdv_tutari?: string;
  fatura_toplam?: string;
}

export interface KursiyerFaturaDetay {
  id: number;
  id_fatura: number;
  fatura_miktar?: number;
  fatura_fiyat?: string;
  fatura_tutar?: string;
}

export interface OdemePlani {
  id: number;
  id_kursiyer: number;
  taksit_no: number;
  tutar: number;
  vade_tarihi: Date | string;
  odeme_tarihi?: Date | string;
  odeme_durumu: number; // 0: ödenmedi, 1: ödendi
  odeme_tipi?: string; // nakit, banka, pos, vb.
}

export interface KasaRaporu {
  tarih: Date | string;
  nakit_giris?: number;
  nakit_cikis?: number;
  banka_giris?: number;
  banka_cikis?: number;
  toplam_giris?: number;
  toplam_cikis?: number;
  bakiye?: number;
}

export interface BorcRaporu {
  id_kursiyer: number;
  kursiyer_adi: string;
  kursiyer_soyadi: string;
  toplam_borc: number;
  odenecek_tutar: number;
  vade_tarihi?: Date | string;
  gecikme_gunu?: number;
}

export interface Kasa {
  id: number;
  kasa_adi: string;
  kasa_kodu?: string;
  bakiye: number;
  aciklama?: string;
  akt: number;
  kayit_tarihi?: Date | string;
}

export interface KasaIslemi {
  id: number;
  id_kasa: number;
  islem_tarihi: Date | string;
  islem_tipi: 'giris' | 'cikis';
  tutar: number;
  aciklama?: string;
  id_kursiyer?: number;
  id_fatura?: number;
  id_personel?: number;
  odeme_yontemi?: string;
  kayit_tarihi?: Date | string;
}

export interface KasaTransfer {
  id: number;
  id_kaynak_kasa: number;
  id_hedef_kasa: number;
  transfer_tarihi: Date | string;
  tutar: number;
  aciklama?: string;
  kayit_tarihi?: Date | string;
}

export interface KasaToplamlari {
  id_kasa: number;
  kasa_adi: string;
  baslangic_bakiye: number;
  gunluk_giris: number;
  gunluk_cikis: number;
  toplam_giris: number;
  toplam_cikis: number;
  bakiye: number;
}

