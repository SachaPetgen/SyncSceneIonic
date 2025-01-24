import {Gender, Role} from "../../User";

export interface UserRegisterDTO{

  username: string,
  email: string,
  password: string,
  passwordConfirmation: string,
  phoneNumber: string,
  birthDate: Date,
  gender: Gender

}
