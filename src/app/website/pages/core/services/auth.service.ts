import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl: string = "/app/home";

  constructor() { }
}
