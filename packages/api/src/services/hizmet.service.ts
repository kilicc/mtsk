import { HizmetRepository, Hizmet } from '../repositories/hizmet.repository';

export class HizmetService {
  private repository: HizmetRepository;

  constructor() {
    this.repository = new HizmetRepository();
  }

  async getAllHizmetler(): Promise<Hizmet[]> {
    return this.repository.getAll();
  }

  async getHizmetById(id: number): Promise<Hizmet | null> {
    return this.repository.getById(id);
  }

  async createHizmet(hizmet: Omit<Hizmet, 'id'>): Promise<Hizmet> {
    return this.repository.create(hizmet);
  }

  async updateHizmet(id: number, hizmet: Partial<Hizmet>): Promise<Hizmet> {
    return this.repository.update(id, hizmet);
  }

  async deleteHizmet(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}

