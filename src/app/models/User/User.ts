
export enum Role{
  User,
  Admin
}

export enum Gender {
  Male,
  Female ,
  Other
}

export interface User{

  id: string,
  username: string,
  email: string,
  password: string,
  role: Role,
  phoneNumber: string,
  birthDate: Date,
  gender: Gender,
  createdAt: Date,
  updatedAt: Date

}
