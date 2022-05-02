import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    data: {
      authenticatedOnly: true,
    },
  },
  {
    path: 'upload',
    component: UploadComponent,
    data: {
      authenticatedOnly: true,
    },
  },
  {
    path: 'manage-clips',
    redirectTo: 'manage', // sample of how to redirect route into a new route
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoRoutingModule {}
