import { BaseRepository } from './base.repository';
import { KullaniciMesaji } from '@mtsk/shared';

export class KullaniciMesajlariRepository extends BaseRepository<KullaniciMesaji> {
  constructor() {
    super('kullanici_mesajlari');
  }

  /**
   * Find messages for a user (received messages)
   */
  async findByAlici(idAlici: number): Promise<KullaniciMesaji[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .or(`id_alici.eq.${idAlici},id_alici.is.null`) // User's messages or broadcast messages
      .eq('silindi', false)
      .order('gonderim_tarihi', { ascending: false });

    if (error) {
      throw new Error(`Error finding messages by alici: ${error.message}`);
    }

    return (data || []) as KullaniciMesaji[];
  }

  /**
   * Find unread messages for a user
   */
  async findUnreadByAlici(idAlici: number): Promise<KullaniciMesaji[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .or(`id_alici.eq.${idAlici},id_alici.is.null`)
      .eq('okundu', false)
      .eq('silindi', false)
      .order('gonderim_tarihi', { ascending: false });

    if (error) {
      throw new Error(`Error finding unread messages: ${error.message}`);
    }

    return (data || []) as KullaniciMesaji[];
  }

  /**
   * Find messages sent by a user
   */
  async findByGonderen(idGonderen: number): Promise<KullaniciMesaji[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_gonderen', idGonderen)
      .eq('silindi', false)
      .order('gonderim_tarihi', { ascending: false });

    if (error) {
      throw new Error(`Error finding messages by gonderen: ${error.message}`);
    }

    return (data || []) as KullaniciMesaji[];
  }

  /**
   * Mark message as read
   */
  async markAsRead(id: number): Promise<KullaniciMesaji> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update({ 
        okundu: true,
        okunma_tarihi: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error marking message as read: ${error.message}`);
    }

    return data as KullaniciMesaji;
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(idAlici: number): Promise<number> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .or(`id_alici.eq.${idAlici},id_alici.is.null`)
      .eq('okundu', false)
      .eq('silindi', false);

    if (error) {
      throw new Error(`Error getting unread count: ${error.message}`);
    }

    return count || 0;
  }
}

