import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as fromTraining from '../training.reducer';


@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>(); //MatTableDataSource auto assumes you pass in a type of array, don't need to pass in array manually e.g. <Exercise[]>

  @ViewChild(MatSort) sortProperty: MatSort;
  @ViewChild(MatPaginator) paginatorProperty: MatPaginator;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit(): void {
    this.store.select(fromTraining.getFinishedExercises).subscribe(
      (exercisesArray: Exercise[]) => {
        this.dataSource.data = exercisesArray;
      }
    );
    this.trainingService.fetchedFinishedExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sortProperty;
    this.dataSource.paginator = this.paginatorProperty;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
