import { SupabaseClient } from '@supabase/supabase-js';

export abstract class EntityRepository<T> {
  constructor(protected tableName: string, protected supabase: any) {}

  async create(data: Partial<T>): Promise<unknown> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return result;
  }

  // entity.repository.ts

  async createInTransaction(trx: any, data: Partial<T>): Promise<any> {
    const { data: result, error } = await trx
      .from(this.tableName)
      .insert(data)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return result;
  }

  async findAll(userId: string): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select()
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findById(id: number): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select()
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async update(id: number, data: Partial<T>): Promise<any> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return result;
  }

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
  }

  getSupabaseInstance(): SupabaseClient {
    return this.supabase;
  }
}
