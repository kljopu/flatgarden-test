import { Module, forwardRef } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardResolver } from './board.resolver';
import { Board } from './board.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([Board])],
  providers: [BoardService, BoardResolver],
  exports: [TypeOrmModule],
})
export class BoardModule { }
