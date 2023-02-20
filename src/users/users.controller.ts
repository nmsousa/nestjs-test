import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";

@Controller("auth")
export class UsersController {

    constructor(private usersService: UsersService) {
    }

    @Post("/signup")
    createUser(@Body() body: CreateUserDto) {
        return this.usersService.createUser(body.email, body.password);
    }

    @Get("/:id")
    findUser(@Param() param: any) {

    }

    @Get()
    findAllUsers(@Query() query: any) {

    }

    @Patch("/:id")
    updateUser(@Param() param: any) {

    }

    @Delete("/:id")
    removeUser(@Param() param: any) {

    }

}
