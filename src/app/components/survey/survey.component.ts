import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DataService} from "../../services/data.service";
import {IResponseDTO} from "../../interfaces/IResponseDTO";
import {ISurvey} from "../../interfaces/ISurvey";

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
  error: boolean = false;
  errorMsg: string = "";

  constructor(private modalService: NgbModal, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.sortQuestions();
  }

  sortQuestions(){
    this.survey.questionSet = this.survey.questionSet.sort(function(a,b){return a.questionOrder - b.questionOrder});
  }

  open(content:any) {
    this.modalService.open(content);
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
