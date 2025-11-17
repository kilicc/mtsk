import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface CariFirma {
  id: number;
  firma_adi: string;
  yetkili_kisi?: string;
  telefon?: string;
  email?: string;
  adres?: string;
  vergi_no?: string;
  vergi_dairesi?: string;
  notlar?: string;
  akt?: number;
}

export class CariFirmaRepository {
  async getAll(): Promise<CariFirma[]> {
    const { data, error } = await supabase
      .from('cari_firma')
      .select('*')
      .eq('akt', 1)
      .order('firma_adi', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getById(id: number): Promise<CariFirma | null> {
    const { data, error } = await supabase
      .from('cari_firma')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(firma: Omit<CariFirma, 'id'>): Promise<CariFirma> {
    const { data, error } = await supabase
      .from('cari_firma')
      .insert({ ...firma, akt: 1 })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, firma: Partial<CariFirma>): Promise<CariFirma> {
    const { data, error } = await supabase
      .from('cari_firma')
      .update(firma)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('cari_firma')
      .update({ akt: 0 })
      .eq('id', id);

    if (error) throw error;
  }
}

