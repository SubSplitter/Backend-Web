import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import * as schema from './schema/poolMembers.schems';
import { CreatePoolMemberDto } from './dto/create-pool-member.dto';
import { UpdatePoolMemberDto } from './dto/update-pool-member.dto';
import { eq, and } from 'drizzle-orm';
import { UserSubscriptionsService } from '../pools/pools.service';

@Injectable()
export class PoolMembersService {
  constructor(
    private drizzleService: DrizzleService,
    private userSubscriptionsService: UserSubscriptionsService,
  ) {}

  async create(dto: CreatePoolMemberDto) {
    // Check if the user is already a member of this subscription
    const existingMember = await this.drizzleService.db.select()
      .from(schema.poolMembers)
      .where(
        and(
          eq(schema.poolMembers.userId, dto.userId),
          eq(schema.poolMembers.userSubscriptionId, dto.userSubscriptionId)
        )
      );
    
    if (existingMember.length > 0) {
      throw new BadRequestException('User is already a member of this subscription pool');
    }
    
    // Get subscription and check availability
    const subscription = await this.userSubscriptionsService.findOne(dto.userSubscriptionId);
    
    if (!subscription.isActive) {
      throw new BadRequestException('This subscription is not active');
    }
    
    if (subscription.slotsAvailable <= 0) {
      throw new BadRequestException('No available slots in this subscription');
    }
    
    // Decrement available slots
    await this.userSubscriptionsService.decrementAvailableSlot(dto.userSubscriptionId);
    
    // Create pool member
    const result = await this.drizzleService.db.insert(schema.poolMembers).values({
      userId: dto.userId,
      userSubscriptionId: dto.userSubscriptionId,
      paymentStatus: 'unpaid', // Default status
      accessStatus: 'pending', // Default status
    }).returning();
    
    return result[0];
  }

  async findAll() {
    return this.drizzleService.db.select().from(schema.poolMembers);
  }

  async findByUserId(userId: string) {
    return this.drizzleService.db.select()
      .from(schema.poolMembers)
      .where(eq(schema.poolMembers.userId, userId))
      .leftJoin(
        schema.userSubscriptions,
        eq(schema.poolMembers.userSubscriptionId, schema.userSubscriptions.userSubscriptionId)
      )
      .leftJoin(
        schema.subscriptionServices,
        eq(schema.userSubscriptions.serviceId, schema.subscriptionServices.serviceId)
      );
  }

  async findBySubscriptionId(subscriptionId: string) {
    return this.drizzleService.db.select()
      .from(schema.poolMembers)
      .where(eq(schema.poolMembers.userSubscriptionId, subscriptionId));
  }

  async findOne(id: string) {
    const results = await this.drizzleService.db.select()
      .from(schema.poolMembers)
      .where(eq(schema.poolMembers.poolMemberId, id));
    
    if (results.length === 0) {
      throw new NotFoundException(`Pool member with ID ${id} not found`);
    }
    
    return results[0];
  }

  async update(id: string, dto: UpdatePoolMemberDto) {
    const updateData: any = {};
    
    if (dto.paymentStatus !== undefined) updateData.paymentStatus = dto.paymentStatus;
    if (dto.accessStatus !== undefined) updateData.accessStatus = dto.accessStatus;
    if (dto.lastPaymentDate !== undefined) updateData.lastPaymentDate = dto.lastPaymentDate;
    
    const results = await this.drizzleService.db.update(schema.poolMembers)
      .set(updateData)
      .where(eq(schema.poolMembers.poolMemberId, id))
      .returning();
    
    if (results.length === 0) {
      throw new NotFoundException(`Pool member with ID ${id} not found`);
    }
    
    return results[0];
  }

  async updateAccessStatus(id: string, status: 'pending' | 'granted' | 'revoked') {
    return this.update(id, { accessStatus: status });
  }

  async updatePaymentStatus(id: string, status: 'unpaid' | 'processing' | 'paid' | 'failed') {
    const updateData: any = {
      paymentStatus: status,
    };
    
    if (status === 'paid') {
      updateData.lastPaymentDate = new Date();
    }
    
    return this.update(id, updateData);
  }

  async remove(id: string) {
    // Get the pool member to find associated subscription
    const poolMember = await this.findOne(id);
    
    // Remove pool member
    const results = await this.drizzleService.db.delete(schema.poolMembers)
      .where(eq(schema.poolMembers.poolMemberId, id))
      .returning();
    
    if (results.length === 0) {
      throw new NotFoundException(`Pool member with ID ${id} not found`);
    }
    
    // Increment available slots in the subscription
    if (!poolMember.userSubscriptionId) {
      throw new BadRequestException('User subscription ID is null');
    }
    const subscription = await this.userSubscriptionsService.findOne(poolMember.userSubscriptionId);
    await this.userSubscriptionsService.update(
      subscription.userSubscriptionId, 
      { slotsAvailable: subscription.slotsAvailable + 1 }
    );
    
    return results[0];
  }
}