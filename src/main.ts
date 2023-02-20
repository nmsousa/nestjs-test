import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
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
