/**
 * Kullanıcı Mesajları domain types
 */

export interface KullaniciMesaji {
  id: number;
  id_gonderen: number; // Kullanıcı ID
  id_alici: number | null; // null = Tüm kullanıcılara
  baslik: string;
  mesaj: string;
  okundu: boolean;
  okunma_tarihi?: Date | string;
  gonderim_tarihi: Date | string;
  silindi: boolean;
}

export interface Kullanici {
  id: number;
  kullanici_adi: string;
  adi?: string;
  soyadi?: string;
  email?: string;
  rol?: string;
  aktif?: boolean;
}

