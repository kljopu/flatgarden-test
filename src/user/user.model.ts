import bcrypt from "bcrypt"
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { Board } from '../board/board.model';
import { BaseModel } from '../shared/base.model';
import { Column, Entity, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsEmail, IsString } from "class-validator"
import { InternalServerErrorException } from "@nestjs/common";

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends BaseModel {
  @Column()
  @Field((_) => String)
  name!: string;

  @Column({ unique: true })
  @Field(type => String)
  @IsEmail()
  email: string

  @Column()
  @Field(type => String)
  @IsString()
  password: string

  @OneToMany(
    () => Board,
    (board) => board.author,
  )
  @Field((_) => [Board])
  boards!: Board[];

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10)
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException()
      }
    }
  }
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password)
      return ok
    } catch (error) {
      console.log("err", error);
      throw new InternalServerErrorException()
    }
  }
}
