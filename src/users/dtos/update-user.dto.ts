import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class UpdateUserDto { // We can provide email, or password or both
    @IsEmail()
    @IsOptional()
    email: string;

    @IsStrongPassword()
    @IsOptional()
    password: string;
}