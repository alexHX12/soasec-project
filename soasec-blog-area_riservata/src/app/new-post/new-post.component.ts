import { Component, ElementRef, ViewChild } from '@angular/core';
import { SdkService } from '../sdk/sdk.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent {

  @ViewChild('title_data') title_data: ElementRef | undefined;
  @ViewChild('short_text_data') short_text_data: ElementRef | undefined;
  @ViewChild('text_data') text_data: ElementRef | undefined;
  @ViewChild('image_data') image_data: ElementRef | undefined;
  @ViewChild('members_only') members_only: ElementRef | undefined;

  post_added=false;

  constructor(public sdk:SdkService) {

  }

  toBase64 = (file: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  async createPost() {
    var title=this.title_data?.nativeElement.value;
    var short_text=this.short_text_data?.nativeElement.value;
    var text=this.text_data?.nativeElement.value;
    var image=this.image_data?.nativeElement.files[0];
    var members_only=this.members_only?.nativeElement.checked?"true":"false"
    if(title==""||title==undefined||short_text==""||short_text==undefined||text==""||text==undefined||image==undefined){
      return
    }
    this.sdk.createPost({
      "title":title,
      "short_text":short_text,
      "text":text,
      "image":image,
      "members_only":members_only
    }).subscribe(res=>{
      this.post_added=true;
    })
  }
}
