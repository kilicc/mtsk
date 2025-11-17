import { DogumGunuKursiyer, DogumGunuRaporu } from '@mtsk/shared';
import { KursiyerRepository } from '../repositories/kursiyer.repository';

export class DogumGunuService {
  private kursiyerRepo: KursiyerRepository;

  constructor() {
    this.kursiyerRepo = new KursiyerRepository();
  }

  /**
   * Calculate age and days until next birthday
   */
  private calculateBirthdayInfo(dogumTarihi: Date): { yas: number; kalanGun: number; dogumGunuTarihi: Date } {
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisYearBirthday = new Date(thisYear, dogumTarihi.getMonth(), dogumTarihi.getDate());
    
    let yas = thisYear - dogumTarihi.getFullYear();
    let kalanGun = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // If birthday already passed this year, calculate for next year
    if (kalanGun < 0) {
      const nextYearBirthday = new Date(thisYear + 1, dogumTarihi.getMonth(), dogumTarihi.getDate());
      kalanGun = Math.ceil((nextYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      yas++;
      return { yas, kalanGun, dogumGunuTarihi: nextYearBirthday };
    }
    
    return { yas, kalanGun, dogumGunuTarihi: thisYearBirthday };
  }

  /**
   * Get all kursiyers with birthday information
   */
  async getAllDogumGunuKursiyerler(): Promise<DogumGunuKursiyer[]> {
    const kursiyerler = await this.kursiyerRepo.findActive();
    const dogumGunuKursiyerler: DogumGunuKursiyer[] = [];

    for (const kursiyer of kursiyerler) {
      if (!kursiyer.dogum_tarihi) continue;

      const dogumTarihi = new Date(kursiyer.dogum_tarihi);
      const { yas, kalanGun, dogumGunuTarihi } = this.calculateBirthdayInfo(dogumTarihi);

      dogumGunuKursiyerler.push({
        id_kursiyer: kursiyer.id,
        adi: kursiyer.adi,
        soyadi: kursiyer.soyadi,
        dogum_tarihi: kursiyer.dogum_tarihi,
        telefon: kursiyer.telefon,
        email: kursiyer.email,
        kalan_gun: kalanGun,
        yas: yas,
        dogum_gunu_tarihi: dogumGunuTarihi.toISOString(),
      });
    }

    return dogumGunuKursiyerler.sort((a, b) => a.kalan_gun - b.kalan_gun);
  }

  /**
   * Get birthday report
   */
  async getDogumGunuRaporu(): Promise<DogumGunuRaporu> {
    const tumKursiyerler = await this.getAllDogumGunuKursiyerler();
    const today = new Date();
    const weekLater = new Date();
    weekLater.setDate(today.getDate() + 7);
    const monthLater = new Date();
    monthLater.setDate(today.getDate() + 30);

    const bugunDogumGunu = tumKursiyerler.filter((k) => k.kalan_gun === 0);
    const buHaftaDogumGunu = tumKursiyerler.filter((k) => k.kalan_gun >= 0 && k.kalan_gun <= 7);
    const buAyDogumGunu = tumKursiyerler.filter((k) => k.kalan_gun >= 0 && k.kalan_gun <= 30);
    const yaklasanDogumGunleri = tumKursiyerler.filter((k) => k.kalan_gun >= 0 && k.kalan_gun <= 30);

    return {
      bugun_dogum_gunu: bugunDogumGunu,
      bu_hafta_dogum_gunu: buHaftaDogumGunu,
      bu_ay_dogum_gunu: buAyDogumGunu,
      yaklasan_dogum_gunleri: yaklasanDogumGunleri,
    };
  }

  /**
   * Get kursiyers with birthday today
   */
  async getBugunDogumGunu(): Promise<DogumGunuKursiyer[]> {
    const tumKursiyerler = await this.getAllDogumGunuKursiyerler();
    return tumKursiyerler.filter((k) => k.kalan_gun === 0);
  }

  /**
   * Get kursiyers with birthday in next N days
   */
  async getYaklasanDogumGunleri(gunSayisi: number = 30): Promise<DogumGunuKursiyer[]> {
    const tumKursiyerler = await this.getAllDogumGunuKursiyerler();
    return tumKursiyerler.filter((k) => k.kalan_gun >= 0 && k.kalan_gun <= gunSayisi);
  }
}

