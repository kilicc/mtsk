import { MuhasebeRepository, KursiyerFaturaRepository } from '../repositories/finans.repository';
import { Muhasebe, KursiyerFatura, OdemePlani, BorcRaporu, KasaRaporu } from '@mtsk/shared';

export class FinansService {
  private muhasebeRepo: MuhasebeRepository;
  private faturaRepo: KursiyerFaturaRepository;

  constructor() {
    this.muhasebeRepo = new MuhasebeRepository();
    this.faturaRepo = new KursiyerFaturaRepository();
  }

  // ========== Muhasebe (Ödeme) İşlemleri ==========

  /**
   * Get all muhasebe records
   */
  async getAllMuhasebe(filters?: { id_kursiyer?: number; kayit_durumu?: number }): Promise<Muhasebe[]> {
    return this.muhasebeRepo.findAll(filters);
  }

  /**
   * Get muhasebe by ID
   */
  async getMuhasebeById(id: number): Promise<Muhasebe | null> {
    return this.muhasebeRepo.findById(id);
  }

  /**
   * Get muhasebe by kursiyer
   */
  async getMuhasebeByKursiyer(idKursiyer: number): Promise<Muhasebe[]> {
    return this.muhasebeRepo.findByKursiyer(idKursiyer);
  }

  /**
   * Create payment record
   */
  async createOdeme(odeme: Partial<Muhasebe>): Promise<Muhasebe> {
    if (!odeme.id_kursiyer) {
      throw new Error('Kursiyer ID zorunludur');
    }

    // Set default values
    const newOdeme: Partial<Muhasebe> = {
      ...odeme,
      kayit_durumu: odeme.kayit_durumu ?? 0, // 0: ödenmedi
      kul_tarih: odeme.kul_tarih || new Date().toISOString(),
    };

    return this.muhasebeRepo.create(newOdeme);
  }

  /**
   * Mark payment as paid
   */
  async markAsPaid(id: number, odemeTarihi?: Date | string): Promise<Muhasebe> {
    return this.muhasebeRepo.update(id, {
      kayit_durumu: 1, // Ödendi
      odeme_tarihi: odemeTarihi || new Date().toISOString(),
    } as Partial<Muhasebe>);
  }

  /**
   * Get overdue payments
   */
  async getOverduePayments(): Promise<Muhasebe[]> {
    return this.muhasebeRepo.findOverdue();
  }

  /**
   * Get total debt for kursiyer
   */
  async getTotalDebt(idKursiyer: number): Promise<number> {
    return this.muhasebeRepo.getTotalDebt(idKursiyer);
  }

  // ========== Fatura İşlemleri ==========

  /**
   * Get all invoices
   */
  async getAllFatura(filters?: { id_kursiyer?: number }): Promise<KursiyerFatura[]> {
    return this.faturaRepo.findAll(filters);
  }

  /**
   * Get fatura by ID
   */
  async getFaturaById(id: number): Promise<KursiyerFatura | null> {
    return this.faturaRepo.findById(id);
  }

  /**
   * Get fatura by kursiyer
   */
  async getFaturaByKursiyer(idKursiyer: number): Promise<KursiyerFatura[]> {
    return this.faturaRepo.findByKursiyer(idKursiyer);
  }

  /**
   * Create invoice
   */
  async createFatura(fatura: Partial<KursiyerFatura>): Promise<KursiyerFatura> {
    if (!fatura.id_kursiyer) {
      throw new Error('Kursiyer ID zorunludur');
    }

    return this.faturaRepo.create(fatura);
  }

  // ========== Kasa Raporları ==========

  /**
   * Get daily cash report
   */
  async getDailyCashReport(tarih: Date | string): Promise<KasaRaporu> {
    const dateStr = typeof tarih === 'string' ? tarih : tarih.toISOString().split('T')[0];
    
    const { data, error } = await this.muhasebeRepo['supabase']
      .from('muhasebe')
      .select('tutar, kayit_durumu, kasa')
      .eq('kul_tarih', dateStr);

    if (error) {
      throw new Error(`Error getting daily cash report: ${error.message}`);
    }

    let nakitGiris = 0;
    let nakitCikis = 0;
    let bankaGiris = 0;
    let bankaCikis = 0;

    (data || []).forEach((item: any) => {
      const tutar = parseFloat(item.tutar || '0');
      if (item.kayit_durumu === 1) { // Ödendi
        if (item.kasa === 1) nakitGiris += tutar;
        else if (item.kasa === 2) bankaGiris += tutar;
      } else {
        if (item.kasa === 1) nakitCikis += tutar;
        else if (item.kasa === 2) bankaCikis += tutar;
      }
    });

    return {
      tarih: dateStr,
      nakit_giris: nakitGiris,
      nakit_cikis: nakitCikis,
      banka_giris: bankaGiris,
      banka_cikis: bankaCikis,
      toplam_giris: nakitGiris + bankaGiris,
      toplam_cikis: nakitCikis + bankaCikis,
      bakiye: (nakitGiris + bankaGiris) - (nakitCikis + bankaCikis),
    };
  }

  // ========== Borç Raporları ==========

  /**
   * Get debt report for all kursiyerler
   */
  async getDebtReport(): Promise<BorcRaporu[]> {
    const { data, error } = await this.muhasebeRepo['supabase']
      .from('muhasebe')
      .select(`
        id_kursiyer,
        tutar,
        vade_tarihi,
        kayit_durumu,
        kursiyer:kursiyer!muhasebe_id_kursiyer_fkey (
          id,
          adi,
          soyadi
        )
      `)
      .eq('kayit_durumu', 0); // Ödenmemiş

    if (error) {
      throw new Error(`Error getting debt report: ${error.message}`);
    }

    // Group by kursiyer
    const debtMap = new Map<number, BorcRaporu>();

    (data || []).forEach((item: any) => {
      const kursiyerId = item.id_kursiyer;
      if (!kursiyerId) return;

      const tutar = parseFloat(item.tutar || '0');
      const kursiyer = item.kursiyer;

      if (!debtMap.has(kursiyerId)) {
        debtMap.set(kursiyerId, {
          id_kursiyer: kursiyerId,
          kursiyer_adi: kursiyer?.adi || '',
          kursiyer_soyadi: kursiyer?.soyadi || '',
          toplam_borc: 0,
          odenecek_tutar: 0,
          vade_tarihi: item.vade_tarihi,
          gecikme_gunu: item.vade_tarihi 
            ? Math.max(0, Math.floor((new Date().getTime() - new Date(item.vade_tarihi).getTime()) / (1000 * 60 * 60 * 24)))
            : undefined,
        });
      }

      const debt = debtMap.get(kursiyerId)!;
      debt.toplam_borc += tutar;
      debt.odenecek_tutar += tutar;
    });

    return Array.from(debtMap.values());
  }
}

