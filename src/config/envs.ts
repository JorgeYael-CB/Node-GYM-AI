import 'dotenv/config';
import { get } from "env-var";




export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  JWT_SEED: get('JWT_SEED').required().asString(),
  MONGO_DB_URI: get('MONGO_DB_URI').required().asString(),
  SPORT_AI_OPEN_AI_KEY: get('SPORT_AI_OPEN_AI_KEY').required().asString(),
  CHAT_OPEN_AI: get('CHAT_OPEN_AI').required().asBool(),
}