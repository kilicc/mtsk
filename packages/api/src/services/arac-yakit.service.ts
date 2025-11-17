import { AracYakit, AracYakitRaporu } from '@mtsk/shared';
import { AracYakitRepository } from '../repositories/arac-yakit.repository';
import { AracRepository } from '../repositories/arac-personel.repository';
import { supabase } from '../db/supabase';

export class AracYakitService {
  private yakitRepo: AracYakitRepository;
  private aracRepo: AracRepository;

  constructor() {
    this.yakitRepo = new AracYakitRepository();
    this.aracRepo = new AracRepository();
  }

  /**
   * Get all fuel records
   */
  async getAllYakit(filters?: {
    id_arac?: number;
    baslangic_tarihi?: string;
    bitis_tarihi?: string;
  }): Promise<AracYakit[]> {
    if (filters?.id_arac) {
      return this.yakitRepo.findByArac(filters.id_arac);
    }
    if (filters?.baslangic_tarihi && filters?.bitis_tarihi) {
      return this.yakitRepo.findByDateRange(filters.baslangic_tarihi, filters.bitis_tarihi);
    }
    return this.yakitRepo.findAll();
  }

  /**
   * Get fuel record by ID
   */
  async getYakitById(id: number): Promise<AracYakit | null> {
    return this.yakitRepo.findById(id);
  }

  /**
   * Create new fuel record
   */
  async createYakit(yakit: Partial<AracYakit>): Promise<AracYakit> {
    // Calculate km_fark and litre_basina_km if km_baslangic and km_bitis are provided
    if (yakit.km_baslangic && yakit.km_bitis) {
      yakit.km_fark = yakit.km_bitis - yakit.km_baslangic;
      if (yakit.yakit_miktari && yakit.yakit_miktari > 0) {
        yakit.litre_basina_km = Number((yakit.km_fark / yakit.yakit_miktari).toFixed(2));
      }
    }

    // Get last fuel record to auto-fill km_baslangic
    if (!yakit.km_baslangic && yakit.id_arac) {
      const lastYakit = await this.yakitRepo.getLastYakit(yakit.id_arac);
      if (lastYakit && lastYakit.km_bitis) {
        yakit.km_baslangic = lastYakit.km_bitis;
        if (yakit.km_bitis) {
          yakit.km_fark = yakit.km_bitis - yakit.km_baslangic;
          if (yakit.yakit_miktari && yakit.yakit_miktari > 0) {
            yakit.litre_basina_km = Number((yakit.km_fark / yakit.yakit_miktari).toFixed(2));
          }
        }
      }
    }

    return this.yakitRepo.create(yakit);
  }

  /**
   * Update fuel record
   */
  async updateYakit(id: number, updates: Partial<AracYakit>): Promise<AracYakit> {
    // Recalculate if km values changed
    if (updates.km_baslangic !== undefined || updates.km_bitis !== undefined || updates.yakit_miktari !== undefined) {
      const existing = await this.yakitRepo.findById(id);
      if (existing) {
        const kmBaslangic = updates.km_baslangic ?? existing.km_baslangic;
        const kmBitis = updates.km_bitis ?? existing.km_bitis;
        const yakitMiktari = updates.yakit_miktari ?? existing.yakit_miktari;

        if (kmBaslangic && kmBitis) {
          updates.km_fark = kmBitis - kmBaslangic;
          if (yakitMiktari && yakitMiktari > 0) {
            updates.litre_basina_km = Number((updates.km_fark / yakitMiktari).toFixed(2));
          }
        }
      }
    }

    return this.yakitRepo.update(id, updates);
  }

  /**
   * Delete fuel record
   */
  async deleteYakit(id: number): Promise<void> {
    await this.yakitRepo.delete(id);
  }

  /**
   * Get fuel history for a vehicle
   */
  async getYakitGecmisi(idArac: number): Promise<AracYakit[]> {
    return this.yakitRepo.findByArac(idArac);
  }

  /**
   * Get fuel report for a vehicle
   */
  async getYakitRaporu(idArac: number): Promise<AracYakitRaporu | null> {
    const arac = await this.aracRepo.findById(idArac);
    if (!arac) {
      return null;
    }

    const yakitKayitlari = await this.yakitRepo.findByArac(idArac);
    
    if (yakitKayitlari.length === 0) {
      return {
        id_arac: idArac,
        plaka: arac.plaka,
        toplam_yakit_tutari: 0,
        toplam_yakit_miktari: 0,
        toplam_km: 0,
        ortalama_litre_basina_km: 0,
        ortalama_yakit_fiyati: 0,
        kayit_sayisi: 0,
      };
    }

    const toplamYakitTutari = yakitKayitlari.reduce((sum, y) => sum + (y.yakit_tutari || 0), 0);
    const toplamYakitMiktari = yakitKayitlari.reduce((sum, y) => sum + (y.yakit_miktari || 0), 0);
    const toplamKm = yakitKayitlari.reduce((sum, y) => sum + (y.km_fark || 0), 0);
    const ortalamaLitreBasinaKm = toplamYakitMiktari > 0 
      ? Number((toplamKm / toplamYakitMiktari).toFixed(2))
      : 0;
    const ortalamaYakitFiyati = toplamYakitMiktari > 0
      ? Number((toplamYakitTutari / toplamYakitMiktari).toFixed(2))
      : 0;

    const sonYakit = yakitKayitlari[0];

    return {
      id_arac: idArac,
      plaka: arac.plaka,
      toplam_yakit_tutari: toplamYakitTutari,
      toplam_yakit_miktari: toplamYakitMiktari,
      toplam_km: toplamKm,
      ortalama_litre_basina_km: ortalamaLitreBasinaKm,
      ortalama_yakit_fiyati: ortalamaYakitFiyati,
      son_yakit_tarihi: sonYakit.yakit_tarihi,
      kayit_sayisi: yakitKayitlari.length,
    };
  }

  /**
   * Get fuel reports for all vehicles
   */
  async getAllYakitRaporu(): Promise<AracYakitRaporu[]> {
    const araclar = await this.aracRepo.findActive();
    const raporlar: AracYakitRaporu[] = [];

    for (const arac of araclar) {
      const rapor = await this.getYakitRaporu(arac.id);
      if (rapor) {
        raporlar.push(rapor);
      }
    }

    return raporlar.sort((a, b) => b.toplam_yakit_tutari - a.toplam_yakit_tutari);
  }
}

