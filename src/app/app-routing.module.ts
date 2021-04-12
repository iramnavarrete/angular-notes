import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckLoginGuard } from './guard/check-login.guard';

const routes: Routes = [
  {
    path: 'notFound', loadChildren: () =>
      import('./pages/not-found/not-found.module').then(m => m.NotFoundModule)
  },
  {
    path: 'home', loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'login', loadChildren: () =>
      import('./pages/auth/login/login.module').then(m => m.LoginModule),
      canActivate:[CheckLoginGuard]
  },
  {
    path: 'notes', loadChildren: () =>
      import('./pages/note/note.module').then(m => m.NoteModule)
  },
  {
    path: 'notes/:tag', loadChildren: () =>
      import('./pages/note/note.module').then(m => m.NoteModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
