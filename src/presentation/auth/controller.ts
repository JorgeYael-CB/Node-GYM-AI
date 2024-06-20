import { Request, Response } from "express";
import { LoginUserDto } from "../../domain/dtos";
import { loginUserUseCase } from "../../domain/use-cases/users";
import { JwtAdapter } from "../../config";
import { UsersRepository } from '../../domain/repositories';
import { CustomError } from "../../domain/errors";

export class UsersController {

  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly usersRepository: UsersRepository
  ){};


  private handleError( err:any, res:Response ){
    if( err instanceof CustomError ){
      return res.status(err.codeError).json({error: err.message, status: err.codeError});
    }

    console.log(err);
    return res.status(500).json({error: 'Internal Server Error!', status: 500});
  }


  loginUser = ( req:Request, res:Response ) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if( error ) return res.status(400).json({error, status: 400});

    loginUserUseCase({loginUserDto: loginUserDto!, jwtAdapter: this.jwtAdapter, usersRepository: this.usersRepository})
      .then( data => res.status(200).json(data) )
      .catch( err => this.handleError(err, res) );
  }


  registerUser = ( req:Request, res:Response ) => {
    res.json('send');
  }

}