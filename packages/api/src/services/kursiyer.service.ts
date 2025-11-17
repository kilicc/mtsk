import { KursiyerRepository } from '../repositories/kursiyer.repository';
import { Kursiyer } from '@mtsk/shared';

export class KursiyerService {
  private repository: KursiyerRepository;

  constructor() {
    this.repository = new KursiyerRepository();
  }

  /**
   * Get all kursiyerler
   */
  async getAll(filters?: { durum?: number; id_grup?: number }): Promise<Kursiyer[]> {
    return this.repository.findAll(filters);
  }

  /**
   * Get kursiyer by ID
   */
  async getById(id: number): Promise<Kursiyer | null> {
    return this.repository.findById(id);
  }

  /**
   * Create new kursiyer
   */
  async create(kursiyer: Partial<Kursiyer>): Promise<Kursiyer> {
    // Validation
    if (!kursiyer.adi || !kursiyer.soyadi) {
      throw new Error('Ad ve soyad zorunludur');
    }

    // Check if TC Kimlik already exists
    if (kursiyer.tc_kimlik) {
      const existing = await this.repository.findByTcKimlik(kursiyer.tc_kimlik);
      if (existing) {
        throw new Error('Bu TC Kimlik numarası ile kayıtlı kursiyer mevcut');
      }
    }

    // Set default values
    const newKursiyer: Partial<Kursiyer> = {
      ...kursiyer,
      kayit_tarihi: kursiyer.kayit_tarihi || new Date().toISOString(),
      durum: kursiyer.durum ?? 1,
    };

    return this.repository.create(newKursiyer);
  }

  /**
   * Update kursiyer
   */
  async update(id: number, updates: Partial<Kursiyer>): Promise<Kursiyer> {
    // Check if TC Kimlik is being changed and already exists
    if (updates.tc_kimlik) {
      const existing = await this.repository.findByTcKimlik(updates.tc_kimlik);
      if (existing && existing.id !== id) {
        throw new Error('Bu TC Kimlik numarası başka bir kursiyere ait');
      }
    }

    return this.repository.update(id, updates);
  }

  /**
   * Delete kursiyer (soft delete - set durum to 0 or silme_tarihi)
   */
  async delete(id: number): Promise<boolean> {
    // Soft delete - update durum instead of hard delete
    await this.repository.update(id, {
      durum: 0,
      silme_tarihi: new Date().toISOString(),
    } as Partial<Kursiyer>);
    return true;
  }

  /**
   * Search kursiyer by name
   */
  async search(searchTerm: string): Promise<Kursiyer[]> {
    return this.repository.searchByName(searchTerm);
  }

  /**
   * Get active kursiyerler
   */
  async getActive(): Promise<Kursiyer[]> {
    return this.repository.findActive();
  }

  /**
   * Get kursiyer by TC Kimlik
   */
  async getByTcKimlik(tcKimlik: string): Promise<Kursiyer | null> {
    return this.repository.findByTcKimlik(tcKimlik);
  }
}

