import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ISurvey} from "../interfaces/ISurvey";
import {ISurveyResponses} from "../interfaces/ISurveyResponses";
import { ISurveyResponsesDTO } from '../interfaces/ISurveyResponsesDTO';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  getAllSurveys() {
    return this.httpClient.get('http://localhost:3000/api/survey') as Observable<ISurvey[]>
  }

  getAllResponses() {
    return this.httpClient.get('http://localhost:3000/api/surveyresponses') as Observable<ISurveyResponses[]>
  }

  submitResponses(responses: ISurveyResponsesDTO) {
    return this.httpClient.post('http://localhost:3000/api/surveyresponses',responses) as Observable<ISurveyResponses[]>
  }
}
