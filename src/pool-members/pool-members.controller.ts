import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
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

  //kitne joined hai
  @Get('current-user')
  @UseGuards(KindeAuthGuard)
  async getCurrentUserMemberships(@Req() request: Request) {
    const userId = await this.userService.getUserUuidByRequestEmail(request);
    const memberships = await this.poolMembersService.findByUserId(userId);

    // Filter out memberships where the user has left
    const activeMemberships = memberships.filter(
      (membership) => membership.pool_members?.membershipStatus !== 'left',
    );

    // Transform the data to include both pool and membership information
    return activeMemberships
      .map((membership) => {
        if (!membership.pools) {
          return null;
        }

        return {
          ...membership.pools,
          membershipStatus: membership.pool_members?.membershipStatus || 'active',
          membershipId: membership.pool_members?.poolMemberId,
          memberInfo: {
            paymentStatus: membership.pool_members?.paymentStatus || 'unpaid',
            accessStatus: membership.pool_members?.accessStatus || 'pending',
            joinedAt: membership.pool_members?.joinedAt,
          },
        };
      })
      .filter(Boolean); // Remove any null entries
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

  @Patch(':id/membership/:status')
  updateMembershipStatus(
    @Param('id') id: string,
    @Param('status') status: 'active' | 'inactive' | 'left',
  ) {
    return this.poolMembersService.updateMembershipStatus(id, status);
  }

  @Post(':id/leave')
  @UseGuards(KindeAuthGuard)
  async leavePool(@Param('id') id: string, @Req() request: Request) {
    // Optional: Verify that the logged-in user is the owner of this membership
    const userId = await this.userService.getUserUuidByRequestEmail(request);
    const membership = await this.poolMembersService.findOne(id);

    if (membership.userId !== userId) {
      throw new BadRequestException('You do not have permission to leave this pool');
    }

    return this.poolMembersService.leavePool(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poolMembersService.remove(id);
  }
}
