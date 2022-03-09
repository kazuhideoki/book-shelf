import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const path = req.path;
    const method = req.method;
    console.log(`⭐ ${method} ${path}`);

    res.on('finish', () => {
      console.log(`🔵 ${method} ${path}`);
    });

    res.on('error', (error: Error) => {
      console.log(`❌ ${method} ${path} error:${error}`);
    });

    next();
  }
}
