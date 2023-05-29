import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-last-post',
  templateUrl: './last-post.component.html',
  styleUrls: ['./last-post.component.css']
})
export class LastPostComponent {
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
