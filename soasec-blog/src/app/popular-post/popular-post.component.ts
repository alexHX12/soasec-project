import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { SdkService } from '../sdk/sdk.service';

@Component({
  selector: 'app-popular-post',
  templateUrl: './popular-post.component.html',
  styleUrls: ['./popular-post.component.css']
})
export class PopularPostComponent {
  all_post:any

  constructor(public sdk:SdkService) {

  }

  ngOnInit(): void {
    this.sdk.getPopularPostsAll().subscribe(res=>{
      this.all_post=res;
      this.all_post.forEach((el:any) => {
        el.date=(new Date(el.date)).toLocaleString();
      });
    })
  }

 
}
