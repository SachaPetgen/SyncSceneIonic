
export enum Role{
  User = "User",
  Admin = "Admin"
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other"
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
