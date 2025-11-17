import { KurumsalDersProgrami, KurumsalDersRaporu } from '@mtsk/shared';
import { KurumsalDersProgramiRepository } from '../repositories/kurumsal-ders-programi.repository';
import { KursiyerRepository } from '../repositories/kursiyer.repository';

export class KurumsalDersProgramiService {
  private dersRepo: KurumsalDersProgramiRepository;
  private kursiyerRepo: KursiyerRepository;

  constructor() {
    this.dersRepo = new KurumsalDersProgramiRepository();
    this.kursiyerRepo = new KursiyerRepository();
  }

  /**
   * Get all kurumsal ders programs
   */
  async getAllDersler(filters?: {
    id_kursiyer?: number;
    id_personel?: number;
    id_arac?: number;
    baslangic_tarihi?: string;
    bitis_tarihi?: string;
  }): Promise<KurumsalDersProgrami[]> {
    if (filters?.id_kursiyer) {
      return this.dersRepo.findByKursiyer(filters.id_kursiyer);
    }
    if (filters?.id_personel) {
      return this.dersRepo.findByPersonel(filters.id_personel);
    }
    if (filters?.id_arac) {
      return this.dersRepo.findByArac(filters.id_arac);
    }
    if (filters?.baslangic_tarihi && filters?.bitis_tarihi) {
      return this.dersRepo.findByDateRange(filters.baslangic_tarihi, filters.bitis_tarihi);
    }
    return this.dersRepo.findAll();
  }

  /**
   * Get ders by ID
   */
  async getDersById(id: number): Promise<KurumsalDersProgrami | null> {
    return this.dersRepo.findById(id);
  }

  /**
   * Create new ders
   */
  async createDers(ders: Partial<KurumsalDersProgrami>): Promise<KurumsalDersProgrami> {
    return this.dersRepo.create(ders);
  }

  /**
   * Update ders
   */
  async updateDers(id: number, updates: Partial<KurumsalDersProgrami>): Promise<KurumsalDersProgrami> {
    return this.dersRepo.update(id, updates);
  }

  /**
   * Delete ders
   */
  async deleteDers(id: number): Promise<void> {
    await this.dersRepo.delete(id);
  }

  /**
   * Get upcoming lessons
   */
  async getYaklasanDersler(daysAhead: number = 30): Promise<KurumsalDersProgrami[]> {
    return this.dersRepo.findUpcoming(daysAhead);
  }

  /**
   * Get ders report for a kursiyer
   */
  async getDersRaporu(idKursiyer: number): Promise<KurumsalDersRaporu | null> {
    const kursiyer = await this.kursiyerRepo.findById(idKursiyer);
    if (!kursiyer) {
      return null;
    }

    const dersler = await this.dersRepo.findByKursiyer(idKursiyer);
    
    const toplamDersSayisi = dersler.length;
    const tamamlananDersSayisi = dersler.filter((d) => d.durum === 1).length;
    const toplamDersSaati = dersler.reduce((sum, d) => sum + (d.saat || 0), 0);
    
    const tamamlananDersler = dersler.filter((d) => d.durum === 1);
    const sonDersTarihi = tamamlananDersler.length > 0
      ? tamamlananDersler.sort((a, b) => 
          new Date(b.tarih).getTime() - new Date(a.tarih).getTime()
        )[0].tarih
      : undefined;

    const gelecekDersler = dersler.filter((d) => d.durum === 0 || d.durum === undefined);
    const sonrakiDersTarihi = gelecekDersler.length > 0
      ? gelecekDersler.sort((a, b) => 
          new Date(a.tarih).getTime() - new Date(b.tarih).getTime()
        )[0].tarih
      : undefined;

    return {
      id_kursiyer: kursiyer.id,
      kursiyer_adi: kursiyer.adi,
      kursiyer_soyadi: kursiyer.soyadi,
      toplam_ders_sayisi: toplamDersSayisi,
      tamamlanan_ders_sayisi: tamamlananDersSayisi,
      toplam_ders_saati: toplamDersSaati,
      son_ders_tarihi: sonDersTarihi,
      sonraki_ders_tarihi: sonrakiDersTarihi,
    };
  }

  /**
   * Get ders reports for all kursiyers
   */
  async getAllDersRaporu(): Promise<KurumsalDersRaporu[]> {
    const kursiyerler = await this.kursiyerRepo.findActive();
    const raporlar: KurumsalDersRaporu[] = [];

    for (const kursiyer of kursiyerler) {
      const rapor = await this.getDersRaporu(kursiyer.id);
      if (rapor) {
        raporlar.push(rapor);
      }
    }

    return raporlar.sort((a, b) => b.toplam_ders_sayisi - a.toplam_ders_sayisi);
  }
}

