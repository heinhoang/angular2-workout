import {Component} from '@angular/core';
import {Router, Event } from '@angular/router';

// note: The `routerLink` directive of angular router component is an array of route links parameters `['routePath', param1, param2, {prop1:val1, prop2:val2} ....] `
// `<a [routerLink]="['/users', 2]` generates `/users/2`
// `<a [routerLink]="['/users', {id:2}]` generates `/users;id=2`
@Component({
  selector: 'header',
  template: `<div class="navbar-header">
                <h1>Personal Trainer</h1>
             </div>
             <ul class="nav navbar-nav navbar-right">
                <li *ngIf="showHistoryLink"><a [routerLink]="['history']" title="Workout History">History</a></li>
             </ul>`
})
export class HeaderComponent {
  showHistoryLink: boolean = true;
  private subscription: any;
  constructor(private router: Router) {
    // events property is an observable that raise events and can be subscribed to
    // The subscribe function registers a callback function that is invoked every time the route changes.
    this.router.events.subscribe((data: Event) => {
      // The History link does not show up on the workout page
      this.showHistoryLink = !this.router.url.startsWith('/workout');
    });
  }
}