import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
// using Observables allows a developer to think about the data that flows through an application as streams of information that the application can dip into and use whenever it wants. These streams change over time, which allows the application to react to these changes. 
import { Observable } from 'rxjs/Observable';
// The RxJS library provides operators that allow you to subscribe to and query these data streams. Moreover, you can easily mix and combine them
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/toPromise';

import { Exercise, ExercisePlan, WorkoutPlan } from './model';

// @Injectable to support injecting WorkoutService throughout our application
@Injectable()
export class WorkoutService {
    workouts: Array<WorkoutPlan> = [];
    exercises: Array<Exercise> = [];
    workout: WorkoutPlan;
    collectionsUrl = 'https://api.mongolab.com/api/1/databases/personaltrainer/collections';
    apiKey = '9xfTWt1ilKhqIqzV9Z_8jvCzo5ksjexx';
    params = '?apiKey=' + this.apiKey;

    // we will use http.get (which is an AJAX function) to access mongolab api
    // there is a difference between Angular handles HTTP requests and normal HTTP AJAX request: Calling a request now returns an Observable of HTTP responses. It does so by using the RxJS library
    constructor(public http: Http) { // we will use http.get (which is an AJAX function) to access mongolab api
    }

    getExercises(){
        // http.get method returns an Observable of HTTP responses (Observable<Response>) from the RxJS library
        return this.http.get(this.collectionsUrl + '/exercises' + this.params)
            // The map method is in the RxJS library we imported earlier. map request of RxJS will returns an Observable object
            .map((res: Response) => <Exercise[]>res.json()) // parse in to `<Exercise[]>`
            // The catch method is in the RxJS library we imported earlier
            .catch(WorkoutService.handleError);
    }

    getExercise(exerciseName: string){
        return this.http.get(this.collectionsUrl + '/exercises/' + exerciseName  + this.params)
            .map((res: Response) => <Exercise>res.json())
            .catch(WorkoutService.handleError);
    }

    updateExercise(exercise: Exercise){
        for (var i = 0; i < this.exercises.length; i++) {
            if (this.exercises[i].name === exercise.name) {
                this.exercises[i] = exercise;
            }
        }
        return exercise;
    }

    addExercise(exercise: Exercise){
        if (exercise.name) {
            this.exercises.push(exercise);
            return exercise;
        }
    }

    deleteExercise(exerciseName: string){
        let exerciseIndex: number;
        for (var i = 0; i < this.exercises.length; i++) {
            if (this.exercises[i].name === exerciseName) {
                exerciseIndex = i;
            }
        }
        if (exerciseIndex >= 0) this.exercises.splice(exerciseIndex, 1);
    }

    getWorkouts(){
        return this.http.get(this.collectionsUrl + '/workouts' + this.params)
            .map((res:Response) => <WorkoutPlan[]>res.json())
            .map((workouts:Array<any>) => {
                let result:Array<WorkoutPlan> = [];
                if (workouts) {
                    workouts.forEach((workout) => {
                        result.push(
                            new WorkoutPlan( // this will allow you to use functions in WorkoutPlan class like 'totalWorkoutDuration'
                                workout.name,
                                workout.title,
                                workout.restBetweenExercise,
                                workout.exercises,
                                workout.description
                            ));
                    });
                }
                return result;
            })
            .catch(WorkoutService.handleError);
    }

    getWorkout(workoutName:string) {
        // forkJoin operator is that not only does it allow us to return multiple Observable streams, but it also waits until both Observable streams have retrieved their data before further processing the results. 
        // In other words, it enables us to stream the responses from multiple concurrent HTTP requests and then operate on the combined results.
        return Observable.forkJoin( // will return an array of {<Exercise[]>, <WorkoutPlan>} or data = {0: {}, 1: {}}
            this.http.get(this.collectionsUrl + '/exercises' + this.params).map((res:Response) => <Exercise[]>res.json()),
            this.http.get(this.collectionsUrl + '/workouts/' + workoutName + this.params).map((res:Response) => <WorkoutPlan>res.json())
        ).map(
            (data:any) => {
                let allExercises = data[0];
                let workout = new WorkoutPlan(
                    data[1].name,
                    data[1].title,
                    data[1].restBetweenExercise,
                    data[1].exercises,
                    data[1].description
                )
                workout.exercises.forEach(
                    (exercisePlan:any) => exercisePlan.exercise = allExercises.find(
                        (x:any) => x.name === exercisePlan.name
                    )
                )
                return workout;
            }
        )
        .catch(WorkoutService.handleError);
    }

    addWorkout(workout:any) {
        let workoutExercises:any = [];
        workout.exercises.forEach(
            (exercisePlan:any) => {
                workoutExercises.push({name: exercisePlan.exercise.name, duration: exercisePlan.duration})
            }
        );

        let body = {
            "_id": workout.name,
            "exercises": workoutExercises,
            "name": workout.name,
            "title": workout.title,
            "description": workout.description,
            "restBetweenExercise": workout.restBetweenExercise
        };

        return this.http.post(this.collectionsUrl + '/workouts' + this.params, body)
            .map((res:Response) => res.json())
            .catch(WorkoutService.handleError)
    }

    updateWorkout(workout:WorkoutPlan) {
        let workoutExercises:any = [];
        workout.exercises.forEach(
            (exercisePlan:any) => {
                workoutExercises.push({name: exercisePlan.exercise.name, duration: exercisePlan.duration})
            }
        );

        let body = {
            "_id": workout.name,
            "exercises": workoutExercises,
            "name": workout.name,
            "title": workout.title,
            "description": workout.description,
            "restBetweenExercise": workout.restBetweenExercise
        };

        return this.http.put(this.collectionsUrl + '/workouts/' + workout.name + this.params, body)
            .map((res:Response) => res.json())
            .catch(WorkoutService.handleError);
    }

    deleteWorkout(workoutName:string) {
        return this.http.delete(this.collectionsUrl + '/workouts/' + workoutName + this.params)
            .map((res:Response) => res.json())
            .catch(WorkoutService.handleError)
    }

    static handleError(error: Response) {
        console.log(error);
        //  use Observable.throw to convert the JSON error into a user-friendly message
        return Observable.throw(error || 'Server error');
    }
}
