// src/drizzle/drizzle.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './index';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  public db: ReturnType<typeof drizzle<typeof schema>>;

  constructor(private configService: ConfigService) {
    const dbConfig = this.configService.get('database');
    if (!dbConfig.connectionString) {
      throw new Error('Database connection string is not provided');
    }

    this.pool = new Pool(dbConfig);
    this.db = drizzle(this.pool, { schema });
  }

  async onModuleInit() {
    try {
      await this.pool.query('SELECT 1');
      console.log('Database connection successful');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error; // Re-throw to prevent app from starting with failed DB connection
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}