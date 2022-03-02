import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsString } from "class-validator";

export class PostDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  mainImage: string;

  @IsString()
  tags: string;
}
