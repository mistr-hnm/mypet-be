import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import * as classTransformer from 'class-transformer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Mypet')
    .setDescription(`
      This API allows you to manage mypet platform.
      
      ## Features
      - Authentication & authorization
      - Pet management
      - File uploads
      - Permission access control

      ## Versioning
      All endpoints are prefixed with /api.
    `)
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in : 'header',
      name : 'Authorization', 
      flows : { }
    },
      'Authentication'
    )
    .addSecurityRequirements('bearer')
    .setVersion('1.0')
    .addTag('User')
    .addTag('Pet')
    .addTag('Permission')
    .build()

  let document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  })
 

  const unwantedSchemas = ['App', 'Model'];
  // Manually remove
  document = {
    ...document,
    paths: Object.fromEntries(
      Object.entries(document.paths).map(([path, pathObj]) => [
        `/api${path}`, // prepend the prefix
        pathObj,
      ])
    ),
    components: {
      ...document.components,
      schemas : Object.fromEntries(
        Object.entries(document.components?.schemas || {}).filter(
          ([key]) => !unwantedSchemas.includes(key)
        )
      )
    },
    security  : [{  'Authentication': [] }]
  }

  app.use('/', (req : any, res: any, next: any) => {
    console.log(`url->${req.method} ${req.url}`);
    if (req.path === '/') {
      res.redirect('/docs');
    } else {
      next();
    }
  });

  app.use('/docs', apiReference({
    content: document,
    theme: 'none',
    title: "mypet",    
  }));
 
  
  app.enableCors("*")
  app.setGlobalPrefix("api/")

  
  if (!(classTransformer as any).plainToInstance && (classTransformer as any).plainToClass) {
    (classTransformer as any).plainToInstance = (classTransformer as any).plainToClass;
  }
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist : true,
      transform : true,
      forbidNonWhitelisted : true
    }));
  
  const port = process.env.PORT || 3000;

  console.log("running port for mypet-be",port);
  
  await app.listen(port);


}

bootstrap();
