import { Controller, Post, Body, Headers, Get, Put } from '@nestjs/common';
import { AuthHandler } from '../useCases/authHandler.service';
import { User } from '../infrastructure/domain/user';

@Controller('auth')
export class AuthRouter {
  constructor(private readonly authHandler: AuthHandler) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('roleId') roleId: number,
  ) {
    return this.authHandler.register(email, password, roleId);
  }

  @Get('user')
  async getUser(@Headers('authorization') authorization: string) {
    return this.authHandler.getUser(authorization);
  }

  @Put('user')
  async updateUser(@Body() user: User) {
    return this.authHandler.updateUser(user);
  }
}
