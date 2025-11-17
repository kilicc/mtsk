import { KullaniciYonetimi, KullaniciYetki } from '@mtsk/shared';
import { supabase } from '../db/supabase';

export class YetkilendirmeService {
  /**
   * Get all kullanici
   */
  async getAllKullanici(): Promise<KullaniciYonetimi[]> {
    const { data, error } = await supabase
      .from('kullanici')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw new Error(`Error getting kullanici: ${error.message}`);
    }

    const kullanicilar = (data || []) as KullaniciYonetimi[];

    // Get yetkiler for each kullanici
    for (const kullanici of kullanicilar) {
      const yetkiler = await this.getKullaniciYetkileri(kullanici.id);
      kullanici.yetkiler = yetkiler;
    }

    return kullanicilar;
  }

  /**
   * Get kullanici by ID
   */
  async getKullaniciById(id: number): Promise<KullaniciYonetimi | null> {
    const { data, error } = await supabase
      .from('kullanici')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error getting kullanici: ${error.message}`);
    }

    const kullanici = data as KullaniciYonetimi;
    kullanici.yetkiler = await this.getKullaniciYetkileri(id);

    return kullanici;
  }

  /**
   * Get kullanici yetkileri
   */
  async getKullaniciYetkileri(idKullanici: number): Promise<KullaniciYetki[]> {
    const { data, error } = await supabase
      .from('kullanici_yetkileri')
      .select('*')
      .eq('id', idKullanici);

    if (error) {
      throw new Error(`Error getting kullanici yetkileri: ${error.message}`);
    }

    return (data || []) as KullaniciYetki[];
  }

  /**
   * Update kullanici yetkileri
   */
  async updateKullaniciYetkileri(idKullanici: number, yetkiler: KullaniciYetki[]): Promise<void> {
    // Delete existing yetkiler
    const { error: deleteError } = await supabase
      .from('kullanici_yetkileri')
      .delete()
      .eq('id', idKullanici);

    if (deleteError) {
      throw new Error(`Error deleting existing yetkiler: ${deleteError.message}`);
    }

    // Insert new yetkiler
    if (yetkiler.length > 0) {
      const yetkilerToInsert = yetkiler.map((y) => ({
        id: idKullanici,
        parentid: y.parentid,
        yetki: y.yetki,
      }));

      const { error: insertError } = await supabase
        .from('kullanici_yetkileri')
        .insert(yetkilerToInsert);

      if (insertError) {
        throw new Error(`Error inserting yetkiler: ${insertError.message}`);
      }
    }
  }

  /**
   * Check if kullanici has permission
   */
  async hasPermission(idKullanici: number, parentid: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('kullanici_yetkileri')
      .select('yetki')
      .eq('id', idKullanici)
      .eq('parentid', parentid)
      .single();

    if (error || !data) {
      return false; // No permission if not found
    }

    return data.yetki === true;
  }
}

