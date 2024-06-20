import { JwtAdapter } from "../../../config";
import { UsersRepositoryImpl } from "../../../infrastucture/repositories";
import { LoginUserDto } from "../../dtos";
import { CustomError } from "../../errors";



interface Props {
  loginUserDto: LoginUserDto;
  usersRepository: UsersRepositoryImpl;
  jwtAdapter: JwtAdapter;
}


export const loginUserUseCase = async( { loginUserDto, usersRepository, jwtAdapter }: Props ) => {
  const user = await usersRepository.loginUser( loginUserDto );
  const token = await jwtAdapter.generateToken({ id: user.id }, '1d');

  if( !user || !token ) throw CustomError.InternalServerError(`EL usuario o token no existe en loginUserUseCase!...`, { file: __dirname });

  return {
    token,
    user: {
      name: user.name,
      email: user.email,
      id: user.id,
      isVerify: user.isVerify,
      isActive: user.isActive,
      messages: user.messages,
      coments: user.coments,
      date: user.date,
      roles: user.roles,
      totalAmountPaid: user.totalAmountPaid,
    },
  }
};
