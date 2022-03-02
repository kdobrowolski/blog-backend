import { IsNotEmpty, IsString } from "class-validator";

export class CommentDto {

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
