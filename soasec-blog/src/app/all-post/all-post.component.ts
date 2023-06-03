import { Component } from '@angular/core';
import { SdkService } from '../sdk/sdk.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css']
})
export class AllPostComponent {
  all_post:any

  constructor(public sdk:SdkService) {

  }

  ngOnInit(): void {
    this.sdk.getPosts().subscribe(res=>{
      this.all_post=res;
      this.all_post.forEach((el:any) => {
        el.date=(new Date(el.date)).toLocaleString();
      });
    })
  }

}
