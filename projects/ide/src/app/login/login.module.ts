import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './component/login/login.component';
import { LoginContainerComponent } from './containers/login/login.container.component';
import { LoginRootingModule } from './login.route';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './services/http.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRootingModule,
    HttpClientModule
  ],
  declarations: [
    LoginComponent,
    LoginContainerComponent
  ],
  exports: [
    LoginContainerComponent
  ],
  providers: [
    AuthService,
    HttpService
  ]
})

export class LoginModule { 
    static forRoot(): ModuleWithProviders {
      return {
        ngModule: LoginModule,
        providers: [
          AuthService,
          HttpService
        ]
      }
    }
}
