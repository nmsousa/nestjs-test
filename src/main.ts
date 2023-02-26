import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
// Because tsconfig of NextJS can't handle this properly the normal way
const cookieSession = require('cookie-session');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieSession({
        keys: ['asdfasfd'] // used to encrypt the info inside the cookie, can be anything we want
    }))
    // This makes validations run in Controllers when we use DTOs for the @Body
    app.useGlobalPipes(
      new ValidationPipe({
          // This means that properties inside DTOs that have no decorators will be ignored
          whitelist: true
      })
    );
    await app.listen(3000);
}

bootstrap();
