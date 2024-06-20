import { isValidObjectId } from "mongoose";
import { BcryptAdapter } from "../../../config";
import { userModel } from "../../../db/mongo";
import { UsersDatasource } from "../../../domain/datasources";
import { LoginUserDto, RegisterUserDto, GetUserDto, ResetPasswordDto } from "../../../domain/dtos";
import { UserEntity } from "../../../domain/entities";
import { CustomError } from "../../../domain/errors";
import { UserMapper } from "../../mappers";


export class UsersDatasourceMongoImpl implements UsersDatasource {

  constructor(
    private readonly bcryptAdapter: BcryptAdapter,
  ){}


  private async getUserBy( email?:string, id?:string ){
    if( id && !isValidObjectId(id) ){
      throw CustomError.BadRequestException(`Id "${id}" is not valid`);
    }

    const user = (email)
      ? await userModel.findOne({email})
      : await userModel.findById(id);

    if( !user ) throw CustomError.BadRequestException(`User not exist!`);

    return user;
  }


  private userAcces( user: any ){
    if( !user.isVerify ) throw CustomError.Unauthorized(`You have to verify your account to log in.`);
    if( !user.isActive ) throw CustomError.Unauthorized(`The user's account is blocked, please contact support.`);
  }


  async loginUser(LoginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = LoginUserDto;
    const user = await this.getUserBy(email);

    const comaprePassword = this.bcryptAdapter.compare(password, user.password);
    if( !comaprePassword ) throw CustomError.Unauthorized(`The password or email is incorrect!`);

    this.userAcces(user);

    return UserMapper.getUserFromObj(user);
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