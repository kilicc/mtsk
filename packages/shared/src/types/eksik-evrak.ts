/**
 * Eksik Evrak Takip domain types
 */

export interface EksikEvrak {
  id_kursiyer: number;
  kursiyer_adi: string;
  kursiyer_soyadi: string;
  telefon?: string;
  eksik_evraklar: string[];
  toplam_eksik: number;
}

export type EvrakTipi = 
  | 'nufus_cuzdani_on'
  | 'nufus_cuzdani_arka'
  | 'ogrenim_belgesi'
  | 'saglik_raporu'
  | 'savcilik_belgesi'
  | 'surucu_belgesi_on'
  | 'surucu_belgesi_arka'
  | 'mtsk_sertifika'
  | 'muracaat'
  | 'sozlesme_on'
  | 'sozlesme_arka'
  | 'imza'
  | 'fatura'
  | 'diger1'
  | 'diger2'
  | 'diger3';

export interface EvrakDurumRaporu {
  id_kursiyer: number;
  kursiyer_adi: string;
  kursiyer_soyadi: string;
  telefon?: string;
  evrak_durumlari: {
    evrak_tipi: EvrakTipi;
    evrak_adi: string;
    mevcut: boolean;
    tarih?: Date | string;
  }[];
  eksik_sayisi: number;
  tamamlanma_orani: number; // 0-100
}

