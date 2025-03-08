// src/drizzle/index.ts
export * from '../users/schema/user.schema';

// src/drizzle/drizzle.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './index';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  public db: ReturnType<typeof drizzle<typeof schema>>;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    this.db = drizzle(this.pool, { schema });
  }

  async onModuleInit() {
    try {
      await this.pool.query('SELECT 1');
      console.log('Database connection successful');
    } catch (error) {
      console.error('Failed to connect to database:', error);
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
