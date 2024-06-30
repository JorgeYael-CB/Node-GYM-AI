import { Types, isValidObjectId } from "mongoose";
import { BcryptAdapter, CompareDateAdapter } from "../../../config";
import { userModel } from "../../../db/mongo";
import { UsersDatasource } from "../../../domain/datasources";
import { LoginUserDto, RegisterUserDto, GetUserDto, ResetPasswordDto } from "../../../domain/dtos";
import { UserEntity } from "../../../domain/entities";
import { CustomError } from "../../../domain/errors";
import { UserMapper } from "../../mappers";
import { roles } from "../../../domain/types";



export class UsersDatasourceMongoImpl implements UsersDatasource {

  constructor(
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly compareDateAdapter: CompareDateAdapter,
  ){}


  private async chechStatusRole( userId: any ){
    const user = await this.getUserBy(undefined, userId);
    if( !user.roles.includes('USER_VIP') ) return;

    // validamos su fecha
    const compareDateRole = this.compareDateAdapter.compareDate(user.startDatePayment, 30);

    if( typeof compareDateRole === 'boolean' ){
      user.roles = user.roles.filter( role => role !== 'USER_VIP' );
      await user.save();
    }
  }


  async updatedPayment(userId: any): Promise<UserEntity> {
    const user = await this.getUserBy(undefined, userId);
    user.roles.push('USER_VIP'); // le agregamos el nuevo role de usuario
    user.startDatePayment = new Date();

    await user.save();
    return UserMapper.getUserFromObj( user );
  }


  private async getUserBy( email?:string, id?:any ){
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


  async checkMessageDate( userId: any ): Promise<UserEntity> {
    const user = await this.getUserBy(undefined, userId);
    await this.chechStatusRole( user._id );
    this.userAcces(user, 'USER_VIP');

    //TODO: hacemos las validaciones de los mensajes
    if( user.lastDateMessages.length >= user.limitMessage ){
      let validMessages = user.lastDateMessages.filter(msg => typeof this.compareDateAdapter.compareDate(msg) === 'string');

      if( validMessages.length >= user.lastDateMessages.length ){
        const lastDateString = this.compareDateAdapter.compareDate( validMessages[0] );
        throw CustomError.Unauthorized(`You currently have no messages available, please try again at: ${lastDateString}`);
      };

      user.lastDateMessages = new Types.DocumentArray(validMessages);

      await user.save();
    }

    return UserMapper.getUserFromObj(user);
  }


  async checkRoutineDate(userId: any): Promise<UserEntity> {
    const user = await this.getUserBy(undefined, userId);
    await this.chechStatusRole( user._id );
    this.userAcces(user, 'USER_VIP');

    if( user.routineDate.length >= user.limitRoutineForDay ){
      let validMessages = user.routineDate.filter(routine => typeof this.compareDateAdapter.compareDate(routine) === 'string');

      if( validMessages.length >= user.routineDate.length ){
        const lastDateString = this.compareDateAdapter.compareDate( validMessages[0] );
        throw CustomError.Unauthorized(`You currently have no routine available, please try again at: ${lastDateString}`);
      };

      user.routineDate = new Types.DocumentArray(validMessages);
      await user.save();
    }

    return UserMapper.getUserFromObj(user);
  }


  async loginUser(LoginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = LoginUserDto;
    const user = await this.getUserBy(email);

    const comaprePassword = this.bcryptAdapter.compare(password, user.password);
    if( !comaprePassword ) throw CustomError.Unauthorized(`The password or email is incorrect!`);

    this.userAcces(user);
    await this.chechStatusRole( user._id );

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

  async getUser(getUserDto: GetUserDto): Promise<UserEntity> {
    const user = await this.getUserBy(getUserDto.email, getUserDto.id);
    await this.chechStatusRole( user._id );

    return UserMapper.getUserFromObj(await user.populate('data', {
      _id: 1,
      lastDate: 1,
      year: 1,
      height: 1,
      weight: 1,
      aim: 1,
      deport: 1,
      medicalHistory: 1,
      equipment:1,
      sexo: 1,
      experience: 1,
    }));
  }

  getAllUsers(): Promise<UserEntity[]> {
    throw new Error("Method not implemented.");
  };

};