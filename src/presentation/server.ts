import express, { Router } from "express";
import cors from 'cors';



export class Server {

  private readonly app = express();

  constructor(
    private readonly port: number,
    private readonly routes: Router,
  ){
    this.config();
  }


  private config = () => {
    this.app.use(/\/.*payment-webhook.*/, express.raw({ type: 'application/json' }));
    this.app.use( express.json() );
    this.app.use( express.urlencoded( {extended: true} ) );

    this.app.use(cors());

    this.app.use( '/api', this.routes );
  }

  start = () => {
    this.app.listen( this.port, () => {
      console.log(`Server running on port: ${this.port}`);
    });
  };

}