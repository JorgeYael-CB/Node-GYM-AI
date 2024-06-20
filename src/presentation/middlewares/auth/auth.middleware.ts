import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../../config";
import { UsersRepository } from '../../../domain/repositories/user.repository';



export class AuthMiddlweware {

  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly usersRepository: UsersRepository,
  ){}


  private handleError = ( res: Response, message:string = 'Contact support' ) => {
    return res.status(401).json({error: true, message: message, validToken: false});
  };

  validateJwt = async(req:Request, res:Response, next: NextFunction) => {
    const authorization = req.header('Authorization');
    if( !authorization ) return this.handleError(res, 'no token provided');
    if( !authorization.startsWith('Bearer ') ) return this.handleError(res, 'Invalid token');

    const token = authorization.split(' ').at(1) || '';

    try {
      const payload = await this.jwtAdapter.validateToken(token);
      if( !payload ) return this.handleError(res);

      // TODO: buscar al usuario y validar sus datos aqui

      next();
    } catch (error) {
      console.log(`${error}`);
      this.handleError(res, 'Internal server error!');
    }
  };

}
