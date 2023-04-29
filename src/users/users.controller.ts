import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { User } from 'src/decorators/user.decorator';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all the users',
    type: [CreateUserDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get all users names' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of all users names',
    type: [String],
  })
  @UseGuards(JwtAuthGuard)
  @Get('all/names')
  getAllUsersNames() {
    return this.usersService.getAllUsersNames();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The user with the specified id',
    type: CreateUserDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getOneUser(id);
  }

  @ApiOperation({ summary: 'Get all user contacts phone numbers' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The user contacts phone numbers',
  })
  @UseGuards(JwtAuthGuard)
  @Get('contacts/all')
  getAllUserContacts(@User() user: any) {
    return this.usersService.getAllUserContacts(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('phone')
  userByPhone(@Body('phoneNumber') phoneNumber: string) {
    return this.usersService.getUserByPhone(phoneNumber);
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'the id of the user to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The deleted user',
    type: CreateUserDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @ApiOperation({ summary: 'Update user data' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'the id of the user to upadte',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated user',
    type: CreateUserDto,
  })
  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
