import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Hizmet {
  id: number;
  hizmet_adi: string;
  hizmet_tipi?: string;
  birim_fiyat?: number;
  aciklama?: string;
  akt?: number;
}

export class HizmetRepository {
  async getAll(): Promise<Hizmet[]> {
    const { data, error } = await supabase
      .from('hizmet')
      .select('*')
      .eq('akt', 1)
      .order('hizmet_adi', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getById(id: number): Promise<Hizmet | null> {
    const { data, error } = await supabase
      .from('hizmet')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(hizmet: Omit<Hizmet, 'id'>): Promise<Hizmet> {
    const { data, error } = await supabase
      .from('hizmet')
      .insert({ ...hizmet, akt: 1 })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, hizmet: Partial<Hizmet>): Promise<Hizmet> {
    const { data, error } = await supabase
      .from('hizmet')
      .update(hizmet)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('hizmet')
      .update({ akt: 0 })
      .eq('id', id);

    if (error) throw error;
  }
}

