import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";
import { IsRUT } from "../decorators/rut.decorator";

export class RegisterDto {

  @IsRUT({ message: 'El RUT ingresado no es válido.' })
  @MinLength(1)
  rut: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;
}