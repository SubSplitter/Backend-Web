import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PoolsService } from './pools.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { KindeAuthGuard } from 'src/auth/kinde.guard';
import { UserService } from 'src/users/users.service';
import { users } from 'src/drizzle';
import { PoolMembersService } from 'src/pool-members/pool-members.service';
import { request } from 'http';

@Controller('api/subscriptions')
export class PoolsController {
  constructor(
    private readonly PoolsService: PoolsService,
    private readonly userService: UserService,
    private readonly poolMembersService: PoolMembersService,
  ) {}

  @Post()
  @UseGuards(KindeAuthGuard)
  async create(@Req() request: Request, @Body() CreatePoolDto: CreatePoolDto) {
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
  @UseGuards(KindeAuthGuard)
  @Get()
  async findAll(@Req() request: Request) {
    // Debug the request object to see what's available
    console.log('User email from request:', (request as any).user_email);

    // Only try to get userId if we have an email
    let userId: string | undefined = undefined;

    if ((request as any).user_email) {
      try {
        userId = await this.userService.getUserUuidByRequestEmail(request);
        console.log('Retrieved userId:', userId);
      } catch (error) {
        console.log('Error getting userId:', error.message);
        // Continue with userId as undefined
      }
    }

    // Whether we got a userId or not, call the service
    return await this.PoolsService.findAll(userId);
  }

  @UseGuards(KindeAuthGuard)
  @Get('my-created')
  async findCreatedByUser(@Req() request: Request) {
    try {
      // Get the authenticated user's ID
      const userId = await this.userService.getUserUuidByRequestEmail(request);
      
      if (!userId) {
        throw new BadRequestException('User not found');
      }
      
      // Call a new method in PoolsService to find pools created by this user
      return await this.PoolsService.findPoolsCreatedByUser(userId);
    } catch (error) {
      console.error('Error fetching created pools:', error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error; // Re-throw if it's already a proper HTTP exception
      }
      throw new BadRequestException('Failed to fetch created pools');
    }
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
  async joinPool(@Req() request: Request, @Param('id') poolId: string) {
    try {
      // Get the authenticated user's ID
      const userId = await this.userService.getUserUuidByRequestEmail(request);

      // Check if pool exists
      const pool = await this.PoolsService.findOne(poolId);

      // Create the pool member using the PoolMembersService
      return await this.poolMembersService.create({
        userId: userId,
        poolId: poolId,
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
