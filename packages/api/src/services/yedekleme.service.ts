import { YedeklemeAyari, YedeklemeGecmisi, ZamanlanmisGorev } from '@mtsk/shared';
import { supabase } from '../db/supabase';
import * as fs from 'fs';
import * as path from 'path';

export class YedeklemeService {
  private yedeklemeKlasoru: string;

  constructor() {
    // Yedekleme klasörü (Electron app içinde)
    this.yedeklemeKlasoru = path.join(process.cwd(), 'yedekler');
    
    // Klasörü oluştur
    if (!fs.existsSync(this.yedeklemeKlasoru)) {
      fs.mkdirSync(this.yedeklemeKlasoru, { recursive: true });
    }
  }

  /**
   * Get yedekleme ayarları
   */
  async getYedeklemeAyarlari(): Promise<YedeklemeAyari[]> {
    // 7 gün için varsayılan ayarlar
    const ayarlar: YedeklemeAyari[] = [];
    for (let gun = 0; gun < 7; gun++) {
      ayarlar.push({
        id: gun,
        gun: gun,
        saat: '02:00',
        aktif: false,
        yedekleme_tipi: 'full',
        saklama_suresi: 30,
      });
    }
    return ayarlar;
  }

  /**
   * Update yedekleme ayarları
   */
  async updateYedeklemeAyarlari(ayarlar: YedeklemeAyari[]): Promise<YedeklemeAyari[]> {
    // TODO: Supabase'de yedekleme_ayarlari tablosu oluşturulmalı
    // Şimdilik memory'de tutuyoruz
    return ayarlar;
  }

  /**
   * Perform backup
   */
  async yedeklemeYap(yedeklemeTipi: string = 'full'): Promise<YedeklemeGecmisi> {
    const tarih = new Date();
    const dosyaAdi = `yedek_${tarih.toISOString().split('T')[0]}_${tarih.getTime()}.sql`;
    const dosyaYolu = path.join(this.yedeklemeKlasoru, dosyaAdi);

    try {
      // TODO: Supabase'den veri çekip SQL dump oluştur
      // Şimdilik placeholder
      const yedeklemeGecmisi: YedeklemeGecmisi = {
        id: Date.now(),
        yedekleme_tarihi: tarih.toISOString(),
        yedekleme_tipi: yedeklemeTipi,
        dosya_yolu: dosyaYolu,
        dosya_boyutu: 0,
        durum: 'basarili',
      };

      // Save to database
      const { error } = await supabase
        .from('yedekleme_gecmisi')
        .insert(yedeklemeGecmisi);

      if (error) {
        console.error('Error saving backup history:', error);
      }

      return yedeklemeGecmisi;
    } catch (error: any) {
      const yedeklemeGecmisi: YedeklemeGecmisi = {
        id: Date.now(),
        yedekleme_tarihi: tarih.toISOString(),
        yedekleme_tipi: yedeklemeTipi,
        durum: 'basarisiz',
        hata_mesaji: error.message,
      };

      return yedeklemeGecmisi;
    }
  }

  /**
   * Get yedekleme geçmişi
   */
  async getYedeklemeGecmisi(): Promise<YedeklemeGecmisi[]> {
    const { data, error } = await supabase
      .from('yedekleme_gecmisi')
      .select('*')
      .order('yedekleme_tarihi', { ascending: false })
      .limit(100);

    if (error) {
      throw new Error(`Error getting yedekleme gecmisi: ${error.message}`);
    }

    return (data || []) as YedeklemeGecmisi[];
  }

  /**
   * Get zamanlanmış görevler
   */
  async getZamanlanmisGorevler(): Promise<ZamanlanmisGorev[]> {
    // TODO: Supabase'de zamanlanmis_gorevler tablosu oluşturulmalı
    return [];
  }
}

