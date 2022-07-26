// logger.middleware.ts;

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // console.log("--------Request has been recieved--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
    // console.log(`${req.method} ${req.url}`);
    // console.log(`request body :`);
    // console.log(req.body);
    // console.log("-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");

    // const { ip, method, path: url } = req;
    // const userAgent = req.get('user-agent') || '';
    // res.on('close', () => {
    //   const { statusCode } = res;
    //   const contentLength = res.get('content-length');
    //   console.log(res.statusCode);
    //   console.log(res.statusMessage);
    //   // console.log(res.);

    //   this.logger.log(
    //     `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`
    //   );
    // });

    next();
  }
}