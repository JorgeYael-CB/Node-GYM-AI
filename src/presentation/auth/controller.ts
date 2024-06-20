import { Request, Response } from "express";
import { LoginUserDto } from "../../domain/dtos";

export class UsersController {

  constructor(){};


  loginUser = ( req:Request, res:Response ) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if( error ) return res.status(400).json({error, status: 400});

    res.status(200).json(loginUserDto);
  }

  registerUser = ( req:Request, res:Response ) => {
    res.json('send');
  }

}