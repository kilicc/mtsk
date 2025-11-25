import {
  DersProgramiDireksiyonRepository,
  DersProgramiTeoriRepository,
  DersProgramiMebbisRepository,
} from '../repositories/ders-programi.repository';
import { KursiyerRepository } from '../repositories/kursiyer.repository';
import { PersonelRepository, AracRepository } from '../repositories/arac-personel.repository';
import { KurumsalDersProgramiService } from './kurumsal-ders-programi.service';
import { DersProgramiDireksiyon, DersProgramiTeori, DersProgramiMebbis, KurumsalDersProgrami } from '@mtsk/shared';
import { supabase } from '../db/supabase';

export class DersProgramiService {
  private direksiyonRepo: DersProgramiDireksiyonRepository;
  private teoriRepo: DersProgramiTeoriRepository;
  private mebbisRepo: DersProgramiMebbisRepository;
  private kursiyerRepo: KursiyerRepository;
  private personelRepo: PersonelRepository;
  private aracRepo: AracRepository;
  private kurumsalDersService: KurumsalDersProgramiService;

  constructor() {
    this.direksiyonRepo = new DersProgramiDireksiyonRepository();
    this.teoriRepo = new DersProgramiTeoriRepository();
    this.mebbisRepo = new DersProgramiMebbisRepository();
    this.kursiyerRepo = new KursiyerRepository();
    this.personelRepo = new PersonelRepository();
    this.aracRepo = new AracRepository();
    this.kurumsalDersService = new KurumsalDersProgramiService();
  }

  // ========== Direksiyon Programı ==========

  /**
   * Get all direksiyon programs
   */
  async getAllDireksiyon(filters?: { id_grup?: number; id_personel?: number }): Promise<DersProgramiDireksiyon[]> {
    return this.direksiyonRepo.findAll(filters);
  }

  /**
   * Get direksiyon program by ID
   */
  async getDireksiyonById(id: number): Promise<DersProgramiDireksiyon | null> {
    return this.direksiyonRepo.findById(id);
  }

  /**
   * Get direksiyon programs by kursiyer
   */
  async getDireksiyonByKursiyer(idKursiyer: number): Promise<DersProgramiDireksiyon[]> {
    return this.direksiyonRepo.findByKursiyer(idKursiyer);
  }

  /**
   * Get direksiyon programs by personel
   */
  async getDireksiyonByPersonel(idPersonel: number): Promise<DersProgramiDireksiyon[]> {
    return this.direksiyonRepo.findByPersonel(idPersonel);
  }

  /**
   * Create direksiyon program
   */
  async createDireksiyon(program: Partial<DersProgramiDireksiyon>): Promise<DersProgramiDireksiyon> {
    if (!program.id_kursiyer) {
      throw new Error('Kursiyer ID zorunludur');
    }

    return this.direksiyonRepo.create(program);
  }

  /**
   * Update direksiyon program
   */
  async updateDireksiyon(id: number, updates: Partial<DersProgramiDireksiyon>): Promise<DersProgramiDireksiyon> {
    return this.direksiyonRepo.update(id, updates);
  }

  /**
   * Delete direksiyon program
   */
  async deleteDireksiyon(id: number): Promise<boolean> {
    return this.direksiyonRepo.delete(id);
  }

  // ========== Teori Programı ==========

  /**
   * Get all teori programs
   */
  async getAllTeori(filters?: { id_grup_karti?: number }): Promise<DersProgramiTeori[]> {
    return this.teoriRepo.findAll(filters);
  }

  /**
   * Get teori program by ID
   */
  async getTeoriById(id: number): Promise<DersProgramiTeori | null> {
    return this.teoriRepo.findById(id);
  }

  /**
   * Get teori programs by grup
   */
  async getTeoriByGrup(idGrupKarti: number): Promise<DersProgramiTeori[]> {
    return this.teoriRepo.findByGrupKarti(idGrupKarti);
  }

  /**
   * Create teori program
   */
  async createTeori(program: Partial<DersProgramiTeori>): Promise<DersProgramiTeori> {
    return this.teoriRepo.create(program);
  }

  /**
   * Update teori program
   */
  async updateTeori(id: number, updates: Partial<DersProgramiTeori>): Promise<DersProgramiTeori> {
    return this.teoriRepo.update(id, updates);
  }

  // ========== MEBBİS ==========

  /**
   * Get MEBBİS programs
   */
  async getMebbisPrograms(filters?: { ge_id_grup?: number }): Promise<DersProgramiMebbis[]> {
    return this.mebbisRepo.findAll(filters);
  }

  /**
   * Export to MEBBİS format
   */
  async exportToMebbis(idGrup: number): Promise<DersProgramiMebbis[]> {
    // Get direksiyon programs for this group
    const direksiyonPrograms = await this.direksiyonRepo.findByGrup(idGrup);

    // Convert to MEBBİS format
    const mebbisData: Partial<DersProgramiMebbis>[] = direksiyonPrograms.map((prog) => ({
      ge_id_grup: idGrup,
      ge_id_kurs: prog.id_kursiyer,
      ge_id_pers: prog.id_personel,
      ge_id_arac: prog.id_arac,
      ge_durumu: prog.durum || 1,
    }));

    // Create MEBBİS records
    const results: DersProgramiMebbis[] = [];
    for (const data of mebbisData) {
      const created = await this.mebbisRepo.create(data);
      results.push(created);
    }

    return results;
  }

  /**
   * Mark MEBBİS program as transferred
   */
  async markMebbisAsTransferred(id: number): Promise<DersProgramiMebbis> {
    return this.mebbisRepo.markAsTransferred(id);
  }

  // ========== Otomatik Ders Programı Oluşturma ==========

  /**
   * Otomatik teorik ders programı oluştur
   * Dönem seçilerek, o dönemdeki teorik ders programları MEBBİS'e bildirilmek üzere hoca ve ders saatlerine göre otomatik ayarlanır
   */
  async otomatikTeorikDersProgramiOlustur(params: {
    mebbisDonemi: string;
    grupBaslangicTarihi: string;
    egitimTuru?: string;
  }): Promise<{ olusturulan: number; hatalar: string[] }> {
    const { mebbisDonemi, grupBaslangicTarihi, egitimTuru = 'normal' } = params;
    
    // Dönemdeki kursiyerleri getir
    const { data: kursiyerler, error: kursiyerError } = await supabase
      .from('kursiyer')
      .select('*')
      .eq('mebbis_donemi', mebbisDonemi)
      .eq('durum', 1);

    if (kursiyerError) {
      throw new Error(`Kursiyerler getirilemedi: ${kursiyerError.message}`);
    }

    if (!kursiyerler || kursiyerler.length === 0) {
      throw new Error('Bu dönemde kursiyer bulunamadı');
    }

    // Aktif personelleri getir (eğitmenler)
    const personeller = await this.personelRepo.findActive();
    if (personeller.length === 0) {
      throw new Error('Aktif personel bulunamadı');
    }

    // Ders türleri ve saatleri
    const dersTurleri = [
      { tur: 'trafik-cevre', saat: 16 },
      { tur: 'ilk-yardim', saat: 8 },
      { tur: 'arac-teknigi', saat: 6 },
      { tur: 'trafik-adabi', saat: 4 },
    ];

    const olusturulan: DersProgramiTeori[] = [];
    const hatalar: string[] = [];
    const baslangicTarihi = new Date(grupBaslangicTarihi);
    let hafta = 1;

    // Her ders türü için program oluştur
    for (const dersTuru of dersTurleri) {
      const toplamSaat = dersTuru.saat;
      let atananSaat = 0;

      // Personel başına haftalık saat dağılımı (haftada 40 saat max)
      const personelHaftalikSaat: Record<number, number> = {};
      personeller.forEach(p => personelHaftalikSaat[p.id] = 0);

      while (atananSaat < toplamSaat) {
        // En az yüklenmiş personeli bul
        const enAzYukluPersonel = personeller
          .filter(p => personelHaftalikSaat[p.id] < 40)
          .sort((a, b) => personelHaftalikSaat[a.id] - personelHaftalikSaat[b.id])[0];

        if (!enAzYukluPersonel) {
          hatalar.push(`${dersTuru.tur}: Yeterli personel bulunamadı`);
          break;
        }

        // Haftalık ders programı oluştur (haftada max 8 saat/gün)
        const gunlukSaat = Math.min(8 - (personelHaftalikSaat[enAzYukluPersonel.id] % 8), toplamSaat - atananSaat);
        
        try {
          const program = await this.teoriRepo.create({
            id_grup_karti: kursiyerler[0].id_grup || undefined,
            hafta: hafta,
            id_personel: enAzYukluPersonel.id,
            ders_turu: dersTuru.tur,
            egitim_turu: egitimTuru,
            durum: 1,
          } as Partial<DersProgramiTeori>);

          olusturulan.push(program);
          atananSaat += gunlukSaat;
          personelHaftalikSaat[enAzYukluPersonel.id] += gunlukSaat;

          if (personelHaftalikSaat[enAzYukluPersonel.id] % 8 === 0) {
            hafta++;
          }
        } catch (error: any) {
          hatalar.push(`${dersTuru.tur}: ${error.message}`);
        }
      }
    }

    return { olusturulan: olusturulan.length, hatalar };
  }

  /**
   * E-sınavdan geçen kursiyerler için otomatik uygulama ders programı oluştur
   * 1 öğrenci 1 günde 2 saat ders alacak şekilde dağıtılır
   * Bir hoca günde 8 saat haftada 40 saat ders yazılabiliyor
   * Aynı araç, aynı hoca, aynı saatte birden fazla ders verilemez
   */
  async otomatikUygulamaDersProgramiOlustur(params: {
    esinavTarihi: string;
    mebbisDonemi?: string;
    programBaslamaTarihi: string;
  }): Promise<{ olusturulan: number; hatalar: string[]; analiz: any }> {
    const { esinavTarihi, mebbisDonemi, programBaslamaTarihi } = params;

    // E-sınavdan geçen kursiyerleri getir
    const { data: sinavSonuclari, error: sinavError } = await supabase
      .from('sinav_notlari')
      .select('*, kursiyer(*)')
      .eq('sinav_tarihi', esinavTarihi)
      .eq('sinav_turu', 'teorik')
      .eq('sinav_durumu', 'gecti');

    if (sinavError) {
      throw new Error(`Sınav sonuçları getirilemedi: ${sinavError.message}`);
    }

    if (!sinavSonuclari || sinavSonuclari.length === 0) {
      throw new Error('Bu tarihte e-sınavdan geçen kursiyer bulunamadı');
    }

    // Aktif personeller ve araçları getir
    const personeller = await this.personelRepo.findActive();
    const araclar = await this.aracRepo.findActive();

    if (personeller.length === 0) {
      throw new Error('Aktif personel bulunamadı');
    }
    if (araclar.length === 0) {
      throw new Error('Aktif araç bulunamadı');
    }

    const gecenKursiyerler = sinavSonuclari
      .filter(s => s.kursiyer && s.kursiyer.durum === 1)
      .map(s => s.kursiyer);

    if (gecenKursiyerler.length === 0) {
      throw new Error('Aktif kursiyer bulunamadı');
    }

    // Mevcut kurumsal ders programlarını getir (çakışma kontrolü için)
    const mevcutProgramlar = await this.kurumsalDersService.getAllDersler({});
    
    // Personel ve araç yükü takibi
    const personelGunlukSaat: Record<string, number> = {}; // "personelId_tarih" -> saat
    const personelHaftalikSaat: Record<number, number> = {}; // personelId -> toplam saat
    const aracGunlukSaat: Record<string, number> = {}; // "aracId_tarih_saat" -> kullanım
    const kursiyerGunlukSaat: Record<string, number> = {}; // "kursiyerId_tarih" -> saat

    personeller.forEach(p => personelHaftalikSaat[p.id] = 0);

    const olusturulan: KurumsalDersProgrami[] = [];
    const hatalar: string[] = [];
    const baslangicTarihi = new Date(programBaslamaTarihi);
    let tarih = new Date(baslangicTarihi);
    let kursiyerIndex = 0;

    // Her kursiyer için 2 saat ders programı oluştur
    while (kursiyerIndex < gecenKursiyerler.length) {
      const kursiyer = gecenKursiyerler[kursiyerIndex];
      const kursiyerKey = `${kursiyer.id}_${tarih.toISOString().split('T')[0]}`;
      
      // Bu kursiyer bu günde zaten 2 saat ders alıyor mu?
      if (kursiyerGunlukSaat[kursiyerKey] >= 2) {
        // Bir sonraki güne geç
        tarih.setDate(tarih.getDate() + 1);
        continue;
      }

      // Uygun personel ve araç bul
      let personelBulundu = false;
      let aracBulundu = false;
      let secilenPersonel: any = null;
      let secilenArac: any = null;
      let saat = 9; // Sabah 9'dan başla

      // Personel seçimi (günde 8 saat, haftada 40 saat max)
      for (const personel of personeller) {
        const personelGunKey = `${personel.id}_${tarih.toISOString().split('T')[0]}`;
        const personelGunlukToplam = personelGunlukSaat[personelGunKey] || 0;
        const personelHaftalikToplam = personelHaftalikSaat[personel.id] || 0;

        // Haftalık limit kontrolü
        if (personelHaftalikToplam >= 40) continue;

        // Günlük limit kontrolü
        if (personelGunlukToplam >= 8) continue;

        // Saat bazında çakışma kontrolü
        let saatBulundu = false;
        for (let s = 9; s <= 17; s++) {
          // Bu saatte personel meşgul mu?
          const mevcutPersonelCakisma = mevcutProgramlar.some((p: any) => 
            p.id_personel === personel.id &&
            p.tarih === tarih.toISOString().split('T')[0] &&
            p.saat === s
          );

          if (mevcutPersonelCakisma) continue;

          // Uygun araç bul
          for (const arac of araclar) {
            const aracSaatKeyFull = `${arac.id}_${tarih.toISOString().split('T')[0]}_${s}`;
            
            // Bu saatte araç meşgul mu?
            const mevcutAracCakisma = mevcutProgramlar.some((p: any) => 
              p.id_arac === arac.id &&
              p.tarih === tarih.toISOString().split('T')[0] &&
              p.saat === s
            );

            if (mevcutAracCakisma || aracGunlukSaat[aracSaatKeyFull]) continue;

            // Bulundu!
            secilenPersonel = personel;
            secilenArac = arac;
            saat = s;
            saatBulundu = true;
            break;
          }

          if (saatBulundu) break;
        }

        if (saatBulundu) {
          personelBulundu = true;
          aracBulundu = true;
          break;
        }
      }

      if (!personelBulundu || !aracBulundu) {
        hatalar.push(`${kursiyer.adi} ${kursiyer.soyadi}: Uygun personel/araç bulunamadı`);
        kursiyerIndex++;
        continue;
      }

      // Kurumsal ders programı oluştur
      try {
        const program = await this.kurumsalDersService.createDers({
          id_kursiyer: kursiyer.id,
          id_personel: secilenPersonel.id,
          id_arac: secilenArac.id,
          tarih: tarih.toISOString().split('T')[0],
          saat: saat,
          durum: 0, // Planlandı
        } as Partial<KurumsalDersProgrami>);

        olusturulan.push(program);

        // Yük takibini güncelle
        const personelGunKey = `${secilenPersonel.id}_${tarih.toISOString().split('T')[0]}`;
        personelGunlukSaat[personelGunKey] = (personelGunlukSaat[personelGunKey] || 0) + 1;
        personelHaftalikSaat[secilenPersonel.id] = (personelHaftalikSaat[secilenPersonel.id] || 0) + 1;
        
        const aracSaatKey = `${secilenArac.id}_${tarih.toISOString().split('T')[0]}_${saat}`;
        aracGunlukSaat[aracSaatKey] = 1;

        kursiyerGunlukSaat[kursiyerKey] = (kursiyerGunlukSaat[kursiyerKey] || 0) + 1;

        // Bu kursiyer bu günde 2 saat ders aldı mı?
        if (kursiyerGunlukSaat[kursiyerKey] >= 2) {
          kursiyerIndex++;
          tarih = new Date(baslangicTarihi); // Yeni kursiyer için tarihi sıfırla
        } else {
          // Aynı gün 2. saat için devam et
          saat++;
          if (saat > 17) {
            // Gün bitti, bir sonraki güne geç
            tarih.setDate(tarih.getDate() + 1);
            saat = 9;
          }
        }
      } catch (error: any) {
        hatalar.push(`${kursiyer.adi} ${kursiyer.soyadi}: ${error.message}`);
        kursiyerIndex++;
      }
    }

    // Analiz raporu
    const analiz = {
      toplamKursiyer: gecenKursiyerler.length,
      olusturulanDers: olusturulan.length,
      personelYuk: personeller.map(p => ({
        personelId: p.id,
        personelAdi: `${p.adi} ${p.soyadi}`,
        haftalikSaat: personelHaftalikSaat[p.id] || 0,
        kalanKapasite: 40 - (personelHaftalikSaat[p.id] || 0),
      })),
      aracKullanim: araclar.map(a => ({
        aracId: a.id,
        aracPlaka: a.plaka,
        kullanilanGun: Object.keys(aracGunlukSaat).filter(k => k.startsWith(`${a.id}_`)).length,
      })),
    };

    return { olusturulan: olusturulan.length, hatalar, analiz };
  }

  /**
   * E-sınav tarihlerini getir
   */
  async getESinavTarihleri(): Promise<string[]> {
    const { data, error } = await supabase
      .from('sinav_notlari')
      .select('sinav_tarihi')
      .eq('sinav_turu', 'teorik')
      .order('sinav_tarihi', { ascending: false });

    if (error) {
      throw new Error(`E-sınav tarihleri getirilemedi: ${error.message}`);
    }

    const uniqueTarihler = Array.from(new Set((data || []).map((s: any) => s.sinav_tarihi)));
    return uniqueTarihler as string[];
  }

  /**
   * Belirli bir e-sınav tarihinde geçen kursiyerleri getir
   */
  async getESinavGecenKursiyerler(esinavTarihi: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('sinav_notlari')
      .select('*, kursiyer(*)')
      .eq('sinav_tarihi', esinavTarihi)
      .eq('sinav_turu', 'teorik')
      .eq('sinav_durumu', 'gecti');

    if (error) {
      throw new Error(`E-sınav sonuçları getirilemedi: ${error.message}`);
    }

    return (data || []).filter((s: any) => s.kursiyer && s.kursiyer.durum === 1);
  }
}

