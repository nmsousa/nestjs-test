import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) {
    }

    async signup(email: string, password: string) {
        // See if the email is in use
        const users: User[] = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException('The provided email is already in use');
        }

        // Hash user's password with salt, to make it safer (format: salt.hashed_password)

        // 1 - Generate a salt
        const salt = randomBytes(8).toString('hex');

        // 2 - Hash the password and the salt together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // 3 - Join the salt and the hashed result
        const result =  salt + '.' + hash.toString('hex');

        // 4 - Create a new user and save it
        const user = await this.usersService.createUser(email, result);

        return user;
    }

    async signin(email: string, password: string) {
        // We assume we will only get one, so we destructure it into a var
        const [user] = await this.usersService.find(email);

        if (!user) {
            throw new NotFoundException('Email not found.');
        }

        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new NotFoundException('Wrong password.');
        }

        return user;
    }

}
