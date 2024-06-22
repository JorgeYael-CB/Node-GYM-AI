import { LoginUserDto, ResetPasswordDto } from "../dtos";
import { UserEntity } from "../entities";
import { RegisterUserDto } from '../dtos/users/register-user.dto';
import { GetUserDto } from '../dtos/users/get-user.dto';


export abstract class UsersDatasource {
  abstract loginUser(LoginUserDto: LoginUserDto):Promise< UserEntity >;
  abstract registerUser(registerUserDto: RegisterUserDto):Promise< UserEntity >;
  abstract verifyUserAccount(getUserDto: GetUserDto):Promise< UserEntity >;
  abstract resetPassword(resetPassword: ResetPasswordDto):Promise< UserEntity >;
  abstract getUser(getUserDto: GetUserDto):Promise< UserEntity >;
  abstract getAllUsers(): Promise< UserEntity[] >;
  abstract checkMessageDate(userId: any):Promise<UserEntity>;
};