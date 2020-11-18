import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { User } from "./user.model"
import { CreateUserInput, CreateUserOutput } from "./dtos/user-create.dto"
import { UserService } from "./user.service"
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserOutPut } from 'src/auth/dtos/auth-login.dto';
import { UserProfileInput } from './dtos/user.profile.dto';
import { GqlUser } from 'src/shared/decorator/decorator';
import { CommonOutPut } from 'src/shared/dtos/output.dto';

@Resolver(of => User)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Mutation(returns => CreateUserOutput)
    async createUser(
        @Args('input') createUserInput: CreateUserInput,
    ): Promise<CreateUserOutput> {
        return this.userService.createUser(createUserInput)
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(returns => UserOutPut)
    async getMyProfile(
        @Args('input') input: UserProfileInput,
        @GqlUser() user: any
    ): Promise<any> {
        console.log(input);
        const { email } = input
        console.log(email);
        return this.userService.getProfile(email)
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(returns => UserOutPut)
    async editMyProfile(
        @Args('input') input: UserProfileInput, @Args('userId') userId: number): Promise<UserOutPut> {
        return this.userService.editProfile(input, userId)
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(returns => CommonOutPut)
    async deleteUser(
        @GqlUser() user: any
    ): Promise<CommonOutPut> {
        return this.userService.deleteUser(user.userId)
    }
}
