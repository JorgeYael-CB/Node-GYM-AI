import OpenAI from "openai";
import { envs } from "./envs";




export class GptServiceAdpater {

  readonly openai = new OpenAI({
    apiKey: envs.SPORT_AI_OPEN_AI_KEY
  });

  constructor(
  ){};

}
