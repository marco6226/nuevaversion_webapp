import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  typePassword = 'password';
  isPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
  ) { 
    this.formLogin = fb.group({
      'correo': [null, Validators.required],
      'password': [null, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  tooglePsw(){
    this.isPassword = !this.isPassword;
    if (this.isPassword) {
      this.typePassword = 'password';
    } else {
      this.typePassword = 'text';      
    }
  }

}
