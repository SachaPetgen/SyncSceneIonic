import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export abstract class ApiService {

  protected route : string;

  protected constructor(route : string) {

    this.route = 'http://localhost:5213/api/' + route;

  }
}
