import { Component } from '@angular/core';
import { SdkService } from '../sdk/sdk.service';

@Component({
  selector: 'app-all-author',
  templateUrl: './all-author.component.html',
  styleUrls: ['./all-author.component.css']
})
export class AllAuthorComponent {
  all_author:any

  constructor(public sdk:SdkService) {

  }

  ngOnInit(): void {
    this.sdk.getAuthors().subscribe(res=>{
      this.all_author=res;
    })
  }
}
