import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { SdkService } from '../sdk/sdk.service';

@Component({
  selector: 'app-popular-post',
  templateUrl: './popular-post.component.html',
  styleUrls: ['./popular-post.component.css']
})
export class PopularPostComponent {
  all_post: any

  constructor(public sdk: SdkService) {

  }

  user_info: any = undefined;

  canViewPost(post: any): boolean {
    var res = false;
    if (post.members_only || post.premium) {
      if (this.sdk.isLoggedIn()) {
        if (post.members_only) {
          if (this.user_info.member) {
            res = true;
            if (post.premium) {
              if (this.user_info.premium) {
                res = true;
              } else {
                res = false;
              }
            }
          } else {
            res = false;
          }
        } else if (post.premium) {
          if (this.user_info.premium) {
            res = true;
            if (post.members_only) {
              if (this.user_info.member) {
                res = true;
              } else {
                res = false;
              }
            }
          } else {
            res = false;
          }
        }
      }else{
        res=false;
      }
    } else {
      res = true;
    }
    return res;
  }

  ngOnInit(): void {
    if (this.sdk.isLoggedIn()) {
      var id_token: any = this.sdk.getIDToken();
      this.user_info = {
        "name": id_token.name,
        "email": id_token.email,
        "image": id_token.image,
        "member": id_token.roles.includes("Member"),
        "premium": id_token.roles.includes("Premium"),
      }
    }
    this.sdk.getPopularPostsAll().subscribe(res => {
      this.all_post = res;
      this.all_post.forEach((el: any) => {
        el.date = (new Date(el.date)).toLocaleString();
      });
    })
  }


}
