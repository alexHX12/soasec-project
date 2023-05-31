import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SdkService } from '../sdk/sdk.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent {
  post: any = undefined

  constructor(private activatedRoute: ActivatedRoute, public sdk: SdkService) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      var post_id = res['id'];
      this.sdk.getSinglePost(post_id).subscribe(res2 => {
        this.post = res2;
      })
    });
  }
}
