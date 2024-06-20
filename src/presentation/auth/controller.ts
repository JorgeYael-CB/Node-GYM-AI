import { Request, Response } from "express";

export class UsersController {

  constructor(){};


  loginUser = ( req:Request, res:Response ) => {
    res.json('send');
  }

  registerUser = ( req:Request, res:Response ) => {
    res.json('send');
  }

}