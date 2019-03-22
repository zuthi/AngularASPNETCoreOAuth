import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { UserManager, UserManagerSettings, User } from 'oidc-client';

import {BaseService} from "../../shared/base.service";
import { ConfigService } from '../../shared/config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService  {

  private manager = new UserManager(getClientSettings());
  private user: User = null;

  constructor(private http: HttpClient, private configService: ConfigService) { 
    super();
    this.baseUrl = this.configService.getApiURI();  
    
    this.manager.getUser().then(user => {
      this.user = user;
    });
  }

  login() { 
    return this.manager.signinRedirect();
    //return this.http.post('/users/authenticate',"");
  }

  async completeAuthentication() {
    const user = await this.manager.signinRedirectCallback('http://localhost:4200');
    console.log(user);
    this.user = user;
  }


  register(userRegistration: any) {    
    return this.http.post(this.baseUrl + '/account', userRegistration).pipe(catchError(this.handleError));
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
      authority: 'http://localhost:60968',
      client_id: 'angular_spa',
      redirect_uri: 'http://localhost:4200/auth-callback',
      post_logout_redirect_uri: 'http://localhost:4200/',
      response_type:"id_token token",
      scope:"openid profile email api1.read",
      filterProtocolClaims: true,
      loadUserInfo: true,
      automaticSilentRenew: true,
      silent_redirect_uri: 'http://localhost:4200/silent-refresh.html'
  };
}
