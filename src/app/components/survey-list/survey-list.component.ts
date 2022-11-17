import {Component, OnDestroy, OnInit} from '@angular/core';
import {ISurvey} from "../../interfaces/ISurvey";
import {ISurveyResponses} from "../../interfaces/ISurveyResponses";
import {Subscription} from "rxjs";
import {DataService} from "../../services/data.service";

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

  constructor(private dataService: DataService) {
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

}
