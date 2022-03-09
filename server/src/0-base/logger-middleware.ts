import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const path = req.path;
    const method = req.method;
    console.log(`⭐ ${method} ${path}`);

    res.on('finish', (error) => {
      if (
        res.statusCode.toString().startsWith('2') ||
        res.statusCode.toString().startsWith('3')
      ) {
        console.log(`🔵 ${method} ${path}`);
      } else {
        console.error(`❌ ${method} ${path} `);
      }
    });

    next();
  }
}
