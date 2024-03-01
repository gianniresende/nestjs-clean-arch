import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module'
import { UsersModule } from './users/infrastructure/users.module'
import { AppService } from './app.service'
@Module({
  imports: [EnvConfigModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
