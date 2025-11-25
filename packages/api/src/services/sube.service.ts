import { SubeRepository } from '../repositories/sube.repository';
import { Sube } from '@mtsk/shared';

export class SubeService {
  private repository: SubeRepository;

  constructor() {
    this.repository = new SubeRepository();
  }

  /**
   * Get all subeler
   */
  async getAllSubeler(): Promise<Sube[]> {
    return await this.repository.findAll();
  }

  /**
   * Get sube by ID
   */
  async getSubeById(id: number): Promise<Sube | null> {
    return await this.repository.findById(id);
  }

  /**
   * Get kullanici's subeler
   */
  async getKullaniciSubeleri(kullaniciId: number): Promise<Sube[]> {
    return await this.repository.getKullaniciSubeleri(kullaniciId);
  }

  /**
   * Create sube
   */
  async createSube(sube: Partial<Sube>): Promise<Sube> {
    return await this.repository.create(sube);
  }

  /**
   * Update sube
   */
  async updateSube(id: number, sube: Partial<Sube>): Promise<Sube> {
    return await this.repository.update(id, sube);
  }

  /**
   * Delete sube
   */
  async deleteSube(id: number): Promise<void> {
    return await this.repository.delete(id);
  }
}

