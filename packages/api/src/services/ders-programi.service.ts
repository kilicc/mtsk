import {
  DersProgramiDireksiyonRepository,
  DersProgramiTeoriRepository,
  DersProgramiMebbisRepository,
} from '../repositories/ders-programi.repository';
import { DersProgramiDireksiyon, DersProgramiTeori, DersProgramiMebbis } from '@mtsk/shared';

export class DersProgramiService {
  private direksiyonRepo: DersProgramiDireksiyonRepository;
  private teoriRepo: DersProgramiTeoriRepository;
  private mebbisRepo: DersProgramiMebbisRepository;

  constructor() {
    this.direksiyonRepo = new DersProgramiDireksiyonRepository();
    this.teoriRepo = new DersProgramiTeoriRepository();
    this.mebbisRepo = new DersProgramiMebbisRepository();
  }

  // ========== Direksiyon Programı ==========

  /**
   * Get all direksiyon programs
   */
  async getAllDireksiyon(filters?: { id_grup?: number; id_personel?: number }): Promise<DersProgramiDireksiyon[]> {
    return this.direksiyonRepo.findAll(filters);
  }

  /**
   * Get direksiyon program by ID
   */
  async getDireksiyonById(id: number): Promise<DersProgramiDireksiyon | null> {
    return this.direksiyonRepo.findById(id);
  }

  /**
   * Get direksiyon programs by kursiyer
   */
  async getDireksiyonByKursiyer(idKursiyer: number): Promise<DersProgramiDireksiyon[]> {
    return this.direksiyonRepo.findByKursiyer(idKursiyer);
  }

  /**
   * Get direksiyon programs by personel
   */
  async getDireksiyonByPersonel(idPersonel: number): Promise<DersProgramiDireksiyon[]> {
    return this.direksiyonRepo.findByPersonel(idPersonel);
  }

  /**
   * Create direksiyon program
   */
  async createDireksiyon(program: Partial<DersProgramiDireksiyon>): Promise<DersProgramiDireksiyon> {
    if (!program.id_kursiyer) {
      throw new Error('Kursiyer ID zorunludur');
    }

    return this.direksiyonRepo.create(program);
  }

  /**
   * Update direksiyon program
   */
  async updateDireksiyon(id: number, updates: Partial<DersProgramiDireksiyon>): Promise<DersProgramiDireksiyon> {
    return this.direksiyonRepo.update(id, updates);
  }

  /**
   * Delete direksiyon program
   */
  async deleteDireksiyon(id: number): Promise<boolean> {
    return this.direksiyonRepo.delete(id);
  }

  // ========== Teori Programı ==========

  /**
   * Get all teori programs
   */
  async getAllTeori(filters?: { id_grup_karti?: number }): Promise<DersProgramiTeori[]> {
    return this.teoriRepo.findAll(filters);
  }

  /**
   * Get teori program by ID
   */
  async getTeoriById(id: number): Promise<DersProgramiTeori | null> {
    return this.teoriRepo.findById(id);
  }

  /**
   * Get teori programs by grup
   */
  async getTeoriByGrup(idGrupKarti: number): Promise<DersProgramiTeori[]> {
    return this.teoriRepo.findByGrupKarti(idGrupKarti);
  }

  /**
   * Create teori program
   */
  async createTeori(program: Partial<DersProgramiTeori>): Promise<DersProgramiTeori> {
    return this.teoriRepo.create(program);
  }

  /**
   * Update teori program
   */
  async updateTeori(id: number, updates: Partial<DersProgramiTeori>): Promise<DersProgramiTeori> {
    return this.teoriRepo.update(id, updates);
  }

  // ========== MEBBİS ==========

  /**
   * Get MEBBİS programs
   */
  async getMebbisPrograms(filters?: { ge_id_grup?: number }): Promise<DersProgramiMebbis[]> {
    return this.mebbisRepo.findAll(filters);
  }

  /**
   * Export to MEBBİS format
   */
  async exportToMebbis(idGrup: number): Promise<DersProgramiMebbis[]> {
    // Get direksiyon programs for this group
    const direksiyonPrograms = await this.direksiyonRepo.findByGrup(idGrup);

    // Convert to MEBBİS format
    const mebbisData: Partial<DersProgramiMebbis>[] = direksiyonPrograms.map((prog) => ({
      ge_id_grup: idGrup,
      ge_id_kurs: prog.id_kursiyer,
      ge_id_pers: prog.id_personel,
      ge_id_arac: prog.id_arac,
      ge_durumu: prog.durum || 1,
    }));

    // Create MEBBİS records
    const results: DersProgramiMebbis[] = [];
    for (const data of mebbisData) {
      const created = await this.mebbisRepo.create(data);
      results.push(created);
    }

    return results;
  }

  /**
   * Mark MEBBİS program as transferred
   */
  async markMebbisAsTransferred(id: number): Promise<DersProgramiMebbis> {
    return this.mebbisRepo.markAsTransferred(id);
  }
}

