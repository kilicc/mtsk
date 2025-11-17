import { BaseRepository } from './base.repository';
import { KurumsalDersProgrami } from '@mtsk/shared';

export class KurumsalDersProgramiRepository extends BaseRepository<KurumsalDersProgrami> {
  constructor() {
    super('kursiyer_direksiyon'); // Mevcut tabloyu kullanıyoruz
  }

  /**
   * Find by kursiyer ID
   */
  async findByKursiyer(idKursiyer: number): Promise<KurumsalDersProgrami[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_kursiyer', idKursiyer)
      .order('tarih', { ascending: false });

    if (error) {
      throw new Error(`Error finding kurumsal ders by kursiyer: ${error.message}`);
    }

    return (data || []) as KurumsalDersProgrami[];
  }

  /**
   * Find by personel ID
   */
  async findByPersonel(idPersonel: number): Promise<KurumsalDersProgrami[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_personel', idPersonel)
      .order('tarih', { ascending: false });

    if (error) {
      throw new Error(`Error finding kurumsal ders by personel: ${error.message}`);
    }

    return (data || []) as KurumsalDersProgrami[];
  }

  /**
   * Find by arac ID
   */
  async findByArac(idArac: number): Promise<KurumsalDersProgrami[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_arac', idArac)
      .order('tarih', { ascending: false });

    if (error) {
      throw new Error(`Error finding kurumsal ders by arac: ${error.message}`);
    }

    return (data || []) as KurumsalDersProgrami[];
  }

  /**
   * Find by date range
   */
  async findByDateRange(baslangicTarihi: string, bitisTarihi: string): Promise<KurumsalDersProgrami[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .gte('tarih', baslangicTarihi)
      .lte('tarih', bitisTarihi)
      .order('tarih', { ascending: false });

    if (error) {
      throw new Error(`Error finding kurumsal ders by date range: ${error.message}`);
    }

    return (data || []) as KurumsalDersProgrami[];
  }

  /**
   * Find upcoming lessons
   */
  async findUpcoming(daysAhead: number = 30): Promise<KurumsalDersProgrami[]> {
    const today = new Date().toISOString().split('T')[0];
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    const targetDateStr = targetDate.toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .gte('tarih', today)
      .lte('tarih', targetDateStr)
      .order('tarih', { ascending: true });

    if (error) {
      throw new Error(`Error finding upcoming lessons: ${error.message}`);
    }

    return (data || []) as KurumsalDersProgrami[];
  }
}

