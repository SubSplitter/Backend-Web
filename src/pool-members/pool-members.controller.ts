import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PoolMembersService } from './pool-members.service';
import { CreatePoolMemberDto } from './dto/create-pool-member.dto';
import { UpdatePoolMemberDto } from './dto/update-pool-member.dto';

@Controller('api/pool-members')
export class PoolMembersController {
  constructor(private readonly poolMembersService: PoolMembersService) {}

  @Post()
  create(@Body() createPoolMemberDto: CreatePoolMemberDto) {
    return this.poolMembersService.create(createPoolMemberDto);
  }

  @Get()
  findAll() {
    return this.poolMembersService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.poolMembersService.findByUserId(userId);
  }

  @Get('subscription/:subscriptionId')
  findBySubscription(@Param('subscriptionId') subscriptionId: string) {
    return this.poolMembersService.findBySubscriptionId(subscriptionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poolMembersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePoolMemberDto: UpdatePoolMemberDto,
  ) {
    return this.poolMembersService.update(id, updatePoolMemberDto);
  }

  @Patch(':id/access/:status')
  updateAccess(
    @Param('id') id: string,
    @Param('status') status: 'pending' | 'granted' | 'revoked',
  ) {
    return this.poolMembersService.updateAccessStatus(id, status);
  }

  @Patch(':id/payment/:status')
  updatePayment(
    @Param('id') id: string,
    @Param('status') status: 'unpaid' | 'processing' | 'paid' | 'failed',
  ) {
    return this.poolMembersService.updatePaymentStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poolMembersService.remove(id);
  }
}