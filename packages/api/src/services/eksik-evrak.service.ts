import { EksikEvrak, EvrakDurumRaporu, EvrakTipi } from '@mtsk/shared';
import { supabase } from '../db/supabase';
import { KursiyerRepository } from '../repositories/kursiyer.repository';

export class EksikEvrakService {
  private kursiyerRepo: KursiyerRepository;

  // Evrak tipleri ve kontrol edilecek alanlar
  private evrakKontrolleri: { tip: EvrakTipi; adi: string; alan: string; tarihAlani?: string }[] = [
    { tip: 'nufus_cuzdani_on', adi: 'Nüfus Cüzdanı (Ön)', alan: 'img_nuf_cuz_on' },
    { tip: 'nufus_cuzdani_arka', adi: 'Nüfus Cüzdanı (Arka)', alan: 'img_nuf_cuz_arka' },
    { tip: 'ogrenim_belgesi', adi: 'Öğrenim Belgesi', alan: 'img_ogrnim_bel', tarihAlani: 'ogr_bel_tarihi' },
    { tip: 'saglik_raporu', adi: 'Sağlık Raporu', alan: 'img_saglik', tarihAlani: 'sag_rapor_tarihi' },
    { tip: 'savcilik_belgesi', adi: 'Savcılık Belgesi', alan: 'img_savcilik', tarihAlani: 'savcilik_bel_tarihi' },
    { tip: 'surucu_belgesi_on', adi: 'Sürücü Belgesi (Ön)', alan: 'img_sur_bel_on' },
    { tip: 'surucu_belgesi_arka', adi: 'Sürücü Belgesi (Arka)', alan: 'img_sur_bel_arka' },
    { tip: 'mtsk_sertifika', adi: 'MTSK Sertifika', alan: 'img_mtsk_sertifika' },
    { tip: 'muracaat', adi: 'Müracaat', alan: 'img_muracaat' },
    { tip: 'sozlesme_on', adi: 'Sözleşme (Ön)', alan: 'img_sozlesme_on' },
    { tip: 'sozlesme_arka', adi: 'Sözleşme (Arka)', alan: 'img_sozlesme_arka' },
    { tip: 'imza', adi: 'İmza', alan: 'img_imza' },
    { tip: 'fatura', adi: 'Fatura', alan: 'img_fatura', tarihAlani: 'fatura_tarihi' },
    { tip: 'diger1', adi: 'Diğer 1', alan: 'img_diger1' },
    { tip: 'diger2', adi: 'Diğer 2', alan: 'img_diger2' },
    { tip: 'diger3', adi: 'Diğer 3', alan: 'img_diger3' },
  ];

  constructor() {
    this.kursiyerRepo = new KursiyerRepository();
  }

  /**
   * Get all kursiyers with missing documents
   */
  async getEksikEvraklar(): Promise<EksikEvrak[]> {
    // Get all active kursiyers
    const kursiyerler = await this.kursiyerRepo.findActive();

    // Get all evrak records
    const { data: evraklar, error } = await supabase
      .from('kursiyer_evrak')
      .select('*');

    if (error) {
      throw new Error(`Error fetching evraklar: ${error.message}`);
    }

    const eksikEvraklar: EksikEvrak[] = [];

    for (const kursiyer of kursiyerler) {
      const evrak = evraklar?.find((e: any) => e.id_kursiyer === kursiyer.id);
      const eksik: string[] = [];

      // Check each evrak type
      for (const kontrol of this.evrakKontrolleri) {
        if (!evrak || !evrak[kontrol.alan] || evrak[kontrol.alan] === '') {
          eksik.push(kontrol.adi);
        }
      }

      if (eksik.length > 0) {
        eksikEvraklar.push({
          id_kursiyer: kursiyer.id,
          kursiyer_adi: kursiyer.adi,
          kursiyer_soyadi: kursiyer.soyadi,
          telefon: kursiyer.telefon,
          eksik_evraklar: eksik,
          toplam_eksik: eksik.length,
        });
      }
    }

    return eksikEvraklar.sort((a, b) => b.toplam_eksik - a.toplam_eksik);
  }

  /**
   * Get detailed evrak status report for a kursiyer
   */
  async getEvrakDurumRaporu(idKursiyer: number): Promise<EvrakDurumRaporu | null> {
    const kursiyer = await this.kursiyerRepo.findById(idKursiyer);
    if (!kursiyer) {
      return null;
    }

    const { data: evrak, error } = await supabase
      .from('kursiyer_evrak')
      .select('*')
      .eq('id_kursiyer', idKursiyer)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching evrak: ${error.message}`);
    }

    const evrakDurumlari = this.evrakKontrolleri.map((kontrol) => {
      const mevcut = evrak && evrak[kontrol.alan] && evrak[kontrol.alan] !== '';
      return {
        evrak_tipi: kontrol.tip,
        evrak_adi: kontrol.adi,
        mevcut: mevcut || false,
        tarih: kontrol.tarihAlani && evrak ? evrak[kontrol.tarihAlani] : undefined,
      };
    });

    const eksikSayisi = evrakDurumlari.filter((e) => !e.mevcut).length;
    const toplamSayisi = evrakDurumlari.length;
    const tamamlanmaOrani = toplamSayisi > 0 ? Math.round(((toplamSayisi - eksikSayisi) / toplamSayisi) * 100) : 0;

    return {
      id_kursiyer: kursiyer.id,
      kursiyer_adi: kursiyer.adi,
      kursiyer_soyadi: kursiyer.soyadi,
      telefon: kursiyer.telefon,
      evrak_durumlari: evrakDurumlari,
      eksik_sayisi: eksikSayisi,
      tamamlanma_orani: tamamlanmaOrani,
    };
  }

  /**
   * Get evrak status report for all kursiyers
   */
  async getAllEvrakDurumRaporu(): Promise<EvrakDurumRaporu[]> {
    const kursiyerler = await this.kursiyerRepo.findActive();
    const raporlar: EvrakDurumRaporu[] = [];

    for (const kursiyer of kursiyerler) {
      const rapor = await this.getEvrakDurumRaporu(kursiyer.id);
      if (rapor) {
        raporlar.push(rapor);
      }
    }

    return raporlar.sort((a, b) => a.eksik_sayisi - b.eksik_sayisi);
  }
}

