import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingService {
    private firebaseSubscription: Subscription[] = [];

    constructor(private database: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromTraining.State>
    ) { }

    fetchAvailableExercises() {
        this.store.dispatch(new UI.StartLoading());
        this.firebaseSubscription.push(this.database.collection('availableExercises')
            .snapshotChanges()
            .pipe(
                map(docArray => {
                    return docArray.map(document => {
                        return {
                            id: document.payload.doc.id,
                            ...document.payload.doc.data() as Exercise
                        };
                    });
                })
            ).subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new UI.StopLoading());
                this.store.dispatch(new Training.SetAvailableTraining(exercises));
            }, error => {
                this.store.dispatch(new UI.StopLoading());
                this.uiService.showSnackBar('Fetching exercises failed, please try again.', null, 3000);
            }));
    }

    startExercise(selectedID: string) {
        this.store.dispatch(new Training.StartActiveTraining(selectedID));
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDataBase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(),
                state: 'Cancelled'
            });
            this.store.dispatch(new Training.StopActiveTraining());
        });
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDataBase({
                ...ex,
                date: new Date(),
                state: 'Completed'
            });
            this.store.dispatch(new Training.StopActiveTraining());
        });
    }

    fetchedFinishedExercises() {
        this.firebaseSubscription.push(this.database.collection('finishedExercises')
            .valueChanges()
            .subscribe((exercisesArray: Exercise[]) => {
                this.store.dispatch(new Training.SetFinishedTraining(exercisesArray));
            }
        ));
    }

    cancelSubscription() {
        this.firebaseSubscription.forEach(sub => sub.unsubscribe());
    }

    addDataToDataBase(exercise: Exercise) {
        this.database.collection('finishedExercises').add(exercise);
    }
}