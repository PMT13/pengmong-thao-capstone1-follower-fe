import {Component, OnDestroy, OnInit} from '@angular/core';
import {ISurvey} from "../../interfaces/ISurvey";
import {ISurveyResponses} from "../../interfaces/ISurveyResponses";
import {first, Subscription} from "rxjs";
import {DataService} from "../../services/data.service";
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit,OnDestroy {

  surveyList!: ISurvey[];
  surveyResponses!: ISurveyResponses[];

  sub:Subscription;
  subTwo: Subscription;

  constructor(private dataService: DataService, private httpService: HttpService) {
    this.surveyList = this.dataService.surveyList;
    this.surveyResponses = this.dataService.surveyResponses;

    this.sub =
      this.dataService.$surveyList.subscribe((surveyList) => {
        this.surveyList = surveyList;
      });

    this.subTwo =
      this.dataService.$surveyResponses.subscribe((surveyResponses) => {
        this.surveyResponses = surveyResponses;
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.subTwo.unsubscribe();
  }

  updateSurveyList(){
    this.httpService.getAllSurveys().pipe(first()).subscribe({
      next: data => {
        this.dataService.surveyList = data;
        this.dataService.$surveyList.next(data);
      },
      error: (err) => {
        alert(err);
      }
    })
  }
}
