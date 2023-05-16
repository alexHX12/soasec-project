import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  all_post:any

  ngOnInit(): void {
    fetch("http://localhost:8000/posts").then(res=>{
      res.json().then(res2=>{
        this.all_post=res2
      })
    })
  }
}
