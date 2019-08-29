import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';
import { CacheService } from '../../../cache';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
         ReactiveFormsModule,
         HttpClientModule
        ],
      declarations: [ LoginComponent ],
      providers: [
        AuthService,
        HttpService,
        //CacheService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    component.pending = false;
    component.errorMessage = '';
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
