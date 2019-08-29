import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Authenticate } from '../../services/auth.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // 是否显示下拉
  languageDropdown = false;
  languageType = 'zh-CHS';
  languageText = {
    'zh-CHS': {
      'logoText': '企业数字化技术支撑平台',
      'loginText': '登录',
      'loginBtn': '登录',
      'rememberInfo': '记录登录信息',
      'recoverPassword': '找回密码',
      'nameRemind': '请输入用户或者邮箱',
      'passwordRemind': '请输入密码',
      'regist': '注册',
      'errorRemind': '用户名或密码错误',
      'tenantlst': ['浪潮集团', '鲁能集团', '铁塔公司'],
      'inspurId': '合作网站账号登录',
      'domainPath': '请输入域名'
    },
    'en': {
      'logoText': 'Cloud Platform for Digtal Business',
      'loginText': 'Log On',
      'loginBtn': 'Logon',
      'rememberInfo': 'Remember me',
      'recoverPassword': 'Forget password?',
      'nameRemind': 'User Name or Email',
      'passwordRemind': 'Password',
      'regist': 'Register',
      'errorRemind': 'Wrong user name or password',
      'tenantlst': ['Inspur', 'luneng', 'tieta'],
      'inspurId': 'Partner Website Login',
      'domainPath': 'DomainPath'
    }
  };

  @Input()
  set pending(isPending: boolean) {
    if (typeof isPending === 'boolean' && isPending === true) {
      this.myForm.disable();
    } else {
      this.myForm.enable();
    }
  }



  @Input() errorMessage: string | null;

  @Output() submitted = new EventEmitter<Authenticate>();

  myForm: FormGroup;
  languages: any;
  // languages: string[] = ['简体中文', '英文'];
  curLanguage: any;

  // todo:ip临时写死
  redirectUri: string;
  // = 'https://id.inspuronline.com/oauth2.0/authorize?response_type=code&client_id=638b0335-fee6-495b-899b-8269d6b46e89
  // &redirect_uri=http://10.24.19.140:5000/api/runtime/sys/v1.0/Authentication/InspurIdClient';

  authenService: any;
  // tenantLst: any;
  tenants: any[];
  curTenant: string;
  curtTenantId: number;
  clientId: string;
  authenTypes: string[];
  curAuthenType: string;


  constructor(private fb: FormBuilder, authService: AuthService) {
    this.myForm = this.fb.group({
      'language': ['zh-CHS', Validators.required],
      'userName': ['', Validators.required],
      'passWord': ['', Validators.required],
      'Tenant': [this.curtTenantId, Validators.required]
    });
    this.authenService = authService;
  }

  ngOnInit() {

    this.authenService.GetSupportedLanguage().subscribe(res => {
      this.languages = res;
      this.curLanguage = this.languages.find(l => l.code === 'zh-CHS');
      console.log('languages =' + res);
      this.changeLanguage(this.curLanguage.code);
    });
    // this.authenService.GetTenantList().subscribe(ts => {
    //   this.tenants = ts;
    //   console.log('tenant =' + ts);
    //   this.curTenant = this.tenants[0];
    //   this.curtTenantId = this.curTenant['id'];
    // });
    this.authenService.GetClientSecurity().subscribe(cs => {
      this.clientId = cs.ClientId;
      const uri = window.location.host;
      this.redirectUri = `https://id.inspuronline.com/oauth2.0/authorize?response_type=code
        &client_id=' + this.clientId + '&redirect_uri=http://' + uri + '/api/runtime/sys/v1.0/Authentication/InspurIdClient`;
      console.log(cs);
    });
    // this.tenants = this.languageText[this.languageType]['tenantlst'];
    // this.curTenant = this.tenants[0];
  }

  handleLogin() {
    this.myForm.value.language = this.curLanguage['code'];
    if (this.myForm.valid) {
      this.submitted.emit(this.myForm.value);
    }
  }
  test() {
    console.log('mouseout');
  }
  changeLanguage(type: string) {
    switch (type) {
      case 'zh-CHS':
        this.curLanguage = this.languages.find(l => l['code'] === 'zh-CHS');
        break;
      case 'en':
        this.curLanguage = this.languages.find(l => l['code'] === 'en');
        break;
    }
    this.changeTenant(this.curLanguage['code']);
    this.myForm.value.language = this.curLanguage['code'];
    this.languageType = type;
    this.languageDropdown = false;
  }

  changeTenant(languagecode: string) {
    this.authenService.Geti18nTenant(languagecode).subscribe(it => {
      this.tenants = it;
      console.log('tenant =' + it);
      this.curTenant = this.tenants[0];
      this.curtTenantId = this.curTenant['id'];
    });
  }
}
