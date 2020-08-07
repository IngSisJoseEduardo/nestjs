import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialDto {
    
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8,{message: 'Minimo de caracteres permitidos 8'})
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{message:'La contraseña no cumple los requisitos'})
    password: string;
}