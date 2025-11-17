/**
 * Ders Programı (Lesson Schedule) domain types
 */

export interface DersProgramiDireksiyon {
  id: number;
  id_kursiyer?: number;
  id_personel?: number;
  id_grup?: number;
  id_arac?: number;
  t1?: Date | string;
  t2?: Date | string;
  t3?: Date | string;
  t4?: Date | string;
  t5?: Date | string;
  t6?: Date | string;
  t7?: Date | string;
  t8?: Date | string;
  t9?: Date | string;
  t10?: Date | string;
  t11?: Date | string;
  t12?: Date | string;
  t13?: Date | string;
  t14?: Date | string;
  t15?: Date | string;
  t16?: Date | string;
  t17?: Date | string;
  t18?: Date | string;
  t19?: Date | string;
  t20?: Date | string;
  t21?: Date | string;
  t22?: Date | string;
  t23?: Date | string;
  t24?: Date | string;
  t25?: Date | string;
  t26?: Date | string;
  t27?: Date | string;
  t28?: Date | string;
  t29?: Date | string;
  t30?: Date | string;
  t31?: Date | string;
  s1?: string;
  s2?: string;
  s3?: string;
  s4?: string;
  s5?: string;
  s6?: string;
  s7?: string;
  s8?: string;
  s9?: string;
  s10?: string;
  s11?: string;
  s12?: string;
  s13?: string;
  s14?: string;
  s15?: string;
  s16?: string;
  s17?: string;
  s18?: string;
  s19?: string;
  s20?: string;
  s21?: string;
  s22?: string;
  s23?: string;
  s24?: string;
  s25?: string;
  s26?: string;
  s27?: string;
  s28?: string;
  s29?: string;
  s30?: string;
  s31?: string;
  durum?: number;
  toplam_saat?: number;
  direksiyon_no?: number;
  direksiyon_aciklama?: string;
  s_simulator?: string;
  s_dir_egt_yeri?: string;
  egitim_turu?: string;
}

export interface DersProgramiTeori {
  id: number;
  id_grup_karti?: number;
  hafta?: number;
  tarih?: Date | string;
  saat?: string;
  id_personel?: number;
  konu?: string;
  durum?: number;
}

export interface DersProgramiMebbis {
  id: number;
  ge_prg_no?: number;
  ge_id_kurs?: number;
  ge_id_pers?: number;
  ge_id_grup?: number;
  ge_id_arac?: number;
  ge_aday_no?: number;
  ge_durumu?: number;
  aktarim_durumu?: boolean;
  aktarim_tarihi?: Date | string;
}

export interface DireksiyonDersKaydi {
  id: number;
  direksiyon_no: number;
  id_kursiyer: number;
  id_personel: number;
  id_arac?: number;
  tarih: Date | string;
  saat: string;
  durum: number;
  toplam_saat?: number;
}

