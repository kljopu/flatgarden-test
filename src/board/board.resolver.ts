import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Board } from './board.model';
import { BoardService } from './board.service';
import { UserService } from 'src/user/user.service';
import { BoardOutput, BoardDefaultOutput } from './dtos/board.default.output.dto';
import { BoardCreateInput } from './dtos/board.create.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GqlUser } from 'src/shared/decorator/decorator';
import { BoardEditInput } from './dtos/board.edit.dto';
import { CommonOutPut } from 'src/shared/dtos/output.dto';

@Resolver(of => Board)
export class BoardResolver {
    constructor(
        private readonly boadService: BoardService,
        private readonly userService: UserService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Mutation(returns => BoardDefaultOutput)
    async createBoard(
        @Args('input') input: BoardCreateInput,
        @GqlUser() user: any
    ): Promise<BoardDefaultOutput> {
        const author = await this.userService.findById(user.userId)
        return this.boadService.createBoard(author, input)
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(returns => BoardOutput)
    async getAllBoards(): Promise<BoardOutput> {
        { return this.boadService.getAllBoards() }
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(returns => BoardDefaultOutput)
    async editMyBoard(
        @Args('input') input: BoardEditInput,
        @GqlUser() user: any
    ): Promise<BoardDefaultOutput> {
        return await this.boadService.editMyBoard(user.userId, input)
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(returns => CommonOutPut)
    async deleteMyBoard(
        @Args('boardId') boardId: number,
        @GqlUser() user: any
    ): Promise<CommonOutPut> {
        return this.boadService.deleteMyBoard(user.userId, boardId)
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(returns => BoardOutput)
    async getBoards(
        @GqlUser() user: any
    ): Promise<BoardOutput> {
        return this.boadService.getBoards(user.userId)
    }
}