import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from "./dtos/user-create.dto"
import { UserProfileInput, UserProfileOutput } from "./dtos/user.profile.dto"
import { LoginInput, LoginOutput } from "./dtos/login.dto"
import { User } from './user.model';
import { UserOutPut } from 'src/auth/dtos/auth-login.dto';
import { CommonOutPut } from 'src/shared/dtos/output.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {
    console.log('use this repository user', User);
  }
  async createUser({ name, email, password }: CreateUserInput)
    : Promise<CreateUserOutput> {
    try {
      const existingUser = await this.users.findOne({ email })
      if (existingUser) {
        return { ok: false, error: "USER ALREADY EXISTS" }
      }
      const user = await this.users.save(
        this.users.create({ email, password, name }),
      );
      return { ok: true }
    } catch (error) {
      console.log(error);
      return { ok: false, error: "ACCOUNT CREATION FAILD" }
    }
  }

  async login({ email, password }: LoginInput)
    : Promise<LoginOutput> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] }
      )
      console.log(user);
      if (!user) {
        return {
          ok: false,
          error: "USER NOT FOUND"
        }
      }

      const isValidate = await user.checkPassword(password)
      if (!isValidate) {
        return {
          ok: false,
          error: "WRONG PASSWORD"
        }
      }
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "LOGIN FAILD"
      }
    }
  }

  async findById(id: number): Promise<User> {
    try {
      console.log("id", id);
      const user: User = await this.users.findOneOrFail({ id });
      if (!user) {
        throw new NotFoundException(`USER NOT FOUND ${id}`)
      }
      return user
    } catch (error) {
      throw new InternalServerErrorException('INTERNAL SERVER ERROR')
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user: User = await this.users.findOne({ email: email })
      if (!user) {
        throw new NotFoundException(`USER NOT FOUND ${email}`)
      }
      return user
    } catch (error) {
      console.log(error);
      throw new BadRequestException()
    }
  }

  //Profile Options
  async getProfile(email: any): Promise<User> {
    try {
      const user = await this.findByEmail(email)
      return user
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('INTERNAL SERVER ERROR')
    }
  }

  async editProfile(data: UserProfileInput, userId: number): Promise<UserOutPut> {
    try {
      const { email, name } = data
      const user = await this.findById(userId)
      if (email) {
        if (name) {
          // input email, name
          user.name = name
        }
        // input email
        user.email = email
      }
      await this.users.save(user)
      return { user }
    } catch (error) {
      throw new InternalServerErrorException('CAN NOT UPDATE PROFILE')
    }
  }

  async deleteUser(userId: number): Promise<CommonOutPut> {
    try {
      const user = await this.findById(userId)
      console.log(user);
      this.users.softDelete(user.id)
      return {
        ok: true
      }
    } catch (error) {
      throw new InternalServerErrorException('INTERNAL SERVER ERROR')
    }
  }
}
