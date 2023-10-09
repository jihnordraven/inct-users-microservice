import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator';

type RegisterType = {
  email: string;
  login: string;
  passw: string;
};

export class RegisterDTO implements RegisterType {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 18)
  readonly login: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 18)
  readonly passw: string;
}
