import { IsDate, IsInt, isNotEmpty, IsNotEmpty, IsString, Length } from "class-validator";

export class ReactionDto {
  @IsString()
  @IsNotEmpty()
  userIp: string;

  @IsString()
  @IsNotEmpty()
  reactionType: string;
}
