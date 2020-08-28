import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface ITipes {
  'tipes': string;
  'count': Map<string, number>;
}

export interface IResponse {
  'Tipe': ITipes[];
}

export class Row {
  year: number;
  values: Map<string, number>;


  constructor(year: number, values: Map<string, number>) {
    this.year = year;
    this.values = values;
  }
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }

  getData(): Observable<IResponse> {
    return this.http.get<IResponse>('../../assets/data.json');
}
}
