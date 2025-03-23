import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { PoolsService } from './pools.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { KindeAuthGuard } from 'src/auth/kinde.guard';
import { UserService } from 'src/users/users.service';
import { users } from 'src/drizzle';
import { PoolMembersService } from 'src/pool-members/pool-members.service';

@Controller('api/subscriptions')
export class PoolsController {
  constructor(
    private readonly PoolsService: PoolsService,
    private readonly userService: UserService,
    private readonly poolMembersService: PoolMembersService) {}
  
@Post()
@UseGuards(KindeAuthGuard)
async create(
  @Req() request: Request,
  @Body() CreatePoolDto: CreatePoolDto
) {
  // You'll need to add the custom typing for the request as discussed earlier
  const userEmail = (request as any).user_email;
  console.log(userEmail);
  CreatePoolDto.userId = await this.userService.getUserUuidByRequestEmail(request);
  console.log(CreatePoolDto.userId);
  
  // You can now use the email with your DTO
  return this.PoolsService.create({
    ...CreatePoolDto,
   // Assuming your service needs this
  });
}

  @Get()
  findAll() {
    return this.PoolsService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.PoolsService.findAvailableSubscriptions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.PoolsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdatePoolDto: UpdatePoolDto) {
    return this.PoolsService.update(id, UpdatePoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.PoolsService.remove(id);
  }
  @Post(':id/join')
  @UseGuards(KindeAuthGuard)
  async joinPool(
    @Req() request: Request,
    @Param('id') poolId: string
  ) {
    try {
      // Get the authenticated user's ID
      const userId = await this.userService.getUserUuidByRequestEmail(request);
      
      // Check if pool exists
      const pool = await this.PoolsService.findOne(poolId);
      
      // Create the pool member using the PoolMembersService
      return await this.poolMembersService.create({
        userId: userId,
        poolId: poolId
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error; // Re-throw the original error if it's already a proper HTTP exception
      }
      console.error('Error joining pool:', error);
      throw new BadRequestException('Failed to join pool');
    }
  }
}