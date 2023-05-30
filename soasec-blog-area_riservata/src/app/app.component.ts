import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { Component, VERSION } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { SdkService } from "./sdk/sdk.service";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger("openCloseMobile", [
      // ...
      state(
        "open",
        style({
          opacity: 1,
          transform: "scale(1, 1)"
        })
      ),
      state(
        "closed",
        style({
          opacity: 0,
          transform: "scale(0.95, 0.95)"
        })
      ),
      transition("open => closed", [animate("100ms ease-in")]),
      transition("closed => open", [animate("200ms ease-out")])
    ]),
    trigger("openCloseProfile", [
      // ...
      state(
        "open",
        style({
          opacity: 1,
          transform: "scale(1, 1)"
        })
      ),
      state(
        "closed",
        style({
          opacity: 0,
          transform: "scale(0.95, 0.95)"
        })
      ),
      transition("open => closed", [animate("100ms ease-in")]),
      transition("closed => open", [animate("200ms ease-out")])
    ])
  ]
})

export class AppComponent {
  title = 'soasec-blog';
  mobileMenuOpen = true;
  profileMenuOpen = false;
  dashboardURL=environment.dashboardURL;

  get openCloseMobileTrigger() {
    return this.mobileMenuOpen ? "open" : "closed";
  }

  get openCloseProfileTrigger() {
    return this.profileMenuOpen ? "open" : "closed";
  }

  toggleMenu(dropdown: string) {
    if (dropdown == "mobile-menu") {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    } else if (dropdown == "profile-menu") {
      this.profileMenuOpen = !this.profileMenuOpen;
    }
  }

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, public sdk:SdkService) {

  }

  user_info: any = undefined

  ngOnInit(): void {
    if (this.sdk.isLoggedIn()) {
      var id_token: any = this.sdk.getIDToken();
      this.user_info = {
        "name": id_token.name,
        "email": id_token.email,
        "image": id_token.image
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
