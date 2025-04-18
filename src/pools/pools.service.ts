// File: src/pools/pools.service.ts (renamed from user-subscriptions.service.ts)
import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import * as schema from './schema/pools.schema';
import { CreatePoolDto } from './dto/create-pool.dto'; // Renamed from CreateUserSubscriptionDto
import { UpdatePoolDto } from './dto/update-pool.dto'; // Renamed from UpdateUserSubscriptionDto
import { eq, and, gt } from 'drizzle-orm';

@Injectable()
export class PoolsService {
  constructor(private drizzleService: DrizzleService) {}

  async create(dto: CreatePoolDto) {
    // Initialize slots available equal to slots total
    const slotsAvailable = dto.slotsTotal;

    const result = await this.drizzleService.db
      .insert(schema.pools) // Changed from userSubscriptions to pools
      .values({
        userId: dto.userId,
        serviceId: dto.serviceId,
        name: dto.name, // Added name field
        encryptedCredentials: dto.encryptedCredentials,
        slotsTotal: dto.slotsTotal,
        slotsAvailable,
        costPerSlot: dto.costPerSlot.toString(), // Convert to string for Decimal type
      })
      .returning();

    return result[0];
  }

  async findAll() {
    return this.drizzleService.db.select().from(schema.pools); // Changed from userSubscriptions to pools
  }

  async findAvailableSubscriptions() {
    return this.drizzleService.db
      .select()
      .from(schema.pools) // Changed from userSubscriptions to pools
      .where(
        and(
          eq(schema.pools.isActive, true), // Changed from userSubscriptions to pools
          gt(schema.pools.slotsAvailable, 0), // Changed from userSubscriptions to pools
        ),
      )
      .leftJoin(
        schema.subscriptionServices,
        eq(schema.pools.serviceId, schema.subscriptionServices.serviceId), // Changed from userSubscriptions to pools
      );
  }

  async findOne(id: string) {
    const results = await this.drizzleService.db
      .select()
      .from(schema.pools) // Changed from userSubscriptions to pools
      .where(eq(schema.pools.poolId, id)); // Changed from userSubscriptionId to poolId

    if (results.length === 0) {
      throw new NotFoundException(`Pool with ID ${id} not found`); // Changed from User subscription to Pool
    }

    return results[0];
  }

  async update(id: string, dto: UpdatePoolDto) {
    const updateData: any = {};

    if (dto.name !== undefined) updateData.name = dto.name; // Added name field
    if (dto.encryptedCredentials !== undefined)
      updateData.encryptedCredentials = dto.encryptedCredentials;
    if (dto.slotsTotal !== undefined) updateData.slotsTotal = dto.slotsTotal;
    if (dto.slotsAvailable !== undefined) updateData.slotsAvailable = dto.slotsAvailable;
    if (dto.costPerSlot !== undefined) updateData.costPerSlot = dto.costPerSlot.toString();
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    updateData.updatedAt = new Date();

    const results = await this.drizzleService.db
      .update(schema.pools) // Changed from userSubscriptions to pools
      .set(updateData)
      .where(eq(schema.pools.poolId, id)) // Changed from userSubscriptionId to poolId
      .returning();

    if (results.length === 0) {
      throw new NotFoundException(`Pool with ID ${id} not found`); // Changed from User subscription to Pool
    }

    return results[0];
  }

  async decrementAvailableSlot(id: string) {
    const pool = await this.findOne(id); // Changed from subscription to pool

    if (pool.slotsAvailable <= 0) {
      throw new Error('No available slots in this pool'); // Changed from subscription to pool
    }
    console.log(pool.slotsAvailable);
    return this.update(id, { slotsAvailable: pool.slotsAvailable - 1 }); // Changed from subscription to pool
  }

  async remove(id: string) {
    const results = await this.drizzleService.db
      .delete(schema.pools) // Changed from userSubscriptions to pools
      .where(eq(schema.pools.poolId, id)) // Changed from userSubscriptionId to poolId
      .returning();

    if (results.length === 0) {
      throw new NotFoundException(`Pool with ID ${id} not found`); // Changed from User subscription to Pool
    }

    return results[0];
  }
}
