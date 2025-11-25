import { SMSGonderim, SMSTemplate, TopluSMS, BorcSMS } from '@mtsk/shared';
import { FinansService } from './finans.service';
import { KursiyerRepository } from '../repositories/kursiyer.repository';
import { SMSTemplateRepository, SMSGonderimRepository } from '../repositories/sms.repository';

/**
 * SMS Service
 * 
 * Note: This is a placeholder implementation.
 * In production, integrate with a real SMS provider API (e.g., NetGSM, İleti Merkezi, etc.)
 */
export class SMSService {
  private finansService: FinansService;
  private kursiyerRepo: KursiyerRepository;
  private templateRepo: SMSTemplateRepository;
  private gonderimRepo: SMSGonderimRepository;

  constructor() {
    this.finansService = new FinansService();
    this.kursiyerRepo = new KursiyerRepository();
    this.templateRepo = new SMSTemplateRepository();
    this.gonderimRepo = new SMSGonderimRepository();
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
  async sendDebtReminderSMS(kursiyerIds?: number[]): Promise<{ success: number; failed: number }> {
    const borcRaporu = await this.finansService.getDebtReport();
    let gecikmeliBorc = borcRaporu.filter(b => (b.gecikme_gunu || 0) > 0);
    
    // Filter by kursiyer_ids if provided
    if (kursiyerIds && kursiyerIds.length > 0) {
      gecikmeliBorc = gecikmeliBorc.filter(b => kursiyerIds.includes(b.id_kursiyer));
    }

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

  // ========== SMS Şablon İşlemleri ==========

  /**
   * Get all SMS templates
   */
  async getAllTemplates(): Promise<SMSTemplate[]> {
    return this.templateRepo.findAll();
  }

  /**
   * Get active SMS templates
   */
  async getActiveTemplates(): Promise<SMSTemplate[]> {
    return this.templateRepo.findActive();
  }

  /**
   * Get template by ID
   */
  async getTemplateById(id: number): Promise<SMSTemplate | null> {
    return this.templateRepo.findById(id);
  }

  /**
   * Create SMS template
   */
  async createTemplate(template: Partial<SMSTemplate>): Promise<SMSTemplate> {
    if (!template.baslik || !template.icerik) {
      throw new Error('Başlık ve içerik zorunludur');
    }
    return this.templateRepo.create(template);
  }

  /**
   * Update SMS template
   */
  async updateTemplate(id: number, updates: Partial<SMSTemplate>): Promise<SMSTemplate> {
    return this.templateRepo.update(id, updates);
  }

  /**
   * Delete SMS template
   */
  async deleteTemplate(id: number): Promise<boolean> {
    return this.templateRepo.delete(id);
  }

  // ========== SMS Rapor İşlemleri ==========

  /**
   * Get all SMS reports
   */
  async getAllReports(filters?: {
    id_kursiyer?: number;
    durum?: number;
    baslangic_tarihi?: string;
    bitis_tarihi?: string;
  }): Promise<SMSGonderim[]> {
    if (filters?.baslangic_tarihi && filters?.bitis_tarihi) {
      return this.gonderimRepo.findByDateRange(filters.baslangic_tarihi, filters.bitis_tarihi);
    }
    if (filters?.durum !== undefined) {
      return this.gonderimRepo.findByStatus(filters.durum);
    }
    if (filters?.id_kursiyer) {
      return this.gonderimRepo.findByKursiyer(filters.id_kursiyer);
    }
    return this.gonderimRepo.findAll();
  }

  /**
   * Save SMS record (called after sending SMS)
   */
  async saveSMSRecord(sms: Partial<SMSGonderim>): Promise<SMSGonderim> {
    return this.gonderimRepo.create({
      ...sms,
      gonderim_tarihi: sms.gonderim_tarihi || new Date().toISOString(),
    });
  }
}

