import { Field, ObjectType, InputType, } from '@nestjs/graphql';

@InputType()
export class UserProfileInput {
    @Field(type => String)
    email?: string;

    @Field(type => String, { nullable: true })
    name?: string
}

@ObjectType()
export class UserProfileOutput { }

