// src/subscription-services/subscription-services.service.ts
import { Injectable } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service'
import * as schema from './schema/subscriptions-services.schema';
import { CreateSubscriptionServiceDto } from './dto/create-subscription-service.dto';
import { UpdateSubscriptionServiceDto } from './dto/update-subscription-service.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class SubscriptionServicesService {
  constructor(private drizzleService: DrizzleService) {}

  async create(dto: CreateSubscriptionServiceDto) {
    const result = await this.drizzleService.db
      .insert(schema.subscriptionServices)
      .values({
        name: dto.name,
        description: dto.description || null,
        // Remove monthlyCost as it's no longer in the schema
        regionsAvailable: dto.regionsAvailable || [],
        // Add default values for other required fields
        slug: dto.name.toLowerCase().replace(/\s+/g, '-'), // Generate slug from name
        logoUrl: null,
        color: null,
        category: null,
        featuredPosition: null
      })
      .returning();
    return result[0];
  }

  async findAll() {
    return this.drizzleService.db.select().from(schema.subscriptionServices);
  }

  async findOne(id: string) {
    const results = await this.drizzleService.db
      .select()
      .from(schema.subscriptionServices)
      .where(eq(schema.subscriptionServices.serviceId, id));
    return results[0];
  }
  
  async update(id: string, dto: UpdateSubscriptionServiceDto) {
    const updateData: any = {};
  
    if (dto.name !== undefined) {
      updateData.name = dto.name;
      // Also update the slug when name changes
      updateData.slug = dto.name.toLowerCase().replace(/\s+/g, '-');
    }
    if (dto.description !== undefined) updateData.description = dto.description;
    // Remove monthlyCost update
    if (dto.regionsAvailable !== undefined) updateData.regionsAvailable = dto.regionsAvailable;
  
    updateData.updatedAt = new Date();
  
    const results = await this.drizzleService.db
      .update(schema.subscriptionServices)
      .set(updateData)
      .where(eq(schema.subscriptionServices.serviceId, id))
      .returning();
  
    return results[0];
  }
  
  async remove(id: string) {
    return this.drizzleService.db
      .delete(schema.subscriptionServices)
      .where(eq(schema.subscriptionServices.serviceId, id))
      .returning();
  }
}