import { UsersDatasource } from "../../domain/datasources";
import { LoginUserDto, RegisterUserDto, GetUserDto, ResetPasswordDto } from "../../domain/dtos";
import { UserEntity } from "../../domain/entities";
import { UsersRepository } from "../../domain/repositories";


export class UsersRepositoryImpl implements UsersRepository {

  constructor(
    private readonly usersDatasource: UsersDatasource,
  ){}

  loginUser(LoginUserDto: LoginUserDto): Promise<UserEntity> {
    return this.usersDatasource.loginUser(LoginUserDto);
  }

  registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.usersDatasource.registerUser(registerUserDto);
  }

  verifyUserAccount(getUserDto: GetUserDto): Promise<UserEntity> {
    return this.usersDatasource.verifyUserAccount(getUserDto);
  }

  resetPassword(resetPassword: ResetPasswordDto): Promise<UserEntity> {
    return this.usersDatasource.resetPassword(resetPassword);
  }

  getUser(getUserDto: GetUserDto): Promise<UserEntity> {
    return this.usersDatasource.getUser(getUserDto);
  }

  getAllUsers(): Promise<UserEntity[]> {
    return this.usersDatasource.getAllUsers()
  };

};