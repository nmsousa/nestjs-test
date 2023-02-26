import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Session,
    UnauthorizedException
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
@Serialize(UserDto) // Custom SerializeInterceptor, to pass return only @Expose fields
export class UsersController {

    constructor(
      private usersService: UsersService,
      private authService: AuthService) {
    }

    @Get('/whoami')
    async whoAmI(@Session() session: any) {
        const user = await this.usersService.findOne(session.userId);
        if (!user) {
            throw new UnauthorizedException()
        }

        return user;
    }

    @Post("/signup")
    async signUp(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;

        return user;
    }

    @Post("/signin")
    async signIn(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;

        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
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

    // This is how we can store data to share between requests, inside the session/cookie
    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session: any) {
    //     session.color = color;
    // }
    //
    // @Get('/colors')
    // getColor(@Session() session: any) {
    //     return session.color;
    // }


}
