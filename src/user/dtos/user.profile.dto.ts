import { Field, ObjectType, InputType, } from '@nestjs/graphql';
import { CommonOutPut } from '../../shared/dtos/output.dto';
import { User } from '../user.model';
// import {CommonOutPut} from "../../shared/dtos/output.dto"

@InputType()
export class UserProfileInput {
    @Field(type => String)
    email?: string;

    @Field(type => String)
    name?: string
}

@ObjectType()
export class UserProfileOutput { }

