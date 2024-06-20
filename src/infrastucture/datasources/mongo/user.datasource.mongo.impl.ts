import { BcryptAdapter } from "../../../config/bcrypt";
import { UsersDatasource } from "../../../domain/datasources";
import { LoginUserDto, RegisterUserDto, GetUserDto, ResetPasswordDto } from "../../../domain/dtos";
import { UserEntity } from "../../../domain/entities";


export class UsersDatasourceMongoImpl implements UsersDatasource {

  constructor(
    private readonly bcryptAdapter: BcryptAdapter,
  ){}


  loginUser(LoginUserDto: LoginUserDto): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  verifyUserAccount(getUserDto: GetUserDto): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  resetPassword(resetPassword: ResetPasswordDto): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  getUser(getUserDto: GetUserDto): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }

  getAllUsers(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  };

};