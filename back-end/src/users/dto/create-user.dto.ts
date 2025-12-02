import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    rut: string;
    
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    surname: string;

    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
