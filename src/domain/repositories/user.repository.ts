import { GetTrainingRoutineDto, LoginUserDto, ResetPasswordDto, RegisterUserDto, GetUserDto } from "../dtos";
import { UserEntity } from "../entities";


export abstract class UsersRepository {
  abstract loginUser(LoginUserDto: LoginUserDto):Promise< UserEntity >;
  abstract registerUser(registerUserDto: RegisterUserDto):Promise< UserEntity >;
  abstract verifyUserAccount(getUserDto: GetUserDto):Promise< UserEntity >;
  abstract resetPassword(resetPassword: ResetPasswordDto):Promise< UserEntity >;
  abstract getUser(getUserDto: GetUserDto):Promise< UserEntity >;
  abstract getAllUsers(): Promise< UserEntity[] >;
  abstract checkMessageDate(userId:any):Promise<UserEntity>;
  abstract checkRoutineDate( userId:any ):Promise<UserEntity>;
};