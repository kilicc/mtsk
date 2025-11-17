import { KursiyerOnKayit, Kursiyer } from '@mtsk/shared';
import { KursiyerOnKayitRepository } from '../repositories/kursiyer-on-kayit.repository';
import { KursiyerRepository } from '../repositories/kursiyer.repository';

export class KursiyerOnKayitService {
  private onKayitRepo: KursiyerOnKayitRepository;
  private kursiyerRepo: KursiyerRepository;

  constructor() {
    this.onKayitRepo = new KursiyerOnKayitRepository();
    this.kursiyerRepo = new KursiyerRepository();
  }

  /**
   * Get all pre-registrations
   */
  async getAllOnKayit(filters?: {
    durum?: number;
    adi?: string;
    soyadi?: string;
    telefon?: string;
  }): Promise<KursiyerOnKayit[]> {
    if (filters?.durum !== undefined) {
      return this.onKayitRepo.findByDurum(filters.durum);
    }
    return this.onKayitRepo.findAll(filters);
  }

  /**
   * Get pre-registration by ID
   */
  async getOnKayitById(id: number): Promise<KursiyerOnKayit | null> {
    return this.onKayitRepo.findById(id);
  }

  /**
   * Get pending pre-registrations
   */
  async getPendingOnKayit(): Promise<KursiyerOnKayit[]> {
    return this.onKayitRepo.findPending();
  }

  /**
   * Create new pre-registration
   */
  async createOnKayit(onKayit: Partial<KursiyerOnKayit>): Promise<KursiyerOnKayit> {
    const newOnKayit = {
      ...onKayit,
      durum: onKayit.durum ?? 0, // Default: Ön Kayıt
      kayit_tarihi: onKayit.kayit_tarihi || new Date().toISOString(),
    };
    return this.onKayitRepo.create(newOnKayit);
  }

  /**
   * Update pre-registration
   */
  async updateOnKayit(id: number, updates: Partial<KursiyerOnKayit>): Promise<KursiyerOnKayit> {
    return this.onKayitRepo.update(id, updates);
  }

  /**
   * Delete pre-registration (soft delete - set durum = 2)
   */
  async deleteOnKayit(id: number): Promise<void> {
    await this.onKayitRepo.update(id, { durum: 2 } as Partial<KursiyerOnKayit>);
  }

  /**
   * Convert pre-registration to full registration (Kesin Kayıt)
   * This creates a new Kursiyer record from OnKayit
   */
  async convertToKesinKayit(idOnKayit: number, additionalData?: Partial<Kursiyer>): Promise<Kursiyer> {
    // Get pre-registration
    const onKayit = await this.onKayitRepo.findById(idOnKayit);
    if (!onKayit) {
      throw new Error('Pre-registration not found');
    }

    if (onKayit.durum === 1) {
      throw new Error('This pre-registration has already been converted');
    }

    // Create new Kursiyer from OnKayit data
    const kursiyerData: Partial<Kursiyer> = {
      adi: onKayit.adi,
      soyadi: onKayit.soyadi,
      tc_kimlik: onKayit.tc_kimlik,
      telefon: onKayit.telefon,
      email: onKayit.email,
      adres: onKayit.adres,
      dogum_tarihi: onKayit.dogum_tarihi,
      kayit_tarihi: new Date().toISOString(),
      durum: 1, // Aktif
      notlar: onKayit.notlar,
      ...additionalData, // Allow overriding with additional data
    };

    // Create kursiyer
    const kursiyer = await this.kursiyerRepo.create(kursiyerData);

    // Update onKayit status to "converted"
    await this.onKayitRepo.update(idOnKayit, { durum: 1 } as Partial<KursiyerOnKayit>);

    return kursiyer;
  }

  /**
   * Search pre-registrations
   */
  async searchOnKayit(searchTerm: string): Promise<KursiyerOnKayit[]> {
    return this.onKayitRepo.searchByName(searchTerm);
  }
}

