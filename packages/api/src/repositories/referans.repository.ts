import { BaseRepository } from './base.repository';
import { Referans } from '@mtsk/shared';

export class ReferansRepository extends BaseRepository<Referans> {
  constructor() {
    super('referans_kart');
  }

  /**
   * Search by name
   */
  async searchByName(searchTerm: string): Promise<Referans[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .or(`ref_adi.ilike.%${searchTerm}%,ref_soyadi.ilike.%${searchTerm}%`);

    if (error) {
      throw new Error(`Error searching referans: ${error.message}`);
    }

    return (data || []) as Referans[];
  }

  /**
   * Find by ref_kod
   */
  async findByKod(refKod: number): Promise<Referans | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('ref_kod', refKod)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error finding referans by kod: ${error.message}`);
    }

    return data as Referans;
  }
}

