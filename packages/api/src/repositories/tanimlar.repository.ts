import { BaseRepository } from './base.repository';
import { supabase } from '../db/supabase';

export interface DonemSube {
  id: number;
  kurs_tipi?: string;
  yil?: number;
  ay?: number;
  donem?: string;
  grup_adi?: string;
  sube_adi?: string;
  grup_baslangic_tarihi?: Date | string;
  ozel_kodu?: string;
}

export interface SinavTarihi {
  id: number;
  kurs_tipi?: string;
  sinav_tipi?: string;
  sinav_tarihi?: Date | string;
  akt?: number;
}

export class DonemSubeRepository extends BaseRepository<DonemSube> {
  constructor() {
    super('param_donem_sube');
  }
}

export class SinavTarihiRepository extends BaseRepository<SinavTarihi> {
  constructor() {
    super('sinav_tarihleri');
  }

  async findByKursTipi(kursTipi: string): Promise<SinavTarihi[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('kurs_tipi', kursTipi);
    if (error) throw new Error(`Error fetching sinav tarihi by kurs tipi: ${error.message}`);
    return (data || []) as SinavTarihi[];
  }

  async findBySinavTipi(sinavTipi: string): Promise<SinavTarihi[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('sinav_tipi', sinavTipi);
    if (error) throw new Error(`Error fetching sinav tarihi by sinav tipi: ${error.message}`);
    return (data || []) as SinavTarihi[];
  }
}

