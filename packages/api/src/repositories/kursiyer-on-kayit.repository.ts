import { BaseRepository } from './base.repository';
import { KursiyerOnKayit } from '@mtsk/shared';

export class KursiyerOnKayitRepository extends BaseRepository<KursiyerOnKayit> {
  constructor() {
    super('kursiyer_on_kayit');
  }

  /**
   * Find by status (durum)
   */
  async findByDurum(durum: number): Promise<KursiyerOnKayit[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('durum', durum)
      .order('gorusme_tarihi', { ascending: false });

    if (error) {
      throw new Error(`Error finding on kayit by durum: ${error.message}`);
    }

    return (data || []) as KursiyerOnKayit[];
  }

  /**
   * Find pending (durum = 0)
   */
  async findPending(): Promise<KursiyerOnKayit[]> {
    return this.findByDurum(0);
  }

  /**
   * Search by name
   */
  async searchByName(searchTerm: string): Promise<KursiyerOnKayit[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .or(`adi.ilike.%${searchTerm}%,soyadi.ilike.%${searchTerm}%`);

    if (error) {
      throw new Error(`Error searching on kayit: ${error.message}`);
    }

    return (data || []) as KursiyerOnKayit[];
  }

  /**
   * Find by phone
   */
  async findByTelefon(telefon: string): Promise<KursiyerOnKayit[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('telefon', telefon);

    if (error) {
      throw new Error(`Error finding on kayit by phone: ${error.message}`);
    }

    return (data || []) as KursiyerOnKayit[];
  }
}

