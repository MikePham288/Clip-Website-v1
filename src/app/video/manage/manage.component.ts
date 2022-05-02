import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  sort = (event: Event) => {
    const { value } = event.target as HTMLSelectElement;
    this.router.navigateByUrl(`/manage?sort=${value}`);
  };
}
