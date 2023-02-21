import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";

@Controller("auth")
@Serialize(UserDto) // Custom SerializeInterceptor, to pass return only @Expose fields
export class UsersController {

    constructor(private usersService: UsersService) {
    }

    @Post("/signup")
    createUser(@Body() body: CreateUserDto) {
        return this.usersService.createUser(body.email, body.password);
    }

    // @UseInterceptors(ClassSerializerInterceptor) // To skip the @Exclude fields
    @Get("/:id") // Nest always get params as strings
    async findUser(@Param("id") id: string) {
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    @Get()
    findAllUsers(@Query("email") email: string) {
        return this.usersService.find(email);
    }

    @Patch("/:id")
    updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }

    @Delete("/:id")
    removeUser(@Param("id") id: string) {
        return this.usersService.remove(parseInt(id));
    }

}
