import {Gender, Role} from "../User";

export interface UserDetailsDTO{

  username: string,
  email: string,
  role: Role
  phoneNumber: string,
  birthDate: Date,
  gender: Gender,
  createdAt: Date,
  updatedAt: Date

}
