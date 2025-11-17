/**
 * Kursiyer Doğum Günü Takip domain types
 */

export interface DogumGunuKursiyer {
  id_kursiyer: number;
  adi: string;
  soyadi: string;
  dogum_tarihi: Date | string;
  telefon?: string;
  email?: string;
  kalan_gun: number; // Doğum gününe kalan gün sayısı
  yas: number; // Yaş
  dogum_gunu_tarihi: Date | string; // Bu yılki doğum günü tarihi
}

export interface DogumGunuRaporu {
  bugun_dogum_gunu: DogumGunuKursiyer[];
  bu_hafta_dogum_gunu: DogumGunuKursiyer[];
  bu_ay_dogum_gunu: DogumGunuKursiyer[];
  yaklasan_dogum_gunleri: DogumGunuKursiyer[]; // 30 gün içinde
}

