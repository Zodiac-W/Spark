import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signupUser(createUserDto: CreateUserDto): Promise<any> {
    const { user_name, user_email, user_phone, user_pass, user_role } =
      createUserDto;

    const exist = await this.getUserByPhone(user_phone);
    if (exist) {
      throw Error('This phone number is already used');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user_pass, salt);

    const user = new User();
    user.user_name = user_name;
    user.user_email = user_email;
    user.user_phone = user_phone;
    user.user_pass = hash;
    user.user_role = user_role;

    await this.userRepository.save(user);

    const { user_pass: pass, ...userPassed } = user;

    return userPassed;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const { user_email, user_pass } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { user_email } });

    if (!user) {
      throw Error('Incorrect Email');
    }

    const match = await bcrypt.compare(user_pass, user.user_pass);

    if (!match) {
      throw Error('Incorrect password');
    }

    const { user_pass: pass, ...userPassed } = user;

    return userPassed;
  }

  async getUser(id: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw Error('User does not exist');
    }
    const userId = user.id;
    // Here we can return whatever data we want to add to the user object in the request object
    return { userId };
  }

  async getOneUser(id: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id } });

    return user;
  }

  async getAllUsers(): Promise<any> {
    const users = await this.userRepository.find();

    return users;
  }

  async getAllUsersNames(): Promise<any> {
    const userNames = await this.userRepository.find({ select: ['user_name'] });

    return userNames;
  }

  async deleteUser(id: number): Promise<any> {
    const user = await this.getOneUser(id);

    await this.userRepository.softDelete(id);

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    let user = await this.getOneUser(id);

    user = { ...user, ...updateUserDto };
    await this.userRepository.save(user);

    return user;
  }

  async getUserByPhone(phone: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { user_phone: phone },
    });
    return user;
  }

  async getAllUserContacts(id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['contact'],
    });

    const contact = user.contact;

    return contact;
  }
}
