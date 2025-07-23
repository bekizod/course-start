/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
  Redirect,
  Query,
  Res,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
@Roles(Role.USER)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Public()
  // @Post('/register')
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    const isVerified = await this.userService.verifyEmail(token);

    if (!isVerified) {
      const errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Verification Failed</title>
        <meta http-equiv="refresh" content="3;url=${process.env.FRONTEND_URL}/error?message=Invalid verification token">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .message { margin: 20px 0; color: #d32f2f; }
        </style>
      </head>
      <body>
        <h1>Email Verification Failed</h1>
        <div class="message">Invalid verification token. Redirecting...</div>
        <p>If you are not redirected automatically, <a href="${process.env.FRONTEND_URL}/error?message=Invalid verification token">click here</a>.</p>
      </body>
      </html>
    `;
      return res.status(400).send(errorHtml);
    }

    const successHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Verification Successful</title>
      <meta http-equiv="refresh" content="3;url=${process.env.FRONTEND_LOGIN_URL}">
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .message { margin: 20px 0; color: #388e3c; }
      </style>
    </head>
    <body>
      <h1>Email Verified Successfully!</h1>
      <div class="message">Thank you for verifying your email. Redirecting to login...</div>
      <p>If you are not redirected automatically, <a href="${process.env.FRONTEND_LOGIN_URL}">click here</a>.</p>
    </body>
    </html>
  `;
    return res.status(200).send(successHtml);
  }

  @Get('profile')
  getProfile(@Req() req) {
    return this.userService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update-password')
  updatePassword(@Body() body, @Req() req) {
    return this.userService.resetPassword(body, req.user);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @SetMetadata('role', 'ADMIN')
  @Roles(Role.ADMIN)
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  @Delete('/deleteUser/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
// function UseGuards(JwtAuthGuard: typeof JwtAuthGuard): (target: UserController, propertyKey: "getProfile", descriptor: TypedPropertyDescriptor<(req: any) => string>) => void | TypedPropertyDescriptor<(req: any) => string> {
//   throw new Error('Function not implemented.');
// }
