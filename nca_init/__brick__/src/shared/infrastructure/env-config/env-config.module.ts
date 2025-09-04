import { DynamicModule, Module } from '@nestjs/common'
import { EnvConfigService } from './env-config.service'
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config'
import { resolve } from 'node:path'

@Module({
  imports: [ConfigModule],
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class EnvConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    const envFile = resolve(process.cwd(), `.env.${process.env.NODE_ENV ?? 'development'}`)

    return {
      module: EnvConfigModule,
      imports: [
        ConfigModule.forRoot({
          ...options,
          envFilePath: [envFile],
        }),
      ],
      providers: [EnvConfigService],
      exports: [EnvConfigService, ConfigModule],
    }
  }
}
