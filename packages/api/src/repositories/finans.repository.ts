import { BaseRepository } from './base.repository';
import { Muhasebe, KursiyerFatura, OdemePlani } from '@mtsk/shared';

export class MuhasebeRepository extends BaseRepository<Muhasebe> {
  constructor() {
    super('muhasebe');
  }

  /**
   * Find by kursiyer ID
   */
  async findByKursiyer(idKursiyer: number): Promise<Muhasebe[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_kursiyer', idKursiyer);

    if (error) {
      throw new Error(`Error finding muhasebe by kursiyer: ${error.message}`);
    }

    return (data || []) as Muhasebe[];
  }

  /**
   * Find overdue payments (vade_tarihi < today)
   */
  async findOverdue(): Promise<Muhasebe[]> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .lt('vade_tarihi', today)
      .eq('kayit_durumu', 0); // Ödenmemiş

    if (error) {
      throw new Error(`Error finding overdue payments: ${error.message}`);
    }

    return (data || []) as Muhasebe[];
  }

  /**
   * Get total debt for kursiyer
   */
  async getTotalDebt(idKursiyer: number): Promise<number> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('tutar')
      .eq('id_kursiyer', idKursiyer)
      .eq('kayit_durumu', 0); // Ödenmemiş

    if (error) {
      throw new Error(`Error calculating total debt: ${error.message}`);
    }

    const total = (data || []).reduce((sum, item) => {
      const tutar = parseFloat(item.tutar || '0');
      return sum + (isNaN(tutar) ? 0 : tutar);
    }, 0);

    return total;
  }
}

export class KursiyerFaturaRepository extends BaseRepository<KursiyerFatura> {
  constructor() {
    super('kursiyer_fatura');
  }

  /**
   * Find by kursiyer ID
   */
  async findByKursiyer(idKursiyer: number): Promise<KursiyerFatura[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_kursiyer', idKursiyer);

    if (error) {
      throw new Error(`Error finding fatura by kursiyer: ${error.message}`);
    }

    return (data || []) as KursiyerFatura[];
  }
}

