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
import * as uuid from 'uuid';
import { sha256 } from 'js-sha256';


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
  loggedIn = false;

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

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) {

  }

  authorization_code = ""

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.authorization_code = params['auth_code'];
      var state=params['state']
      if (this.authorization_code != undefined && this.authorization_code!="") {
        var payload={
          "client_id":"6463e66af46aaba4f0569ffc",
          "redirect_url":"http://localhost:4200",
          "code_verifier":localStorage.getItem("codeVerifier"),
          "auth_code":this.authorization_code,
          "state":state
        }
        this.http
          .post('http://localhost:3000/token', JSON.stringify(payload),
          {headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
      }})
          .subscribe({
            next: (res:any) => {
              localStorage.setItem("id_token",res.id_token);
              localStorage.setItem("access_token",res.access_token);
              localStorage.removeItem("codeVerifier");
              window.location.replace("/");
            },
            error: (err) => console.log(err),
          });

      }
    });
  }

  login() {
    var client_id="6463e66af46aaba4f0569ffc"
    var redirect_url="http://localhost:4200"
    var codeVerifier=uuid.v4();
    var state=uuid.v4()
    localStorage.setItem("codeVerifier",btoa(codeVerifier));
    var codeChallenge=btoa(sha256(codeVerifier))
    window.location.replace("http://localhost:3000/auth?client_id="+client_id+"&redirect_url="+redirect_url+"&code_challenge="+codeChallenge+"&state="+state);
  }
}
