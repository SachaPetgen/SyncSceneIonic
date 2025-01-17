import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserRegisterDTO} from "../models/User/DTO/UserRegisterDTO";
import {UserDetailsDTO} from "../models/User/DTO/UserDetailsDTO";

@Injectable({
  providedIn: 'root'
})

export class UserService extends ApiService{

  constructor(private HttpClient : HttpClient) {
    super('User');
  }

  public register(dto: UserRegisterDTO) : Observable<UserDetailsDTO>{
    return this.HttpClient.post<UserDetailsDTO>(this.route, dto);
  }
}
