import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { WorkoutPlan } from "../../services/model";
import {WorkoutService } from "../../services/workout-service";

@Component({
  selector: 'start',
  templateUrl: '/src/components/start/start.html',
})
export class StartComponent implements OnInit, OnDestroy{
    public workoutList:Array<WorkoutPlan> = [];
    public notFound:boolean = false;
    public searchTerm: string;
    private subscription:any;

    constructor(private router:Router,
                private workoutService:WorkoutService) {
    }

    ngOnInit() {
        // subscribes to the Observable that is being returned by the getWorkouts method; at the point when the response arrives, it assigns the results to workoutList. If there is an error, it assigns it to a console.error call that displays the error in the console. 
        this.subscription = this.workoutService.getWorkouts()
            .subscribe(
                workoutList => this.workoutList = workoutList,
                (err:any) => console.error(err)
            );
    }

    onSelect(workout:WorkoutPlan) {
        this.router.navigate(['/workout', workout.name]);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
