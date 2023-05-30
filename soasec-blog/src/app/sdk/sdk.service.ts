import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as uuid from 'uuid';
import { sha256 } from 'js-sha256';
import jwt_decode from 'jwt-decode';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class SdkService {
  private url=environment.apiServer
  private auth_url = environment.authServer;
  private client_id=environment.client_id
  private redirect_url=environment.redirectURL

  constructor(private http: HttpClient) {
  }

  private sendData(path: string, data: any) {
    return this.http.post(this.url + path, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  }

  private getData(path: string) {
    return this.http.get(this.url + path, { headers: { 'Authorization': 'Token ' + localStorage.getItem("access_token") } });
  }

  private updateData(path: string, data: any) {
    return this.http.patch(this.url + path, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  }

  private deleteData(path: string) {
    return this.http.delete(this.url + path);
  }

  public isLoggedIn(){
    return localStorage.getItem("id_token")!=undefined&&localStorage.getItem("access_token")!=undefined
  }

  public login() {
    var codeVerifier=uuid.v4();
    var state=uuid.v4()
    localStorage.setItem("codeVerifier",btoa(codeVerifier));
    var codeChallenge=btoa(sha256(codeVerifier))
    window.location.replace(this.auth_url + "/auth?client_id=" + this.client_id + "&redirect_url=" + this.redirect_url + "&code_challenge=" + codeChallenge + "&state=" + state);
  }

  public getToken(authorization_code: string, state: string) {
    if (authorization_code != undefined && authorization_code != "") {
      var payload = {
        "client_id": this.client_id,
        "redirect_url": this.redirect_url,
        "code_verifier": localStorage.getItem("codeVerifier"),
        "auth_code": authorization_code,
        "state": state
      }
      this.http
        .post(this.auth_url+'/token', JSON.stringify(payload),
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          })
        .subscribe({
          next: (res: any) => {
            localStorage.setItem("id_token", res.id_token);
            localStorage.setItem("access_token", res.access_token);
            localStorage.removeItem("codeVerifier");
            window.location.replace("/");
          },
          error: (err) => console.log(err),
        });
    }
  }

  public logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    window.location.replace(this.auth_url + "/logout?redirect_url="+this.redirect_url);
  }

  private getGenToken(token_str:string){
    var id_token_str:any=localStorage.getItem(token_str);
    return jwt_decode(id_token_str);
  }

  public getIDToken(){
    return this.getGenToken("id_token");
  }

  public getAccessToken(){
    return this.getGenToken("access_token");
  }

  public getPosts(){
    return this.getData("/posts");
  }
}
