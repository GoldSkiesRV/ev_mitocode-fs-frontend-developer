import { Injectable } from '@angular/core';
import { VitalS } from '../model/vitals';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VitalsService extends GenericService<VitalS> {
  
  private vitalSignChange = new Subject<VitalS[]>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient){
    super(http,`${environment.HOST}/vitals`);

  }
  getVitalChange(){
    return this.vitalSignChange.asObservable();
  }

  setVitalChange(data: VitalS[]){
    this.vitalSignChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }
  listPageable(p: number, s: number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}
