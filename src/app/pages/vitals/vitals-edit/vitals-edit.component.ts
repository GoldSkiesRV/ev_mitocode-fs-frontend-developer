import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Menu } from 'src/app/model/menu';
import { Patient } from 'src/app/model/patient';
import { VitalS } from 'src/app/model/vitals';
import { PatientService } from 'src/app/service/patient.service';
import { VitalsService } from 'src/app/service/vitals.service';
import { MatDialog } from '@angular/material/dialog';
import { PatientDialogComponent } from '../../patient/patient-dialog/patient-dialog.component';


@Component({
  selector: 'app-vitals-edit',
  standalone: true,
  templateUrl: './vitals-edit.component.html',
  styleUrls: ['./vitals-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule,RouterLink,NgFor, NgIf]
})
export class VitalsEditComponent implements OnInit{
  
  patients: Patient[];
  patients$: Observable<Patient[]>;
  form: FormGroup;
  id: number;
  isEdit: boolean;
  
  patientControl: FormControl = new FormControl();
  
  minDate: Date = new Date();
 
  
  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private vitalsService: VitalsService,
    private _snackBar: MatSnackBar
  ){}
  private _dialog = inject(MatDialog);

  ngOnInit(): void {
    
      
    this.form = new FormGroup({
      idVitalS: new FormControl(0),
      patient: this.patientControl,
      date: new FormControl('', [Validators.required, Validators.minLength(15)]),
      temperature: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      pulse: new FormControl('', [Validators.required,Validators.minLength(1), Validators.maxLength(100)]),
      respirationRate: new FormControl('', [Validators.required,Validators.minLength(1), Validators.maxLength(100)]),
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });

    this.loadInitialData();
    this.patients$ = this.patientControl.valueChanges.pipe(map(val => this.filterPatients(val)));
      }
      filterPatients(val: any){
        if(val?.idPatient > 0){
          console.log('filterPatients is called with value:', val);
          return this.patients.filter(el => 
            el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) ||
            el.lastName.toLowerCase().includes(val.lastName.toLowerCase()) ||
            el.dni.includes(val)
          );
        }else{
          return this.patients.filter(el => 
            el.firstName.toLowerCase().includes(val?.toLowerCase()) ||
            el.lastName.toLowerCase().includes(val?.toLowerCase()) || 
            el.dni.includes(val)
          );
        }
      }
      loadInitialData(){
       this.patientService.findAll().subscribe(data => this.patients = data);
      }
      initForm(){
        if(this.isEdit){
          
          this.vitalsService.findById(this.id).subscribe(data => {
            this.patientControl.setValue(data.patient);
            this.form = new FormGroup({
              idVitalS: new FormControl(data.idVitalS),
              patient: this.patientControl,
              date: new FormControl(data.date,[Validators.required, Validators.minLength(3)]),
              temperature: new FormControl(data.temperature, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
              pulse: new FormControl(data.pulse, [Validators.required,,Validators.minLength(1), Validators.maxLength(100)]),
              respirationRate: new FormControl(data.respirationRate, [Validators.required,Validators.minLength(1), Validators.maxLength(100)]),
            });
          });
          
        }
      }
      operate(){

        if(this.form.invalid){
          this._snackBar.open('FORM IS INVALID', 'INFO', { duration: 2000});
          return;
        }
    
        const vitals: VitalS = new VitalS();
        vitals.idVitalS = this.form.value['idVitalS'];
        vitals.patient = this.form.value['patient'];
        vitals.date = this.form.value['date'];
        vitals.temperature = this.form.value['temperature'];
        vitals.pulse = this.form.value['pulse'];
        vitals.respirationRate = this.form.value['respirationRate'];
    
        if(this.isEdit){
          this.vitalsService.update(this.id, vitals).subscribe(() => {
            this.vitalsService.findAll().subscribe(data => {
              this.vitalsService.setVitalChange(data);
              this.vitalsService.setMessageChange('UPDATED!');
            });
          });
        }else{
          this.vitalsService.save(vitals).pipe(switchMap( ()=> {
              return this.vitalsService.findAll();          
          }))
          .subscribe(data => {
            this.vitalsService.setVitalChange(data);
            this.vitalsService.setMessageChange('CREATED!');
          });
        }
    
        this.router.navigate(['/pages/vitals']);
      }

      
      
      openDialog(menu?: Menu) {
    this._dialog.open(PatientDialogComponent, {
      width: '350px',
      data: menu,
      disableClose: true
    }).beforeClosed().subscribe(() => {
      this.loadInitialData()
    });
  }
  }

