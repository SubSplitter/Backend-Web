import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserSubscriptionsService } from './pools.service';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { KindeAuthGuard } from 'src/auth/kinde.guard';
import { UserService } from 'src/users/users.service';
import { users } from 'src/drizzle';

@Controller('api/subscriptions')
export class UserSubscriptionsController {
  constructor(private readonly userSubscriptionsService: UserSubscriptionsService,
    private readonly userService: UserService) {}
  
  @Post()
@UseGuards(KindeAuthGuard)
async create(
  @Req() request: Request,
  @Body() createUserSubscriptionDto: CreateUserSubscriptionDto
) {
  // You'll need to add the custom typing for the request as discussed earlier
  const userEmail = (request as any).user_email;
  console.log(userEmail);
  createUserSubscriptionDto.userId = await this.userService.getUserUuidByRequestEmail(request);
  console.log(createUserSubscriptionDto.userId);
  
  // You can now use the email with your DTO
  return this.userSubscriptionsService.create({
    ...createUserSubscriptionDto,
   // Assuming your service needs this
  });
}

  @Get()
  findAll() {
    return this.userSubscriptionsService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.userSubscriptionsService.findAvailableSubscriptions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSubscriptionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserSubscriptionDto: UpdateUserSubscriptionDto) {
    return this.userSubscriptionsService.update(id, updateUserSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSubscriptionsService.remove(id);
  }
}