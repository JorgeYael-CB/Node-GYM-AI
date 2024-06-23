import { JwtAdapter } from "../../../config";
import { RegisterUserDto } from "../../dtos";
import { CustomError } from "../../errors";
import { UsersRepository } from '../../repositories';


export const registerUserUseCase = async(
  usersRepository:UsersRepository,
  registerUserDto: RegisterUserDto,
  jwtAdapter: JwtAdapter,
) => {
  const user = await usersRepository.registerUser( registerUserDto );
  if( !user ) throw CustomError.InternalServerError(`El usuario no existe al registrarlo!`, {file: __dirname});

  const token = await jwtAdapter.generateToken({id: user.id}, '2h');

  return {
    message: `Account created successfully!`,
    token,
    user: {...user, password: undefined},
    status: 200,
  }
};
