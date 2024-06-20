import mongoose from 'mongoose';


export class MongoDb{

  constructor(
    private readonly uri: string,
  ){}

  async connect(){
    try {
      await mongoose.connect(this.uri);
      console.log(`Mongo DB connected`);
    } catch (error) {
      console.log(`Mongo DB error: ${error}`);
    }
  }

};

