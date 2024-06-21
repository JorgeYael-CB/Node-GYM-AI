import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../../config";
import { UsersRepository } from '../../../domain/repositories/user.repository';
import { GetUserDto } from "../../../domain/dtos";



export class AuthMiddlweware {

  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly usersRepository: UsersRepository,
  ){}


  private handleError = ( res: Response, message:string = 'Contact support' ) => {
    return res.status(401).json({error: message, status: 401});
  };

  validateJwt = async(req:Request, res:Response, next: NextFunction) => {
    if( req.body.userId ){
      return this.handleError(res, 'Please review your submitted information.');
    }

    const authorization = req.header('Authorization');
    if( !authorization ) return this.handleError(res, 'no token provided');
    if( !authorization.startsWith('Bearer ') ) return this.handleError(res, 'Invalid token');

    const token = authorization.split(' ').at(1) || '';

    try {
      const payload = await this.jwtAdapter.validateToken<{id: string | number}>(token);
      if( !payload ) return this.handleError(res);

      // TODO: buscar al usuario y validar sus datos aqui
      const [error, getUserDto] = GetUserDto.create(payload);
      if( error ) return this.handleError(res);

      const user = await this.usersRepository.getUser(getUserDto!);
      if( !user.isActive ) return this.handleError(res, 'This user has been blocked, please contact support.');

      req.body.userId = user.id;

      next();
    } catch (error) {
      console.log(`${error}`);
      this.handleError(res, 'Internal server error!');
    }
  };

}
