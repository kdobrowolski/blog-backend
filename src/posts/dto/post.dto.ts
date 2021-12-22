import { IsDate, IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class PostDto {
  @IsInt()
  id: number;

  @IsString()
  @Length(2, 30, {
    message: 'error.too_short_title',
  })
  title: string;

  @IsString({ message: 'error.wrong_description' })
  @Length(2, 100, {
    message: 'error.too_short_description',
  })
  description: string;

  @IsString({ message: 'error.wrong_tags' })
  @IsNotEmpty({ message: 'error.wrong_tags' })
  tags: string;

  @IsDate({ message: 'error.wrong_date' })
  @IsNotEmpty({ message: 'error.wrong_date' })
  date: Date;

  @IsString({ message: 'error.wrong_content' })
  @IsNotEmpty({ message: 'error.wrong_content' })
  content: string;
}
