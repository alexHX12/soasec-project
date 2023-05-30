import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewPostComponent } from './new-post/new-post.component';
import { ViewPostComponent } from './view-post/view-post.component';

const routes: Routes = [
  { path: '', pathMatch:'full', component: DashboardComponent},
  {path:'post/:id', component: ViewPostComponent},
  {path:'new-post', component: NewPostComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
