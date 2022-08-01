/* eslint-disable no-unused-vars */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string,
      JWT_SECRET:string,
      PORT:string,
    }
  }
}
export {};
