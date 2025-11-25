import { BaseRepository } from './base.repository';
import { SMSTemplate, SMSGonderim } from '@mtsk/shared';
import { supabase } from '../db/supabase';

export class SMSTemplateRepository extends BaseRepository<SMSTemplate> {
  constructor() {
    super('param_sms_sablonlar');
  }

  /**
   * Find active templates
   */
  async findActive(): Promise<SMSTemplate[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('aktif', true)
      .order('baslik', { ascending: true });

    if (error) {
      throw new Error(`Error finding active SMS templates: ${error.message}`);
    }

    return (data || []) as SMSTemplate[];
  }
}

export class SMSGonderimRepository extends BaseRepository<SMSGonderim> {
  constructor() {
    super('sms_gonderim'); // Tablo adını kontrol et
  }

  /**
   * Find by kursiyer ID
   */
  async findByKursiyer(idKursiyer: number): Promise<SMSGonderim[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_kursiyer', idKursiyer)
      .order('gonderim_tarihi', { ascending: false });

    if (error) {
      throw new Error(`Error finding SMS by kursiyer: ${error.message}`);
    }

    return (data || []) as SMSGonderim[];
  }

  /**
   * Find by date range
   */
  async findByDateRange(baslangic: Date | string, bitis: Date | string): Promise<SMSGonderim[]> {
    const baslangicStr = typeof baslangic === 'string' ? baslangic : baslangic.toISOString().split('T')[0];
    const bitisStr = typeof bitis === 'string' ? bitis : bitis.toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .gte('gonderim_tarihi', baslangicStr)
      .lte('gonderim_tarihi', bitisStr)
      .order('gonderim_tarihi', { ascending: false });

    if (error) {
      throw new Error(`Error finding SMS by date range: ${error.message}`);
    }

    return (data || []) as SMSGonderim[];
  }

  /**
   * Find by status
   */
  async findByStatus(durum: number): Promise<SMSGonderim[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('durum', durum)
      .order('gonderim_tarihi', { ascending: false });

    if (error) {
      throw new Error(`Error finding SMS by status: ${error.message}`);
    }

    return (data || []) as SMSGonderim[];
  }
}

