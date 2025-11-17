/**
 * Kurumsal Ders Programı domain types
 * Gerçek direksiyon eğitimlerini takip eder
 */

export interface KurumsalDersProgrami {
  id: number;
  id_kursiyer: number;
  id_personel: number; // Eğitmen
  id_arac: number;
  id_grup?: number;
  tarih: Date | string;
  hafta?: number; // Hafta numarası
  saat?: number; // Ders saati
  baslangic_saati?: string; // Örn: "09:00"
  bitis_saati?: string; // Örn: "10:00"
  durum?: number; // 0: Planlandı, 1: Tamamlandı, 2: İptal
  notlar?: string;
  km_baslangic?: number;
  km_bitis?: number;
  egitim_konusu?: string; // Park, şehir içi, otoyol vb.
}

export interface KurumsalDersRaporu {
  id_kursiyer: number;
  kursiyer_adi: string;
  kursiyer_soyadi: string;
  toplam_ders_sayisi: number;
  tamamlanan_ders_sayisi: number;
  toplam_ders_saati: number;
  son_ders_tarihi?: Date | string;
  sonraki_ders_tarihi?: Date | string;
}

