import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'training', 
        loadChildren: () => import('./training/training.module').then(modulefile => modulefile.TrainingModule),
        canLoad: [AuthGuard]
    } 
    // loadChildren is the syntax for lazy loading which loads specified module only when needed
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}