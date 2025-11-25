import { DonemSubeRepository, SinavTarihiRepository, DonemSube, SinavTarihi } from '../repositories/tanimlar.repository';

export class TanimlarService {
  private donemSubeRepo: DonemSubeRepository;
  private sinavTarihiRepo: SinavTarihiRepository;

  constructor() {
    this.donemSubeRepo = new DonemSubeRepository();
    this.sinavTarihiRepo = new SinavTarihiRepository();
  }

  // ========== Dönem Şube İşlemleri ==========
  async getAllDonemSube(): Promise<DonemSube[]> {
    try {
      return await this.donemSubeRepo.findAll();
    } catch (error: any) {
      console.error('Error getting all donem sube:', error);
      return [];
    }
  }

  async getDonemSubeById(id: number): Promise<DonemSube | null> {
    try {
      return await this.donemSubeRepo.findById(id);
    } catch (error: any) {
      console.error('Error getting donem sube by id:', error);
      return null;
    }
  }

  async createDonemSube(data: Partial<DonemSube>): Promise<DonemSube> {
    return await this.donemSubeRepo.create(data);
  }

  async updateDonemSube(id: number, data: Partial<DonemSube>): Promise<DonemSube> {
    return await this.donemSubeRepo.update(id, data);
  }

  async deleteDonemSube(id: number): Promise<boolean> {
    return await this.donemSubeRepo.delete(id);
  }

  // ========== Sınav Tarihi İşlemleri ==========
  async getAllSinavTarihi(): Promise<SinavTarihi[]> {
    try {
      return await this.sinavTarihiRepo.findAll();
    } catch (error: any) {
      console.error('Error getting all sinav tarihi:', error);
      return [];
    }
  }

  async getSinavTarihiById(id: number): Promise<SinavTarihi | null> {
    try {
      return await this.sinavTarihiRepo.findById(id);
    } catch (error: any) {
      console.error('Error getting sinav tarihi by id:', error);
      return null;
    }
  }

  async createSinavTarihi(data: Partial<SinavTarihi>): Promise<SinavTarihi> {
    return await this.sinavTarihiRepo.create(data);
  }

  async updateSinavTarihi(id: number, data: Partial<SinavTarihi>): Promise<SinavTarihi> {
    return await this.sinavTarihiRepo.update(id, data);
  }

  async deleteSinavTarihi(id: number): Promise<boolean> {
    return await this.sinavTarihiRepo.delete(id);
  }
}

