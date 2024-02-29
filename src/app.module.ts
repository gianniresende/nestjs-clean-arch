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
import { SignupUseCase } from './users/application/usecases/signup.usecase'
import { GetUserUseCase } from './users/application/usecases/get-user.usecase'
import { ListUsersUseCase } from './users/application/usecases/list-users.usecase'
import { UpdateUserUseCase } from './users/application/usecases/Update-user.usecase'
import { UpdatePasswordUseCase } from './users/application/usecases/Update-password.usecase'
import { DeleteUserUseCase } from './users/application/usecases/delete-user.usecase'
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
      provide: SignupUseCase.UseCase,
      useFactory(
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) {
        return new SignupUseCase.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
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
    {
      provide: GetUserUseCase.UseCase,
      useFactory(userRepository: UserRepository.Repository) {
        return new GetUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase.UseCase,
      useFactory(userRepository: UserRepository.Repository) {
        return new ListUsersUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase.UseCase,
      useFactory(userRepository: UserRepository.Repository) {
        return new UpdateUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUseCase.UseCase,
      useFactory(
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider,
      ) {
        return new UpdatePasswordUseCase.UseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase.UseCase,
      useFactory(userRepository: UserRepository.Repository) {
        return new DeleteUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
  ],
})
export class AppModule {}
