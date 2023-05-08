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
      if (this.authorization_code != undefined && this.authorization_code!="") {
        var payload={
          "client_id":"1",
          "redirect_url":"http://localhost:4200",
          "client_secret":"1",
          "auth_code":this.authorization_code
        }
        this.http
          .post('http://localhost:3000/token', JSON.stringify(payload),
          {headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
      }})
          .subscribe({
            next: (res) => {
              localStorage.setItem("token",res.toString());
              window.location.replace("/");
            },
            error: (err) => console.log(err),
          });

      }
    });
  }

  login() {
    window.location.replace("http://localhost:3000/auth?client_id=1&redirect_url=http://localhost:4200");
  }
}
