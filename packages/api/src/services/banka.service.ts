import { BankaRepository, BankaHesabi, BankaIslemi } from '../repositories/banka.repository';

export class BankaService {
  private repository: BankaRepository;

  constructor() {
    this.repository = new BankaRepository();
  }

  async getAllHesaplar(): Promise<BankaHesabi[]> {
    return this.repository.getAllHesaplar();
  }

  async getHesapById(id: number): Promise<BankaHesabi | null> {
    return this.repository.getHesapById(id);
  }

  async createHesap(hesap: Omit<BankaHesabi, 'id'>): Promise<BankaHesabi> {
    return this.repository.createHesap(hesap);
  }

  async getIslemler(filters?: { id_banka_hesabi?: number; tarih?: string }): Promise<BankaIslemi[]> {
    return this.repository.getIslemler(filters);
  }

  async createIslem(islem: Omit<BankaIslemi, 'id' | 'kayit_tarihi'>): Promise<BankaIslemi> {
    return this.repository.createIslem(islem);
  }
}

