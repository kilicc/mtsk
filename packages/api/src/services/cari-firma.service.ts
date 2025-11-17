import { CariFirmaRepository, CariFirma } from '../repositories/cari-firma.repository';

export class CariFirmaService {
  private repository: CariFirmaRepository;

  constructor() {
    this.repository = new CariFirmaRepository();
  }

  async getAllFirmalar(): Promise<CariFirma[]> {
    return this.repository.getAll();
  }

  async getFirmaById(id: number): Promise<CariFirma | null> {
    return this.repository.getById(id);
  }

  async createFirma(firma: Omit<CariFirma, 'id'>): Promise<CariFirma> {
    return this.repository.create(firma);
  }

  async updateFirma(id: number, firma: Partial<CariFirma>): Promise<CariFirma> {
    return this.repository.update(id, firma);
  }

  async deleteFirma(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}

