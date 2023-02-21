import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository} from "@nestjs/typeorm";
import { User } from './user.entity';

@Injectable()
export class UsersService {

    // We need the InjectRepository part because Nest can't deal with generics here
    constructor(@InjectRepository(User) private repo: Repository<User>) {
    }

    createUser(email: string, password: string): Promise<User> {
        // We use create() before save() only if we want some decorators
        // from User Entity (like @IsEmail()) to run before the save().
        // If we have the validations in the DTOs, we could skip this, but
        // in general we want to do this.
        // If we have hooks in the entity, and we save({email, password}) without
        // using create() before, the hooks won't be executed, so if we use hooks,
        // we should always use create() before !!
        const user: User = this.repo.create({ email, password });

        return this.repo.save(user);
    }

    async findOne(id: number) {
        return this.repo.findOneBy({ id });
    }

    async find(email: string) {
        return this.repo.findBy({ email });
    }

    // 'Partial' is from typescript and allows us to pass an object with none or
    // multiple properties from User, without having to pass all of them.
    // This is useful to make sure we only update properties that exist in User
    async update(id: number, attrs: Partial<User>) {
        const user: User = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        Object.assign(user, attrs); // copy all properties from attrs to user

        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.repo.remove(user);

    }
}
