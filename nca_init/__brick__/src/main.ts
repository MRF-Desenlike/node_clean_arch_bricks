import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { applyGlobalConfig } from './global-config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { EnvConfigService } from './shared/infrastructure/env-config/env-config.service'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  const config = new DocumentBuilder()
    .setTitle('{{name}} API')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Infomar o JWT para autorizar o acesso',
      name: 'Authorization',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const envConfigService = app.get(EnvConfigService)
  const port = envConfigService.getAppPort()

  applyGlobalConfig(app)
  await app.listen(port, '0.0.0.0')
}
bootstrap()
