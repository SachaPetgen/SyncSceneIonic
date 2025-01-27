import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserRegisterDTO} from "../models/User/DTO/User/UserRegisterDTO";
import {UserDetailsDTO} from "../models/User/DTO/User/UserDetailsDTO";
import {UserLoginDTO} from "../models/User/DTO/User/UserLoginDTO";
import {UserUpdateDTO} from "../models/User/DTO/User/UserUpdateDTO";
import {UserPatchPasswordDTO} from "../models/User/DTO/User/UserPatchPasswordDTO";

@Injectable({
  providedIn: 'root'
})

export class UserService extends ApiService{

  constructor(private HttpClient : HttpClient) {
    super('User');
  }

  public getById(id: string) : Observable<UserDetailsDTO>{
    return this.HttpClient.get<UserDetailsDTO>(this.route + "/" + id);
  }

  public register(dto: UserRegisterDTO) : Observable<UserDetailsDTO>{
    return this.HttpClient.post<UserDetailsDTO>(this.route + "/register", dto);
  }

  public login(dto: UserLoginDTO) : Observable<UserDetailsDTO>{
    return this.HttpClient.post<UserDetailsDTO>(this.route + "/login", dto);
  }

  public update(dto: UserUpdateDTO, id: string) : Observable<UserDetailsDTO>{
    return this.HttpClient.put<UserDetailsDTO>(this.route + "/" + id, dto);
  }

  public patchPassword(dto: UserPatchPasswordDTO, id: string) : Observable<UserDetailsDTO> {
    return this.HttpClient.patch<UserDetailsDTO>(this.route + "/changePassword/" + id, dto);
  }

}
