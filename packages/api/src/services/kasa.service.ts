import {
  KasaRepository,
  KasaIslemiRepository,
  KasaTransferRepository,
} from '../repositories/kasa.repository';
import type { Kasa, KasaIslemi, KasaTransfer, KasaToplamlari } from '@mtsk/shared';

export class KasaService {
  private kasaRepo = new KasaRepository();
  private kasaIslemiRepo = new KasaIslemiRepository();
  private kasaTransferRepo = new KasaTransferRepository();

  // Kasa CRUD
  async getAllKasas(): Promise<Kasa[]> {
    return this.kasaRepo.findActive();
  }

  async getKasaById(id: number): Promise<Kasa | null> {
    return this.kasaRepo.findWithBalance(id);
  }

  async createKasa(kasa: Omit<Kasa, 'id' | 'kayit_tarihi'>): Promise<Kasa> {
    return this.kasaRepo.create(kasa);
  }

  async updateKasa(id: number, updates: Partial<Kasa>): Promise<Kasa> {
    return this.kasaRepo.update(id, updates);
  }

  async deleteKasa(id: number): Promise<boolean> {
    return this.kasaRepo.delete(id);
  }

  // Kasa İşlemleri
  async createIslem(islem: Omit<KasaIslemi, 'id' | 'kayit_tarihi'>): Promise<KasaIslemi> {
    const created = await this.kasaIslemiRepo.create(islem);
    
    // Update kasa balance
    const kasa = await this.kasaRepo.findById(islem.id_kasa);
    if (kasa) {
      const yeniBakiye = islem.islem_tipi === 'giris'
        ? (kasa.bakiye || 0) + islem.tutar
        : (kasa.bakiye || 0) - islem.tutar;
      await this.kasaRepo.update(islem.id_kasa, { bakiye: yeniBakiye });
    }

    return created;
  }

  async getIslemlerByKasa(id_kasa: number, baslangic?: string, bitis?: string): Promise<KasaIslemi[]> {
    if (baslangic && bitis) {
      return this.kasaIslemiRepo.findByKasaAndDateRange(id_kasa, baslangic, bitis);
    }
    return this.kasaIslemiRepo.findAll({ id_kasa });
  }

  async getDailyTotals(id_kasa: number, tarih: string): Promise<{
    giris: number;
    cikis: number;
    bakiye: number;
  }> {
    return this.kasaIslemiRepo.getDailyTotals(id_kasa, tarih);
  }

  // Kasa Transfer
  async createTransfer(transfer: Omit<KasaTransfer, 'id' | 'kayit_tarihi'>): Promise<KasaTransfer> {
    return this.kasaTransferRepo.createTransfer(transfer);
  }

  async getTransfers(): Promise<KasaTransfer[]> {
    return this.kasaTransferRepo.findAll();
  }

  // Kasa Toplamları
  async getKasaToplamlari(tarih?: string): Promise<KasaToplamlari[]> {
    const kasas = await this.kasaRepo.findActive();
    const targetDate = tarih || new Date().toISOString().split('T')[0];

    const toplamlar: KasaToplamlari[] = [];

    for (const kasa of kasas) {
      const daily = await this.getDailyTotals(kasa.id, targetDate);
      const allIslemler = await this.kasaIslemiRepo.findAll({ id_kasa: kasa.id });

      let toplamGiris = 0;
      let toplamCikis = 0;

      allIslemler.forEach(islem => {
        if (islem.islem_tipi === 'giris') {
          toplamGiris += Number(islem.tutar);
        } else {
          toplamCikis += Number(islem.tutar);
        }
      });

      toplamlar.push({
        id_kasa: kasa.id,
        kasa_adi: kasa.kasa_adi,
        baslangic_bakiye: kasa.bakiye || 0,
        gunluk_giris: daily.giris,
        gunluk_cikis: daily.cikis,
        toplam_giris: toplamGiris,
        toplam_cikis: toplamCikis,
        bakiye: (kasa.bakiye || 0) + toplamGiris - toplamCikis,
      });
    }

    return toplamlar;
  }
}

