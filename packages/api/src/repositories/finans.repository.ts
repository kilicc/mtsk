import { BaseRepository } from './base.repository';
import { Muhasebe, KursiyerFatura, OdemePlani } from '@mtsk/shared';
import { supabase } from '../db/supabase';

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

export class OdemePlaniRepository extends BaseRepository<OdemePlani> {
  constructor() {
    super('odeme_plani');
  }

  /**
   * Find by kursiyer ID
   */
  async findByKursiyer(idKursiyer: number): Promise<OdemePlani[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_kursiyer', idKursiyer)
      .order('taksit_no', { ascending: true });

    if (error) {
      throw new Error(`Error finding odeme plani by kursiyer: ${error.message}`);
    }

    // Map database fields to interface
    return (data || []).map((item: any) => ({
      id: item.id,
      id_kursiyer: item.id_kursiyer,
      taksit_no: item.taksit_no,
      tutar: parseFloat(item.tutar || '0'),
      vade_tarihi: item.son_odeme_tarihi, // Map son_odeme_tarihi to vade_tarihi
      odeme_tarihi: item.odeme_tarihi,
      odeme_durumu: item.durum === 'odendi' ? 1 : 0,
      odeme_tipi: item.odeme_yontemi,
    })) as OdemePlani[];
  }

  /**
   * Create multiple payment plan items (taksitler)
   */
  async createPlanItems(items: Partial<OdemePlani>[]): Promise<OdemePlani[]> {
    const mappedItems = items.map((item) => ({
      id_kursiyer: item.id_kursiyer!,
      taksit_no: item.taksit_no!,
      tutar: item.tutar!.toString(),
      son_odeme_tarihi: item.vade_tarihi, // Map vade_tarihi to son_odeme_tarihi
      durum: 'beklemede',
      odeme_yontemi: item.odeme_tipi,
    }));

    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(mappedItems)
      .select();

    if (error) {
      throw new Error(`Error creating odeme plani: ${error.message}`);
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      id_kursiyer: item.id_kursiyer,
      taksit_no: item.taksit_no,
      tutar: parseFloat(item.tutar || '0'),
      vade_tarihi: item.son_odeme_tarihi,
      odeme_tarihi: item.odeme_tarihi,
      odeme_durumu: item.durum === 'odendi' ? 1 : 0,
      odeme_tipi: item.odeme_yontemi,
    })) as OdemePlani[];
  }

  /**
   * Mark payment as paid
   */
  async markAsPaid(id: number, odemeTarihi?: Date | string): Promise<OdemePlani> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({
        durum: 'odendi',
        odeme_tarihi: odemeTarihi || new Date().toISOString().split('T')[0],
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error marking payment as paid: ${error.message}`);
    }

    return {
      id: data.id,
      id_kursiyer: data.id_kursiyer,
      taksit_no: data.taksit_no,
      tutar: parseFloat(data.tutar || '0'),
      vade_tarihi: data.son_odeme_tarihi,
      odeme_tarihi: data.odeme_tarihi,
      odeme_durumu: 1,
      odeme_tipi: data.odeme_yontemi,
    } as OdemePlani;
  }
}

