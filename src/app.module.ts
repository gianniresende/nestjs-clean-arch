import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module'
import { UsersModule } from './users/infrastructure/users.module'
import { SigninUseCase } from './users/application/usecases/signin.usecase'
import { UserInMemoryRepository } from './users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { BcryptjsHashProvider } from './users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { HashProvider } from './shared/application/providers/hash-provider'
import { UserRepository } from './users/domain/repositories/user.repository'
@Module({
  imports: [EnvConfigModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    {
      provide: SigninUseCase.UseCase,
      useFactory(
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) {
        return new SigninUseCase.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
  ],
})
export class AppModule {}
