import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component'
import {LastPostComponent} from './last-post/last-post.component'
import {PopularPostComponent} from './popular-post/popular-post.component'
import {PopularAuthorComponent} from './popular-author/popular-author.component'

const routes: Routes = [
  { path: '', pathMatch:'full', component: DashboardComponent},
  {path:'latest', component: LastPostComponent},
  {path:'popular', component: PopularPostComponent},
  {path:'popular-authors', component: PopularAuthorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
