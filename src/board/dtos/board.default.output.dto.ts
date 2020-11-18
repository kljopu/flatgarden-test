import { ObjectType, Field, PickType, PartialType } from "@nestjs/graphql";
import { Board } from "../board.model"
import { CommonOutPut } from "src/shared/dtos/output.dto";

@ObjectType()
export class BoardOutput {
    @Field(type => [Board], { nullable: true })
    boards: Board[];
}

@ObjectType()
export class BoardDefaultOutput extends CommonOutPut {
    @Field(type => Board)
    boards?: Board
}