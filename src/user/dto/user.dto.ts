import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  MinLength,
  MaxLength, IsBoolean, IsArray
} from "class-validator";

export class UserDto {
  @IsString()
  @Length(2, 30, {
    message: 'error.too_short_name',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: ' The min length of password is 8 ' })
  @MaxLength(20, {
    message: " The password can't accept more than 20 characters ",
  })
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsArray()
  roles: string[]
}

export class UserLoginDto {
  @IsString()
  name: string;

  @IsString()
  password: string;
}

export class UserFullNameDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}

export class UserEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UserPasswordDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  oldPassword: string;
}