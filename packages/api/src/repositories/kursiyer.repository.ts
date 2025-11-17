import { BaseRepository } from './base.repository';
import { Kursiyer } from '@mtsk/shared';

export class KursiyerRepository extends BaseRepository<Kursiyer> {
  constructor() {
    super('kursiyer');
  }

  /**
   * Find kursiyer by TC Kimlik
   */
  async findByTcKimlik(tcKimlik: string): Promise<Kursiyer | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('tc_kimlik', tcKimlik)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error finding kursiyer by TC: ${error.message}`);
    }

    return data as Kursiyer;
  }

  /**
   * Find kursiyer by phone
   */
  async findByTelefon(telefon: string): Promise<Kursiyer[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('telefon', telefon);

    if (error) {
      throw new Error(`Error finding kursiyer by phone: ${error.message}`);
    }

    return (data || []) as Kursiyer[];
  }

  /**
   * Search kursiyer by name
   */
  async searchByName(searchTerm: string): Promise<Kursiyer[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .or(`adi.ilike.%${searchTerm}%,soyadi.ilike.%${searchTerm}%`);

    if (error) {
      throw new Error(`Error searching kursiyer: ${error.message}`);
    }

    return (data || []) as Kursiyer[];
  }

  /**
   * Get active kursiyerler (durum = 1 or similar)
   */
  async findActive(): Promise<Kursiyer[]> {
    return this.findAll({ durum: 1 });
  }
}

