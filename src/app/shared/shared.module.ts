import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { PrimengModule } from './modules/primeng.module';
import { ComunModule } from './modules/comun.module';

const modules=[
  MaterialModule,
  PrimengModule,
  FormsModule,
  ReactiveFormsModule,
  ComunModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    modules
  ],
  exports: [
    modules
  ]
})
export class SharedModule { }
