import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {DataService} from "../../services/data.service";
import {IResponseDTO} from "../../interfaces/IResponseDTO";
import {ISurvey} from "../../interfaces/ISurvey";
import { HttpService } from 'src/app/services/http.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  @Input() survey!: ISurvey;
  value!: string;
  order: number = 0;
  responseArr: IResponseDTO[] = [];
  
  startError: boolean = false; 
  startErrorMsg: string = ""; 
  error: boolean = false;
  errorMsg: string = "";

  modalOption: NgbModalOptions = {};
  constructor(private modalService: NgbModal, private dataService: DataService, private httpService: HttpService) {
  }

  ngOnInit(): void {
    this.sortQuestions();
  }

  sortQuestions(){
    this.survey.questionSet = this.survey.questionSet.sort(function(a,b){return a.questionOrder - b.questionOrder});
  }

  open(content:any) {
    this.httpService.getSurveyById(this.survey.id).pipe(first()).subscribe({
      next: data => {
        if(data === null){
          this.startError = true;
          this.startErrorMsg = "Survey no longer exists, please update survey list!";
          return;
        }
        this.survey = data;
        this.modalOption.backdrop = 'static';
        this.modalOption.keyboard = false;
        this.modalService.open(content,this.modalOption);
      },
      error: (err) => {
        this.modalOption.backdrop = 'static';
        this.modalOption.keyboard = false;
        this.modalService.open(content,this.modalOption);
        this.error = true;
        this.errorMsg = err;
      }
    })
  }

  previousQuestion() {
    if(this.value !== ""){
      this.responseArr[this.order] = {response: this.value, responseOrder: this.order};
    }
    this.order--;
    this.value = this.responseArr[this.order].response;
    this.error = false;
  }

  nextQuestion() {
    if(this.value !== "" && this.value !== undefined) {
      this.responseArr[this.order] = {response: this.value, responseOrder: this.order};
      this.order++;
      if (this.responseArr[this.order] !== undefined) {
        this.value = this.responseArr[this.order].response;
      } else {
        this.value = "";
      }
      this.error = false;
    }else{
      this.error = true;
      this.errorMsg = "Please answer the question!"
    }
  }

  submit() {
    if(this.value !== "") {
      this.responseArr[this.order] = {response: this.value, responseOrder: this.order};
      this.dataService.submitResponses({surveyId: this.survey.id, responses: this.responseArr});
      this.reset();
      this.modalService.dismissAll();
    }else{
      this.error = true;
      this.errorMsg = "Please answer the question!"
    }
  }

  reset() {
    this.order = 0;
    this.value = "";
    this.responseArr = [];
    this.error = false;
  }
}
