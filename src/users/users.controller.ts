import {
  Controller,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/decorators';
import { IUser } from './interfaces';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Put('/change-avatar')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@CurrentUser() user: IUser) {
    // return this.userService.changeAvatar();
  }
}
