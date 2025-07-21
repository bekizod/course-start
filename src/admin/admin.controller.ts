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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { UserService } from 'src/user/user.service';

@Roles(Role.ADMIN, Role.SUPERADMIN)
@Controller('/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  @Post('/registerRole')
  @Roles(Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get('/roles')
  @Roles(Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Req() req) {
    return this.adminService.findAll(req.user.id);
  }

  @Get('/roles/:id')
  @Roles(Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findProfile(@Req() req) {
    return this.userService.findOne(req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
