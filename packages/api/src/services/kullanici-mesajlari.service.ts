import { KullaniciMesaji } from '@mtsk/shared';
import { KullaniciMesajlariRepository } from '../repositories/kullanici-mesajlari.repository';

export class KullaniciMesajlariService {
  private mesajRepo: KullaniciMesajlariRepository;

  constructor() {
    this.mesajRepo = new KullaniciMesajlariRepository();
  }

  /**
   * Get messages for a user (received)
   */
  async getMessagesForUser(idAlici: number): Promise<KullaniciMesaji[]> {
    return this.mesajRepo.findByAlici(idAlici);
  }

  /**
   * Get unread messages for a user
   */
  async getUnreadMessages(idAlici: number): Promise<KullaniciMesaji[]> {
    return this.mesajRepo.findUnreadByAlici(idAlici);
  }

  /**
   * Get messages sent by a user
   */
  async getSentMessages(idGonderen: number): Promise<KullaniciMesaji[]> {
    return this.mesajRepo.findByGonderen(idGonderen);
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(idAlici: number): Promise<number> {
    return this.mesajRepo.getUnreadCount(idAlici);
  }

  /**
   * Create new message
   */
  async createMessage(mesaj: Partial<KullaniciMesaji>): Promise<KullaniciMesaji> {
    const newMesaj = {
      ...mesaj,
      okundu: false,
      silindi: false,
      gonderim_tarihi: mesaj.gonderim_tarihi || new Date().toISOString(),
    };
    return this.mesajRepo.create(newMesaj);
  }

  /**
   * Mark message as read
   */
  async markAsRead(id: number): Promise<KullaniciMesaji> {
    return this.mesajRepo.markAsRead(id);
  }

  /**
   * Delete message (soft delete)
   */
  async deleteMessage(id: number): Promise<void> {
    await this.mesajRepo.update(id, { silindi: true } as Partial<KullaniciMesaji>);
  }

  /**
   * Get message by ID
   */
  async getMessageById(id: number): Promise<KullaniciMesaji | null> {
    return this.mesajRepo.findById(id);
  }
}

