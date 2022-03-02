import { IsNotEmpty, IsString } from "class-validator";

export class AuthorDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}