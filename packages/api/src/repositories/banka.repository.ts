import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface BankaHesabi {
  id: number;
  banka_adi: string;
  hesap_adi?: string;
  hesap_no?: string;
  iban?: string;
  sube_adi?: string;
  sube_kodu?: string;
  bakiye?: number;
  notlar?: string;
  akt?: number;
}

export interface BankaIslemi {
  id: number;
  id_banka_hesabi: number;
  islem_tarihi: Date | string;
  islem_tipi: 'giris' | 'cikis';
  tutar: number;
  aciklama?: string;
  id_kursiyer?: number;
  id_fatura?: number;
  kayit_tarihi?: Date | string;
}

export class BankaRepository {
  async getAllHesaplar(): Promise<BankaHesabi[]> {
    const { data, error } = await supabase
      .from('banka_hesabi')
      .select('*')
      .eq('akt', 1)
      .order('banka_adi', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getHesapById(id: number): Promise<BankaHesabi | null> {
    const { data, error } = await supabase
      .from('banka_hesabi')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createHesap(hesap: Omit<BankaHesabi, 'id'>): Promise<BankaHesabi> {
    const { data, error } = await supabase
      .from('banka_hesabi')
      .insert({ ...hesap, akt: 1 })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getIslemler(filters?: { id_banka_hesabi?: number; tarih?: string }): Promise<BankaIslemi[]> {
    let query = supabase
      .from('banka_islemi')
      .select('*')
      .order('islem_tarihi', { ascending: false });

    if (filters?.id_banka_hesabi) {
      query = query.eq('id_banka_hesabi', filters.id_banka_hesabi);
    }

    if (filters?.tarih) {
      query = query.eq('islem_tarihi', filters.tarih);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async createIslem(islem: Omit<BankaIslemi, 'id' | 'kayit_tarihi'>): Promise<BankaIslemi> {
    const { data, error } = await supabase
      .from('banka_islemi')
      .insert({ ...islem, kayit_tarihi: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

