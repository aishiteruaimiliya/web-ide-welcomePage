import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpService } from './http.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [ HttpService ]
})
export class GSPHttpModule {

}
