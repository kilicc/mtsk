import { supabase } from '../db/supabase';

/**
 * Base Repository class for Supabase operations
 * Custom DAL pattern - no TypeORM/Prisma
 */
export abstract class BaseRepository<T> {
  protected tableName: string;
  protected supabase = supabase;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Get all records
   * @param filters - Additional filters to apply
   * @param subeId - Optional sube ID to filter by (if table has id_sube column)
   */
  async findAll(filters?: Record<string, any>, subeId?: number): Promise<T[]> {
    let query = supabase.from(this.tableName).select('*');

    // Şube filtresi ekle (eğer tabloda id_sube kolonu varsa)
    if (subeId !== undefined) {
      query = query.eq('id_sube', subeId);
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching ${this.tableName}: ${error.message}`);
    }

    return (data || []) as T[];
  }

  /**
   * Find by ID
   */
  async findById(id: number | string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Error fetching ${this.tableName} by id: ${error.message}`);
    }

    return data as T;
  }

  /**
   * Create new record
   * @param entity - Entity data to create
   * @param subeId - Optional sube ID to set (if table has id_sube column)
   */
  async create(entity: Partial<T>, subeId?: number): Promise<T> {
    const entityData = { ...entity };
    
    // Şube ID ekle (eğer tabloda id_sube kolonu varsa ve entity'de yoksa)
    if (subeId !== undefined && !('id_sube' in entityData)) {
      (entityData as any).id_sube = subeId;
    }
    
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(entityData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating ${this.tableName}: ${error.message}`);
    }

    return data as T;
  }

  /**
   * Update record
   */
  async update(id: number | string, updates: Partial<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating ${this.tableName}: ${error.message}`);
    }

    return data as T;
  }

  /**
   * Delete record
   */
  async delete(id: number | string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting ${this.tableName}: ${error.message}`);
    }

    return true;
  }

  /**
   * Count records
   */
  async count(filters?: Record<string, any>): Promise<number> {
    let query = supabase.from(this.tableName).select('*', { count: 'exact', head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`Error counting ${this.tableName}: ${error.message}`);
    }

    return count || 0;
  }
}

