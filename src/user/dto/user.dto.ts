import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UserRegisterDto {
  @IsString()
  @Length(2, 30, {
    message: 'error.too_short_username',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: ' The min length of password is 8 ' })
  @MaxLength(20, {
    message: " The password can't accept more than 20 characters ",
  })
  // @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/,
  //     { message: " A password at least contains one numeric digit, one supercase char and one lowercase char" }
  // )
  password: string;

  @IsNotEmpty()
  firstName?: string;

  @IsNotEmpty()
  lastName?: string;
}
