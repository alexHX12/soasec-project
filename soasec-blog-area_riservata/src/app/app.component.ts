import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { SdkService } from './sdk/sdk.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'soasec-blog-area_riservata';

  constructor(private activatedRoute: ActivatedRoute, public sdk: SdkService) {

  }

  user_info: any = undefined

  ngOnInit(): void {
    if (this.sdk.isLoggedIn()) {
      var id_token: any = this.sdk.getIDToken();
      this.user_info = {
        "name": id_token.name,
        "email": id_token.email
      }
    } else {
      if (window.location.search == "") {
        this.sdk.login()
      } else {
        this.activatedRoute.queryParams.subscribe(params => {
          var authorization_code = params['auth_code'];
          var state = params['state'];
          this.sdk.getToken(authorization_code,state)
        });
      }
    }
  }
}
