import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HttpInt } from './httpInt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/Interceptor/token.interceptor';


// import { HttpAuthInterceptorService } from './website/pages/core/services/http-auth-interceptor.service';

declare global {
  interface Navigator {
      msSaveBlob?: (blob: any, defaultName?: string) => boolean
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [
    HttpInt,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: HttpAuthInterceptorService,
        //     multi: true
        // },
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
