import { Component } from '@angular/core';
import { SdkService } from "../sdk/sdk.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  popular_post:any;
  all_post:any;

  constructor(public sdk:SdkService) {

  }

  ngOnInit(): void {
    this.sdk.getPosts().subscribe(res=>{
      this.all_post=res;
    })
    this.sdk.getPopularPostsMin().subscribe(res=>{
      this.popular_post=res;
    })
  }
}
