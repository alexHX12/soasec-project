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
  private domain=environment.domain;
  private url=environment.apiServer;
  private auth_url = environment.authServer;
  private client_id=environment.client_id;
  private redirect_url=environment.redirectURL;
  public profileImageURL=this.auth_url+"/public/uploads/";
  public postImageURL=this.url+"/public/uploads/";

  constructor(private http: HttpClient) {
  }

  private sendData(path: string, data: any) {
    return this.http.post(this.url + path, JSON.stringify(data), { headers: { 'Content-Type': 'application/json', 'Authorization': 'Token ' + this.getCookieValue("access_token") } });
  }

  private sendDataForm(path: string, data: any) {
    return this.http.post(this.url + path, data, { headers: { 'Authorization': 'Token ' + this.getCookieValue("access_token") } });
  }

  private getData(path: string) {
    return this.http.get(this.url + path,{ headers: { 'Authorization': 'Token ' + this.getCookieValue("access_token") } });
  }

  private updateData(path: string, data: any) {
    return this.http.patch(this.url + path, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  }

  private deleteData(path: string) {
    return this.http.delete(this.url + path);
  }

  public isLoggedIn(){
    return this.getCookieValue("id_token")!=""&&this.getCookieValue("access_token")!=""
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
             //document.cookie = 'cookie1=test; expires=Sun, 1 Jan 2023 00:00:00 UTC; path=/'
            var decoded_id_token:any=jwt_decode(res.id_token);
            var decoded_access_token:any=jwt_decode(res.access_token);
            var id_token_expires = "", access_token_expires="";
            var date = new Date();
            date.setTime(decoded_id_token.exp);
            id_token_expires = date.toUTCString();
            date.setTime(decoded_access_token.exp);
            access_token_expires = date.toUTCString();

            document.cookie = "id_token=" + res.id_token  +"; expires="+ id_token_expires + "; path=/; domain=."+this.domain;
            document.cookie = "access_token=" + res.access_token  +"; expires="+ access_token_expires + "; path=/; domain=."+this.domain;
            localStorage.removeItem("codeVerifier");
            window.location.replace("/");
          },
          error: (err) => console.log(err),
        });
    }
  }

  private getCookieValue = (name:string) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  ) 

  public logout() {
    //document.cookie = 'cookie2=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    document.cookie = 'id_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=.'+this.domain;
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=.'+this.domain;
    window.location.replace(this.auth_url + "/logout?redirect_url="+this.redirect_url);
  }

  private getGenToken(token_str:string):any{
    var id_token_str:any=this.getCookieValue(token_str);
    return jwt_decode(id_token_str);
  }

  public getIDToken():any{
    return this.getGenToken("id_token");
  }

  public getAccessToken():any{
    return this.getGenToken("access_token");
  }

  public getMyPosts(){
    return this.getData("/posts/?user_id="+this.getAccessToken().sub);
  }

  public getSinglePost(post_id:string){
    return this.getData("/posts/"+post_id);
  }

  public createPost(post:any){
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('short_text', post.short_text);
    formData.append('text', post.text);
    formData.append('image', post.image);
    formData.append('members_only', post.members_only);
    return this.sendDataForm("/posts",formData);
  }
}
