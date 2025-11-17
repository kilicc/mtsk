import { BaseRepository } from './base.repository';
import { Arac, Personel, AracBakim, AracDurumRaporu } from '@mtsk/shared';
import { supabase } from '../db/supabase';

export class AracRepository extends BaseRepository<Arac> {
  constructor() {
    super('arac');
  }

  /**
   * Find by plaka
   */
  async findByPlaka(plaka: string): Promise<Arac | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('plaka', plaka)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error finding arac by plaka: ${error.message}`);
    }

    return data as Arac;
  }

  /**
   * Find active vehicles (akt = 1)
   */
  async findActive(): Promise<Arac[]> {
    return this.findAll({ akt: 1 });
  }

  /**
   * Get vehicles needing maintenance (muayene_tar approaching)
   */
  async findMaintenanceDue(daysAhead: number = 30): Promise<Arac[]> {
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + daysAhead);

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .lte('muayene_tar', targetDate.toISOString().split('T')[0])
      .gte('muayene_tar', today.toISOString().split('T')[0])
      .eq('akt', 1);

    if (error) {
      throw new Error(`Error finding maintenance due vehicles: ${error.message}`);
    }

    return (data || []) as Arac[];
  }

  /**
   * Get vehicles with insurance expiring soon
   */
  async findInsuranceExpiring(daysAhead: number = 30): Promise<Arac[]> {
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + daysAhead);

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .lte('sigorta_bit_tar', targetDate.toISOString().split('T')[0])
      .gte('sigorta_bit_tar', today.toISOString().split('T')[0])
      .eq('akt', 1);

    if (error) {
      throw new Error(`Error finding insurance expiring vehicles: ${error.message}`);
    }

    return (data || []) as Arac[];
  }

  /**
   * Get vehicle status report
   */
  async getStatusReport(): Promise<AracDurumRaporu[]> {
    const vehicles = await this.findActive();
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    return vehicles.map(vehicle => {
      const sigortaBit = vehicle.sigorta_bit_tar ? new Date(vehicle.sigorta_bit_tar) : null;
      const muayeneTar = vehicle.muhayene_tar ? new Date(vehicle.muhayene_tar) : null;
      const kaskoBit = vehicle.kasko_bit_tar ? new Date(vehicle.kasko_bit_tar) : null;

      const sigortaKalanGun = sigortaBit 
        ? Math.ceil((sigortaBit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        : undefined;
      const muayeneKalanGun = muayeneTar
        ? Math.ceil((muayeneTar.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        : undefined;
      const kaskoKalanGun = kaskoBit
        ? Math.ceil((kaskoBit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        : undefined;

      return {
        id_arac: vehicle.id,
        plaka: vehicle.plaka,
        kullanımda: vehicle.akt === 1,
        bakimda: false, // TODO: Implement bakim status
        sigorta_yaklasan: sigortaKalanGun !== undefined && sigortaKalanGun <= 30 && sigortaKalanGun >= 0,
        muayene_yaklasan: muayeneKalanGun !== undefined && muayeneKalanGun <= 30 && muayeneKalanGun >= 0,
        kasko_yaklasan: kaskoKalanGun !== undefined && kaskoKalanGun <= 30 && kaskoKalanGun >= 0,
        sigorta_kalan_gun: sigortaKalanGun,
        muayene_kalan_gun: muayeneKalanGun,
        kasko_kalan_gun: kaskoKalanGun,
      };
    });
  }
}

export class PersonelRepository extends BaseRepository<Personel> {
  constructor() {
    super('personel');
  }

  /**
   * Find by personel_no
   */
  async findByPersonelNo(personelNo: number): Promise<Personel | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('personel_no', personelNo)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error finding personel by no: ${error.message}`);
    }

    return data as Personel;
  }

  /**
   * Search by name
   */
  async searchByName(searchTerm: string): Promise<Personel[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .or(`adi.ilike.%${searchTerm}%,soyadi.ilike.%${searchTerm}%`);

    if (error) {
      throw new Error(`Error searching personel: ${error.message}`);
    }

    return (data || []) as Personel[];
  }

  /**
   * Find active personnel (akt = 1)
   */
  async findActive(): Promise<Personel[]> {
    return this.findAll({ akt: 1 });
  }

  /**
   * Find by gorev
   */
  async findByGorev(gorev: string): Promise<Personel[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('gorev', gorev)
      .eq('akt', 1);

    if (error) {
      throw new Error(`Error finding personel by gorev: ${error.message}`);
    }

    return (data || []) as Personel[];
  }
}

export class AracBakimRepository extends BaseRepository<AracBakim> {
  constructor() {
    super('arac_bakim');
  }

  /**
   * Find by arac ID
   */
  async findByArac(idArac: number): Promise<AracBakim[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_arac', idArac)
      .order('bakim_tarihi', { ascending: false });

    if (error) {
      throw new Error(`Error finding bakim by arac: ${error.message}`);
    }

    return (data || []) as AracBakim[];
  }

  /**
   * Find upcoming maintenance (sonraki_bakim_tarihi approaching)
   */
  async findUpcoming(daysAhead: number = 30): Promise<AracBakim[]> {
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + daysAhead);

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .lte('sonraki_bakim_tarihi', targetDate.toISOString().split('T')[0])
      .gte('sonraki_bakim_tarihi', today.toISOString().split('T')[0]);

    if (error) {
      throw new Error(`Error finding upcoming maintenance: ${error.message}`);
    }

    return (data || []) as AracBakim[];
  }
}

