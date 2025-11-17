/**
 * Yedekleme & Otomasyon domain types
 */

export interface YedeklemeAyari {
  id: number;
  gun: number; // 0: Pazar, 1: Pazartesi, ..., 6: Cumartesi
  saat: string; // HH:mm formatında
  aktif: boolean;
  yedekleme_tipi?: string; // 'full', 'incremental'
  saklama_suresi?: number; // Gün cinsinden
}

export interface YedeklemeGecmisi {
  id: number;
  yedekleme_tarihi: Date | string;
  yedekleme_tipi: string;
  dosya_yolu?: string;
  dosya_boyutu?: number; // Bytes
  durum: string; // 'basarili', 'basarisiz', 'devam_ediyor'
  hata_mesaji?: string;
}

export interface ZamanlanmisGorev {
  id: number;
  gorev_adi: string;
  gorev_tipi: string; // 'yedekleme', 'sms', 'rapor', vb.
  zamanlama: string; // Cron expression veya 'daily', 'weekly', vb.
  aktif: boolean;
  son_calistirma?: Date | string;
  sonraki_calistirma?: Date | string;
  parametreler?: Record<string, any>;
}

