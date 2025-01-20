import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export abstract class ApiService {

  protected route : string;

  protected constructor(route : string) {

    this.route = 'http://10.0.2.2:5213/api/' + route;

  }
}
