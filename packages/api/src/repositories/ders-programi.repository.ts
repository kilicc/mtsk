import { BaseRepository } from './base.repository';
import { DersProgramiDireksiyon, DersProgramiTeori, DersProgramiMebbis } from '@mtsk/shared';

export class DersProgramiDireksiyonRepository extends BaseRepository<DersProgramiDireksiyon> {
  constructor() {
    super('ders_programi_direksiyon');
  }

  /**
   * Find by kursiyer ID
   */
  async findByKursiyer(idKursiyer: number): Promise<DersProgramiDireksiyon[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_kursiyer', idKursiyer);

    if (error) {
      throw new Error(`Error finding direksiyon program by kursiyer: ${error.message}`);
    }

    return (data || []) as DersProgramiDireksiyon[];
  }

  /**
   * Find by personel ID
   */
  async findByPersonel(idPersonel: number): Promise<DersProgramiDireksiyon[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_personel', idPersonel);

    if (error) {
      throw new Error(`Error finding direksiyon program by personel: ${error.message}`);
    }

    return (data || []) as DersProgramiDireksiyon[];
  }

  /**
   * Find by grup ID
   */
  async findByGrup(idGrup: number): Promise<DersProgramiDireksiyon[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_grup', idGrup);

    if (error) {
      throw new Error(`Error finding direksiyon program by grup: ${error.message}`);
    }

    return (data || []) as DersProgramiDireksiyon[];
  }
}

export class DersProgramiTeoriRepository extends BaseRepository<DersProgramiTeori> {
  constructor() {
    super('ders_programi_teori');
  }

  /**
   * Find by grup kartı ID
   */
  async findByGrupKarti(idGrupKarti: number): Promise<DersProgramiTeori[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id_grup_karti', idGrupKarti);

    if (error) {
      throw new Error(`Error finding teori program by grup: ${error.message}`);
    }

    return (data || []) as DersProgramiTeori[];
  }
}

export class DersProgramiMebbisRepository extends BaseRepository<DersProgramiMebbis> {
  constructor() {
    super('ders_programi_new_mebbis');
  }

  /**
   * Find by grup ID
   */
  async findByGrup(idGrup: number): Promise<DersProgramiMebbis[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('ge_id_grup', idGrup);

    if (error) {
      throw new Error(`Error finding mebbis program by grup: ${error.message}`);
    }

    return (data || []) as DersProgramiMebbis[];
  }

  /**
   * Mark as transferred to MEBBİS
   */
  async markAsTransferred(id: number): Promise<DersProgramiMebbis> {
    return this.update(id, {
      aktarim_durumu: true,
      aktarim_tarihi: new Date().toISOString(),
    } as Partial<DersProgramiMebbis>);
  }
}

