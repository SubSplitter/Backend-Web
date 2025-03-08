import { Injectable, NotFoundException } from '@nestjs/common';
import {DrizzleService} from 'src/drizzle/drizzle.service';
import * as schema from './schema/user-subscription.schema';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { eq, and, gt } from 'drizzle-orm';

@Injectable()
export class UserSubscriptionsService {
  constructor(private drizzleService: DrizzleService) {}

  async create(dto: CreateUserSubscriptionDto) {
    // Initialize slots available equal to slots total
    const slotsAvailable = dto.slotsTotal;

    const result = await this.drizzleService.db
      .insert(schema.userSubscriptions)
      .values({
        userId: dto.userId,
        serviceId: dto.serviceId,
        encryptedCredentials: dto.encryptedCredentials,
        slotsTotal: dto.slotsTotal,
        slotsAvailable,
        costPerSlot: dto.costPerSlot.toString(), // Convert to string for Decimal type
      })
      .returning();

    return result[0];
  }

  async findAll() {
    return this.drizzleService.db.select().from(schema.userSubscriptions);
  }

  async findAvailableSubscriptions() {
    return this.drizzleService.db
      .select()
      .from(schema.userSubscriptions)
      .where(
        and(
          eq(schema.userSubscriptions.isActive, true),
          gt(schema.userSubscriptions.slotsAvailable, 0),
        ),
      )
      .leftJoin(
        schema.subscriptionServices,
        eq(schema.userSubscriptions.serviceId, schema.subscriptionServices.serviceId),
      );
  }

  async findOne(id: string) {
    const results = await this.drizzleService.db
      .select()
      .from(schema.userSubscriptions)
      .where(eq(schema.userSubscriptions.userSubscriptionId, id));

    if (results.length === 0) {
      throw new NotFoundException(`User subscription with ID ${id} not found`);
    }

    return results[0];
  }

  async update(id: string, dto: UpdateUserSubscriptionDto) {
    const updateData: any = {};

    if (dto.encryptedCredentials !== undefined)
      updateData.encryptedCredentials = dto.encryptedCredentials;
    if (dto.slotsTotal !== undefined) updateData.slotsTotal = dto.slotsTotal;
    if (dto.slotsAvailable !== undefined) updateData.slotsAvailable = dto.slotsAvailable;
    if (dto.costPerSlot !== undefined) updateData.costPerSlot = dto.costPerSlot.toString();
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    updateData.updatedAt = new Date();

    const results = await this.drizzleService.db
      .update(schema.userSubscriptions)
      .set(updateData)
      .where(eq(schema.userSubscriptions.userSubscriptionId, id))
      .returning();

    if (results.length === 0) {
      throw new NotFoundException(`User subscription with ID ${id} not found`);
    }

    return results[0];
  }

  async decrementAvailableSlot(id: string) {
    const subscription = await this.findOne(id);

    if (subscription.slotsAvailable <= 0) {
      throw new Error('No available slots in this subscription');
    }

    return this.update(id, { slotsAvailable: subscription.slotsAvailable - 1 });
  }

  async remove(id: string) {
    const results = await this.drizzleService.db
      .delete(schema.userSubscriptions)
      .where(eq(schema.userSubscriptions.userSubscriptionId, id))
      .returning();

    if (results.length === 0) {
      throw new NotFoundException(`User subscription with ID ${id} not found`);
    }

    return results[0];
  }
}