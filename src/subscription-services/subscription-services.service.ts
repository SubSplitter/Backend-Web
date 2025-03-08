// // src/subscription-services/subscription-services.service.ts
import { Injectable } from '@nestjs/common';
import {DrizzleService} from 'src/drizzle/drizzle.service'
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
        description: dto.description,
        monthlyCost: dto.monthlyCost.toString(), // Convert to string for Decimal type
        regionsAvailable: dto.regionsAvailable,
      })
      .returning();
    return result[0];
  }

  async findAll() {
    return this.drizzleService.db.select().from(schema.subscriptionServices);
  }

  async findOne(id: string) { // Change id type to string
    const results = await this.drizzleService.db
      .select()
      .from(schema.subscriptionServices)
      .where(eq(schema.subscriptionServices.serviceId, id)); // id is now a string
    return results[0];
  }
  
  async update(id: string, dto: UpdateSubscriptionServiceDto) { // Change id type to string
    const updateData: any = {};
  
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.monthlyCost !== undefined) updateData.monthlyCost = dto.monthlyCost.toString();
    if (dto.regionsAvailable !== undefined) updateData.regionsAvailable = dto.regionsAvailable;
  
    updateData.updatedAt = new Date();
  
    const results = await this.drizzleService.db
      .update(schema.subscriptionServices)
      .set(updateData)
      .where(eq(schema.subscriptionServices.serviceId, id)) // id is now a string
      .returning();
  
    return results[0];
  }
  
  async remove(id: string) { // Change id type to string
    return this.drizzleService.db
      .delete(schema.subscriptionServices)
      .where(eq(schema.subscriptionServices.serviceId, id)) // id is now a string
      .returning();
  }
  
}
