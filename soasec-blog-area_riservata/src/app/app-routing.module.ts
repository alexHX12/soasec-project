import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewPostComponent } from './new-post/new-post.component';

const routes: Routes = [
  { path: '', pathMatch:'full', component: DashboardComponent},
  {path:'new-post', component: NewPostComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
