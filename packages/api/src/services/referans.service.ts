import { Referans, ReferansRaporu } from '@mtsk/shared';
import { ReferansRepository } from '../repositories/referans.repository';
import { supabase } from '../db/supabase';

export class ReferansService {
  private referansRepo: ReferansRepository;

  constructor() {
    this.referansRepo = new ReferansRepository();
  }

  /**
   * Get all referans
   */
  async getAllReferans(): Promise<Referans[]> {
    return this.referansRepo.findAll();
  }

  /**
   * Get referans by ID
   */
  async getReferansById(id: number): Promise<Referans | null> {
    return this.referansRepo.findById(id);
  }

  /**
   * Search referans by name
   */
  async searchReferans(searchTerm: string): Promise<Referans[]> {
    return this.referansRepo.searchByName(searchTerm);
  }

  /**
   * Create new referans
   */
  async createReferans(referans: Partial<Referans>): Promise<Referans> {
    return this.referansRepo.create(referans);
  }

  /**
   * Update referans
   */
  async updateReferans(id: number, updates: Partial<Referans>): Promise<Referans> {
    return this.referansRepo.update(id, updates);
  }

  /**
   * Delete referans
   */
  async deleteReferans(id: number): Promise<void> {
    await this.referansRepo.delete(id);
  }

  /**
   * Get referans report (kursiyer count, commission, etc.)
   */
  async getReferansRaporu(idReferans: number): Promise<ReferansRaporu | null> {
    const referans = await this.referansRepo.findById(idReferans);
    if (!referans) {
      return null;
    }

    // Get kursiyer count for this referans
    const { data: kursiyerler, error } = await supabase
      .from('kursiyer')
      .select('id, kayit_tarihi')
      .eq('id_referans', idReferans);

    if (error) {
      throw new Error(`Error getting kursiyer count: ${error.message}`);
    }

    const kursiyerSayisi = kursiyerler?.length || 0;
    const sonKursiyerTarihi = kursiyerler && kursiyerler.length > 0
      ? kursiyerler.sort((a: any, b: any) => 
          new Date(b.kayit_tarihi || 0).getTime() - new Date(a.kayit_tarihi || 0).getTime()
        )[0].kayit_tarihi
      : undefined;

    return {
      id_referans: referans.id,
      ref_adi: referans.ref_adi,
      ref_soyadi: referans.ref_soyadi,
      kursiyer_sayisi: kursiyerSayisi,
      son_kursiyer_tarihi: sonKursiyerTarihi,
    };
  }

  /**
   * Get all referans reports
   */
  async getAllReferansRaporu(): Promise<ReferansRaporu[]> {
    const referanslar = await this.referansRepo.findAll();
    const raporlar: ReferansRaporu[] = [];

    for (const referans of referanslar) {
      const rapor = await this.getReferansRaporu(referans.id);
      if (rapor) {
        raporlar.push(rapor);
      }
    }

    return raporlar.sort((a, b) => b.kursiyer_sayisi - a.kursiyer_sayisi);
  }
}

