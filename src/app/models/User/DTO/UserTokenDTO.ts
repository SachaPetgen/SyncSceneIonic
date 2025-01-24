import {Role} from "../User";

export interface UserTokenDTO{

  id: string,
  username: string,
  email: string,
  role: Role,
  expiration: Date

}
