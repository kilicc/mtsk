import { BaseRepository } from './base.repository';
import type { Kasa, KasaIslemi, KasaTransfer } from '@mtsk/shared';
import { supabase } from '../db/supabase';

export class KasaRepository extends BaseRepository<Kasa> {
  constructor() {
    super('kasa');
  }

  /**
   * Get kasa with current balance
   */
  async findWithBalance(id: number): Promise<Kasa | null> {
    const kasa = await this.findById(id);
    if (!kasa) return null;

    // Calculate current balance from transactions
    const { data: islemler, error } = await supabase
      .from('kasa_islemi')
      .select('islem_tipi, tutar')
      .eq('id_kasa', id);

    if (error) {
      throw new Error(`Error calculating balance: ${error.message}`);
    }

    let bakiye = kasa.bakiye || 0;
    if (islemler) {
      islemler.forEach(islem => {
        if (islem.islem_tipi === 'giris') {
          bakiye += Number(islem.tutar);
        } else {
          bakiye -= Number(islem.tutar);
        }
      });
    }

    return { ...kasa, bakiye };
  }

  /**
   * Get all active kasas
   */
  async findActive(): Promise<Kasa[]> {
    return this.findAll({ akt: 1 });
  }
}

export class KasaIslemiRepository extends BaseRepository<KasaIslemi> {
  constructor() {
    super('kasa_islemi');
  }

  /**
   * Get transactions by kasa and date range
   */
  async findByKasaAndDateRange(
    id_kasa: number,
    baslangic: Date | string,
    bitis: Date | string
  ): Promise<KasaIslemi[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id_kasa', id_kasa)
      .gte('islem_tarihi', baslangic)
      .lte('islem_tarihi', bitis)
      .order('islem_tarihi', { ascending: false });

    if (error) {
      throw new Error(`Error fetching transactions: ${error.message}`);
    }

    return (data || []) as KasaIslemi[];
  }

  /**
   * Get daily totals for a kasa
   */
  async getDailyTotals(id_kasa: number, tarih: Date | string): Promise<{
    giris: number;
    cikis: number;
    bakiye: number;
  }> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('islem_tipi, tutar')
      .eq('id_kasa', id_kasa)
      .eq('islem_tarihi', tarih);

    if (error) {
      throw new Error(`Error fetching daily totals: ${error.message}`);
    }

    let giris = 0;
    let cikis = 0;

    if (data) {
      data.forEach(islem => {
        if (islem.islem_tipi === 'giris') {
          giris += Number(islem.tutar);
        } else {
          cikis += Number(islem.tutar);
        }
      });
    }

    return { giris, cikis, bakiye: giris - cikis };
  }
}

export class KasaTransferRepository extends BaseRepository<KasaTransfer> {
  constructor() {
    super('kasa_transfer');
  }

  /**
   * Create transfer and update both kasas
   */
  async createTransfer(transfer: Omit<KasaTransfer, 'id' | 'kayit_tarihi'>): Promise<KasaTransfer> {
    // Start transaction-like operation
    const transferRecord = await this.create(transfer);

    // Update source kasa balance
    const { error: error1 } = await supabase.rpc('update_kasa_bakiye', {
      kasa_id: transfer.id_kaynak_kasa,
      tutar: -transfer.tutar
    });

    // Update target kasa balance
    const { error: error2 } = await supabase.rpc('update_kasa_bakiye', {
      kasa_id: transfer.id_hedef_kasa,
      tutar: transfer.tutar
    });

    if (error1 || error2) {
      // Rollback: delete transfer record
      await this.delete(transferRecord.id);
      throw new Error('Error updating kasa balances');
    }

    return transferRecord;
  }
}

