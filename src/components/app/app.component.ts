import {Component, ViewContainerRef} from '@angular/core';
import { Overlay } from 'angular2-modal';

import {WorkoutHistoryComponent} from '../workout-history/workout-history.component';

// Note: `RouterOutlet` is an Angular component directive that acts as a placeholder for a child component to load on route change. 
@Component({
  selector: 'trainer-app',
  template: `<div class="navbar navbar-default navbar-fixed-top top-navbar">
                <div class="container app-container">
                  <header></header>
                </div>
             </div>
             <div class="container body-content app-container">
                <router-outlet></router-outlet>
             </div>`
})
export class TrainerAppComponent {
  //  the modal dialog needs a container component to host itself. 
  // By passing in the ViewContainerRef of TrainerAppComponent, we allow the dialog to load inside the app root.
  constructor(overlay: Overlay, viewContainer: ViewContainerRef) {
    overlay.defaultViewContainer = viewContainer;
  }
}
