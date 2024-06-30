import 'dotenv/config';
import { get } from "env-var";




export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  JWT_SEED: get('JWT_SEED').required().asString(),
  MONGO_DB_URI: get('MONGO_DB_URI').required().asString(),
  SPORT_AI_OPEN_AI_KEY: get('SPORT_AI_OPEN_AI_KEY').required().asString(),
  EMAIL_ADMIN: get('EMAIL_ADMIN').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_PASS: get('MAILER_PASS').required().asString(),
  CHAT_OPEN_AI: get('CHAT_OPEN_AI').required().asBool(),
  STRIPE_SECRET: get('STRIPE_SECRET').required().asString(),
  STRIPE_SECRET_WEBHOOK: get('STRIPE_SECRET_WEBHOOK').required().asString(),
  ID_MONTH_SPORT_AI: get('ID_MONTH_SPORT_AI').required().asString(),
}