import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export abstract class ApiService {

  protected route : string;

  protected constructor(route : string) {

    this.route = 'https://syncscene.be/api/' + route;

  }
}
