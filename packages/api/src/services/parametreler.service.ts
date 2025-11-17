import { GenelParametreler, SMSParametreleri } from '@mtsk/shared';
import { supabase } from '../db/supabase';

export class ParametrelerService {
  /**
   * Get genel parametreler
   */
  async getGenelParametreler(): Promise<GenelParametreler | null> {
    const { data, error } = await supabase
      .from('param_genel_parametreler')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error getting genel parametreler: ${error.message}`);
    }

    return data as GenelParametreler;
  }

  /**
   * Update genel parametreler
   */
  async updateGenelParametreler(updates: Partial<GenelParametreler>): Promise<GenelParametreler> {
    // Get existing or create new
    const existing = await this.getGenelParametreler();
    
    if (existing) {
      const { data, error } = await supabase
        .from('param_genel_parametreler')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating genel parametreler: ${error.message}`);
      }

      return data as GenelParametreler;
    } else {
      const { data, error } = await supabase
        .from('param_genel_parametreler')
        .insert(updates)
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating genel parametreler: ${error.message}`);
      }

      return data as GenelParametreler;
    }
  }

  /**
   * Get SMS parametreleri
   */
  async getSMSParametreleri(): Promise<SMSParametreleri | null> {
    const { data, error } = await supabase
      .from('param_sms_ayarlari')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error getting SMS parametreleri: ${error.message}`);
    }

    return data as SMSParametreleri;
  }

  /**
   * Update SMS parametreleri
   */
  async updateSMSParametreleri(updates: Partial<SMSParametreleri>): Promise<SMSParametreleri> {
    const existing = await this.getSMSParametreleri();
    
    if (existing) {
      const { data, error } = await supabase
        .from('param_sms_ayarlari')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating SMS parametreleri: ${error.message}`);
      }

      return data as SMSParametreleri;
    } else {
      const { data, error } = await supabase
        .from('param_sms_ayarlari')
        .insert(updates)
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating SMS parametreleri: ${error.message}`);
      }

      return data as SMSParametreleri;
    }
  }
}

