import { BaseRepository } from './base.repository';
import { AracYakit } from '@mtsk/shared';

export class AracYakitRepository extends BaseRepository<AracYakit> {
  constructor() {
    super('arac_yakit');
  }

  /**
   * Find by arac ID
   */
  async findByArac(idArac: number): Promise<AracYakit[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_arac', idArac)
      .order('yakit_tarihi', { ascending: false });

    if (error) {
      throw new Error(`Error finding yakit by arac: ${error.message}`);
    }

    return (data || []) as AracYakit[];
  }

  /**
   * Find by date range
   */
  async findByDateRange(baslangicTarihi: string, bitisTarihi: string): Promise<AracYakit[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .gte('yakit_tarihi', baslangicTarihi)
      .lte('yakit_tarihi', bitisTarihi)
      .order('yakit_tarihi', { ascending: false });

    if (error) {
      throw new Error(`Error finding yakit by date range: ${error.message}`);
    }

    return (data || []) as AracYakit[];
  }

  /**
   * Get last fuel record for a vehicle
   */
  async getLastYakit(idArac: number): Promise<AracYakit | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_arac', idArac)
      .order('yakit_tarihi', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error getting last yakit: ${error.message}`);
    }

    return data as AracYakit;
  }
}

