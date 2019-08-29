import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../../../services/authservice/auth.service';
import { SsologinComponent } from './ssologin.component';
import { HttpService, CacheService, FuncsService } from '../../../../../node_modules/@gsp-sys/rtf-common';

describe('SsologinComponent', () => {
  let component: SsologinComponent;
  let fixture: ComponentFixture<SsologinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
         ReactiveFormsModule,
         HttpClientModule
        ],
      declarations: [ SsologinComponent ],
      providers: [
        AuthService,
        HttpService,
        CacheService,
        FuncsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsologinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
