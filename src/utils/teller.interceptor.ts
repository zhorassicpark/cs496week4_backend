import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs";

@Injectable()
export class AspectLogger implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const { originalUrl, method, params, query, body } = req;

    console.log("--------Request has been recieved--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
    console.log({
      originalUrl,
      method,
      params,
      query,
      body,
    });
    console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");

    return next.handle().pipe(
      tap((data) =>{
        console.log("--------Response will be sent--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
        console.log({
          statusCode,
          data,
        })
        console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
      }
      )
    );
  }
}