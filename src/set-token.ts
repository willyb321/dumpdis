import {conf} from "./config";


export function setToken(token: string): void {
  token = token.toString().trim();
  conf.set('token', token);
  return;
}
