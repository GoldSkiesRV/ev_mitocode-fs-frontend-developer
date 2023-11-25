import { NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';
import { VitalsService } from 'src/app/service/vitals.service';
import { VitalS } from 'src/app/model/vitals';

@Component({
  selector: 'app-patient-dialog',
  standalone: true,
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.css'],
  imports: [ MaterialModule, FormsModule, NgIf ]
})
export class PatientDialogComponent implements OnInit{

  patient: Patient;
  consultsArray: number[] = [];
  patients: Patient[];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Patient,
    private _dialogRef: MatDialogRef<PatientDialogComponent>,
    private patientService: PatientService,
    private vitalsService: VitalsService
    
  ){

  }
  
  ngOnInit(): void {
    this.patient = {...this.data};
  }

  operate(){
      //INSERT
      this.patientService
          .save(this.patient)
          .pipe(switchMap( ()=> this.patientService.findAll() ))
          .subscribe(data => {
            this.patientService.setPatientChange(data);
            this.patientService.setMessageChange('CREATED!');
            this.close();
          });
          
    
    }
  close(){
    this._dialogRef.close();
  }

}

