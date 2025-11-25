import { supabase } from '../db/supabase';
import { Sube, KullaniciSube } from '@mtsk/shared';

export class SubeRepository {
  /**
   * Get all subeler
   */
  async findAll(): Promise<Sube[]> {
    const { data, error } = await supabase
      .from('sube')
      .select('*')
      .eq('akt', true)
      .order('adi', { ascending: true });

    if (error) {
      throw new Error(`Error getting subeler: ${error.message}`);
    }

    return (data || []) as Sube[];
  }

  /**
   * Get sube by ID
   */
  async findById(id: number): Promise<Sube | null> {
    const { data, error } = await supabase
      .from('sube')
      .select('*')
      .eq('id', id)
      .eq('akt', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error getting sube: ${error.message}`);
    }

    return data as Sube;
  }

  /**
   * Get kullanici's subeler
   */
  async getKullaniciSubeleri(kullaniciId: number): Promise<Sube[]> {
    const { data, error } = await supabase
      .from('kullanici_sube')
      .select(`
        id_sube,
        varsayilan,
        sube:sube(*)
      `)
      .eq('id_kullanici', kullaniciId);

    if (error) {
      throw new Error(`Error getting kullanici subeleri: ${error.message}`);
    }

    const subeler = (data || []).map((item: any) => ({
      ...item.sube,
      varsayilan: item.varsayilan,
    })) as Sube[];

    return subeler;
  }

  /**
   * Create sube
   */
  async create(sube: Partial<Sube>): Promise<Sube> {
    const { data, error } = await supabase
      .from('sube')
      .insert(sube)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating sube: ${error.message}`);
    }

    return data as Sube;
  }

  /**
   * Update sube
   */
  async update(id: number, sube: Partial<Sube>): Promise<Sube> {
    const { data, error } = await supabase
      .from('sube')
      .update(sube)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating sube: ${error.message}`);
    }

    return data as Sube;
  }

  /**
   * Delete sube (soft delete)
   */
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('sube')
      .update({ akt: false })
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting sube: ${error.message}`);
    }
  }
}

