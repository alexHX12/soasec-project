import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-popular-post',
  templateUrl: './popular-post.component.html',
  styleUrls: ['./popular-post.component.css']
})
export class PopularPostComponent {
  all_post:any

  ngOnInit(): void {
    //TO CHANGE
    fetch(environment.apiServer+"/posts").then(res=>{
      res.json().then(res2=>{
        this.all_post=res2
      })
    })
  }

 
}
