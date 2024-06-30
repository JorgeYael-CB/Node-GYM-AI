import { LoginUserDto, ResetPasswordDto, RegisterUserDto } from "../dtos";
import { UserEntity } from "../entities";
import { GetUserDto } from '../dtos/users/get-user.dto';


export abstract class UsersDatasource {
  abstract loginUser(LoginUserDto: LoginUserDto):Promise< UserEntity >;
  abstract registerUser(registerUserDto: RegisterUserDto):Promise< UserEntity >;
  abstract verifyUserAccount(getUserDto: GetUserDto):Promise< UserEntity >;
  abstract resetPassword(resetPassword: ResetPasswordDto):Promise< UserEntity >;
  abstract getUser(getUserDto: GetUserDto):Promise< UserEntity >;
  abstract getAllUsers(): Promise< UserEntity[] >;
  abstract checkMessageDate(userId: any):Promise<UserEntity>;
  abstract checkRoutineDate( userId:any ):Promise<UserEntity>;
  abstract updatedPayment( userId: any ):Promise<UserEntity>;
};