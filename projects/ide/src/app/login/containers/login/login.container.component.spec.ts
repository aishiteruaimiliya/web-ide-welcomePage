import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginContainerComponent } from './login.container.component';
import { LoginComponent } from '../../component/login/login.component';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { CacheService } from '@farris/ide-devkit/services';

// service



describe('LoginComponent', () => {
  let component: LoginContainerComponent;
  let fixture: ComponentFixture<LoginContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        RouterTestingModule
      ],
      declarations: [
        LoginContainerComponent,
        LoginComponent
      ],
      providers: [
        AuthService,
        HttpService,
        CacheService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginContainerComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
