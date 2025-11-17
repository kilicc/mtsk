import { SMSGonderim, SMSTemplate, TopluSMS, BorcSMS } from '@mtsk/shared';
import { FinansService } from './finans.service';
import { KursiyerRepository } from '../repositories/kursiyer.repository';

/**
 * SMS Service
 * 
 * Note: This is a placeholder implementation.
 * In production, integrate with a real SMS provider API (e.g., NetGSM, İleti Merkezi, etc.)
 */
export class SMSService {
  private finansService: FinansService;
  private kursiyerRepo: KursiyerRepository;

  constructor() {
    this.finansService = new FinansService();
    this.kursiyerRepo = new KursiyerRepository();
  }

  /**
   * Send SMS to a single phone number
   */
  async sendSMS(telefon: string, mesaj: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // TODO: Integrate with real SMS provider API
    // Example: NetGSM, İleti Merkezi, etc.
    
    // Validate phone number (Turkish format)
    const cleanPhone = this.cleanPhoneNumber(telefon);
    if (!this.isValidPhoneNumber(cleanPhone)) {
      return { success: false, error: 'Geçersiz telefon numarası' };
    }

    // Simulate SMS sending (replace with real API call)
    console.log(`[SMS] Sending to ${cleanPhone}: ${mesaj.substring(0, 50)}...`);
    
    // In production, make API call here:
    // const response = await fetch('https://api.sms-provider.com/send', {
    //   method: 'POST',
    //   headers: { 'Authorization': `Bearer ${API_KEY}` },
    //   body: JSON.stringify({ phone: cleanPhone, message: mesaj })
    // });

    // For now, return success
    return {
      success: true,
      messageId: `MSG_${Date.now()}`,
    };
  }

  /**
   * Send bulk SMS to multiple phone numbers
   */
  async sendBulkSMS(telefonlar: string[], mesaj: string): Promise<{ success: number; failed: number; errors: string[] }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const telefon of telefonlar) {
      try {
        const result = await this.sendSMS(telefon, mesaj);
        if (result.success) {
          success++;
        } else {
          failed++;
          errors.push(`${telefon}: ${result.error}`);
        }
        // Rate limiting: wait 100ms between messages
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error: any) {
        failed++;
        errors.push(`${telefon}: ${error.message}`);
      }
    }

    return { success, failed, errors };
  }

  /**
   * Send debt reminder SMS to kursiyerler with overdue payments
   */
  async sendDebtReminderSMS(): Promise<{ success: number; failed: number }> {
    const borcRaporu = await this.finansService.getDebtReport();
    const gecikmeliBorc = borcRaporu.filter(b => (b.gecikme_gunu || 0) > 0);

    if (gecikmeliBorc.length === 0) {
      return { success: 0, failed: 0 };
    }

    const telefonlar: string[] = [];
    const mesajlar: Map<string, string> = new Map();

    for (const borc of gecikmeliBorc) {
      // Get kursiyer phone number from kursiyer table
      try {
        const kursiyer = await this.kursiyerRepo.findById(borc.id_kursiyer);
        if (!kursiyer || !kursiyer.telefon) {
          continue; // Skip if no kursiyer or no phone
        }

        const telefon = kursiyer.telefon;
        if (this.isValidPhoneNumber(this.cleanPhoneNumber(telefon))) {
          telefonlar.push(telefon);
          const borcSMS: BorcSMS = {
            id_kursiyer: borc.id_kursiyer,
            telefon: telefon,
            adi: borc.kursiyer_adi,
            soyadi: borc.kursiyer_soyadi,
            borc_tutari: borc.toplam_borc,
            vade_tarihi: borc.vade_tarihi,
            gecikme_gunu: borc.gecikme_gunu,
          };
          mesajlar.set(telefon, this.generateDebtSMSMessage(borcSMS));
        }
      } catch (error) {
        console.error(`Error fetching kursiyer ${borc.id_kursiyer}:`, error);
        continue;
      }
    }

    let success = 0;
    let failed = 0;

    for (const telefon of telefonlar) {
      const mesaj = mesajlar.get(telefon) || '';
      const result = await this.sendSMS(telefon, mesaj);
      if (result.success) {
        success++;
      } else {
        failed++;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return { success, failed };
  }

  /**
   * Generate debt reminder SMS message
   */
  private generateDebtSMSMessage(borc: BorcSMS): string {
    const adSoyad = `${borc.adi} ${borc.soyadi}`;
    const tutar = borc.borc_tutari.toFixed(2);
    const gecikme = borc.gecikme_gunu || 0;
    
    return `Sayın ${adSoyad}, ${gecikme} gün gecikmiş ${tutar} TL borcunuz bulunmaktadır. Lütfen ödemenizi yapınız. MTSK`;
  }

  /**
   * Clean phone number (remove spaces, dashes, etc.)
   */
  private cleanPhoneNumber(telefon: string): string {
    return telefon.replace(/[\s\-\(\)]/g, '');
  }

  /**
   * Validate Turkish phone number
   */
  private isValidPhoneNumber(telefon: string): boolean {
    // Turkish phone format: 05XX XXX XX XX or +905XX XXX XX XX
    const pattern = /^(\+90|90|0)?5\d{9}$/;
    return pattern.test(telefon);
  }

  /**
   * Format phone number for SMS API
   */
  formatPhoneForAPI(telefon: string): string {
    const clean = this.cleanPhoneNumber(telefon);
    // Convert to international format: +905XXXXXXXXX
    if (clean.startsWith('0')) {
      return '+90' + clean.substring(1);
    } else if (clean.startsWith('90')) {
      return '+' + clean;
    } else if (clean.startsWith('+90')) {
      return clean;
    }
    return '+90' + clean;
  }
}

