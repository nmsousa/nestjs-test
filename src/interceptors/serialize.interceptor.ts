import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { plainToInstance } from "class-transformer";

// Just to force the dto type to be a Class and not something else
interface ClassConstructor {
    new (...args: any[]): {};
}

// This decorator can be used either globally in the Controller or in route methods
export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) { }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run something BEFORE a request is handled by the request handler

        return next.handle().pipe(
          map((data: any) => {
              // Run something AFTER the request is handled, but BEFORE the response is sent out

              // excludeExtraneousValues: To only exposes the properties in the DTO marked as @Expose
              return plainToInstance(this.dto, data, { excludeExtraneousValues: true });
          })
        );
    }

    getClass<T extends new (...args: any[]) => any>(obj: T): T {
        return obj;
    }

}