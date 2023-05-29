import { Component } from '@angular/core';
import { SdkService } from "../sdk/sdk.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  all_post:any

  constructor(public sdk:SdkService) {

  }

  ngOnInit(): void {
    //TO CHANGE
    fetch(environment.apiServer+"/posts",{
      headers: {
        'Authorization': 'Token ' + localStorage.getItem("access_token"),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'GET'
    }).then(res=>{
      res.json().then(res2=>{
        this.all_post=res2
      })
    })
  }
}
