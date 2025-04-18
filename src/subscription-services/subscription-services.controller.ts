// src/subscription-services/subscription-services.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscriptionServicesService } from './subscription-services.service';
import { CreateSubscriptionServiceDto } from './dto/create-subscription-service.dto';
import { UpdateSubscriptionServiceDto } from './dto/update-subscription-service.dto';
@Controller('api/subscription-services')
export class SubscriptionServicesController {
  constructor(private readonly subscriptionServicesService: SubscriptionServicesService) {}

  @Post()
  create(@Body() createSubscriptionServiceDto: CreateSubscriptionServiceDto) {
    return this.subscriptionServicesService.create(createSubscriptionServiceDto);
  }

  @Get()
  findAll() {
    return this.subscriptionServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionServicesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionServiceDto: UpdateSubscriptionServiceDto,
  ) {
    return this.subscriptionServicesService.update(id, updateSubscriptionServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionServicesService.remove(id);
  }
}
