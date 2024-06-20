import { isValidObjectId } from "mongoose";
import { BcryptAdapter } from "../../../config";
import { userModel } from "../../../db/mongo";
import { UsersDatasource } from "../../../domain/datasources";
import { LoginUserDto, RegisterUserDto, GetUserDto, ResetPasswordDto } from "../../../domain/dtos";
import { UserEntity } from "../../../domain/entities";
import { CustomError } from "../../../domain/errors";
import { UserMapper } from "../../mappers";



type roles = 'ADMIN' | 'DEVELOPER' | 'USER' | 'USER_PREMIUM' | 'USER_VIP';


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


  private userAcces( user: any, role?: roles, validateVerify?: boolean ){
    if( !user.isActive ) throw CustomError.Unauthorized(`The user's account is blocked, please contact support.`);
    if( validateVerify && !user.isVerify ) throw CustomError.Unauthorized(`Verify your account!`);
    if( role && !user.roles.includes(role) ) throw CustomError.Unauthorized(`You do not have access to this content`);
  }


  async loginUser(LoginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = LoginUserDto;
    const user = await this.getUserBy(email);

    const comaprePassword = this.bcryptAdapter.compare(password, user.password);
    if( !comaprePassword ) throw CustomError.Unauthorized(`The password or email is incorrect!`);

    this.userAcces(user);

    return UserMapper.getUserFromObj(user);
  }


  async registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { email, name, password } = registerUserDto;
    const user = await userModel.findOne({email});

    if( user ) throw CustomError.Unauthorized(`This user already has an account created!`);

    const newUser = await userModel.create({
      date: new Date(),
      email,
      password: this.bcryptAdapter.hash(password),
      name,
    });

    return UserMapper.getUserFromObj(newUser);
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