import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export const swaggerSettings = (
  app: INestApplication,
  serverUrl: string,
  port: string,
) => {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .addServer(`http://localhost:${port}`)
    .addServer(serverUrl)
    .setTitle('E Book Shelf Swagger')

    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'My API Docs',
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, customOptions);
};
