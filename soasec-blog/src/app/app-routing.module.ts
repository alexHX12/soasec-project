import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component'
import {PopularPostComponent} from './popular-post/popular-post.component'
import {AllPostComponent} from './all-post/all-post.component'
import {AllAuthorComponent} from './all-author/all-author.component'
import { ViewPostComponent } from './view-post/view-post.component';

const routes: Routes = [
  { path: '', pathMatch:'full', component: DashboardComponent},
  {path:'popular', component: PopularPostComponent},
  {path:'posts', component: AllPostComponent},
  {path:'post/:id', component: ViewPostComponent},
  {path:'authors', component: AllAuthorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
