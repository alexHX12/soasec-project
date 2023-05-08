import { Component } from '@angular/core';

@Component({
  selector: 'app-last-post',
  templateUrl: './last-post.component.html',
  styleUrls: ['./last-post.component.css']
})
export class LastPostComponent {
  all_post:any

  ngOnInit(): void {
    fetch("http://localhost:3000/posts").then(res=>{
      res.json().then(res2=>{
        this.all_post=res2
      })
    })
  }

 
}
