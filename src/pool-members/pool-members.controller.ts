import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PoolMembersService } from './pool-members.service';
import { CreatePoolMemberDto } from './dto/create-pool-member.dto';
import { UpdatePoolMemberDto } from './dto/update-pool-member.dto';
import { KindeAuthGuard } from 'src/auth/kinde.guard';
import { UserService } from 'src/users/users.service';

@Controller('api/pool-members')
export class PoolMembersController {
  constructor(
    private readonly poolMembersService: PoolMembersService,
    private readonly userService: UserService,
  ) {}

  @Post()
  create(@Body() createPoolMemberDto: CreatePoolMemberDto) {
    return this.poolMembersService.create(createPoolMemberDto);
  }

  @Get()
  findAll() {
    return this.poolMembersService.findAll();
  }

  @Get('current-user')
  @UseGuards(KindeAuthGuard)
  async getCurrentUserMemberships(@Req() request: Request) {
    const userId = await this.userService.getUserUuidByRequestEmail(request);
    const memberships = await this.poolMembersService.findByUserId(userId);

    // Extract only the pools data with proper null checks
    return memberships
      .filter((membership) => membership.pools && membership.pool_members)
      .map((membership) => {
        // Create a base object with safely accessed properties
        const poolData: any = {
          poolId: membership.pools?.poolId,
          name: membership.pools?.name,
          serviceId: membership.pools?.serviceId,
          slotsTotal: membership.pools?.slotsTotal,
          slotsAvailable: membership.pools?.slotsAvailable,
          costPerSlot: membership.pools?.costPerSlot,
          membershipStatus: {
            paymentStatus: membership.pool_members?.paymentStatus,
            accessStatus: membership.pool_members?.accessStatus,
            joinedAt: membership.pool_members?.joinedAt,
          },
        };

        // Add service info if available
        if (membership.subscription_services) {
          poolData.serviceName = membership.subscription_services.name;
          poolData.serviceLogoUrl = membership.subscription_services.logoUrl;
        }

        return poolData;
      });
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
  update(@Param('id') id: string, @Body() updatePoolMemberDto: UpdatePoolMemberDto) {
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
