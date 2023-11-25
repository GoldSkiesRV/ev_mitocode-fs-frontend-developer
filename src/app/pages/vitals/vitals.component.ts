import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { VitalS } from 'src/app/model/vitals';
import { VitalsService } from 'src/app/service/vitals.service';

@Component({
  selector: 'app-vitals',
  standalone: true,
  templateUrl: './vitals.component.html',
  styleUrls: ['./vitals.component.css'],
  imports: [MaterialModule, RouterLink, RouterOutlet],
})
export class VitalsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'patient', 'date', 'temperature', 'pulse','respirationRate','actions'];
  dataSource: MatTableDataSource<VitalS>;

  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number = 0;
  
  constructor(
    private route: ActivatedRoute,
    private vitalsService: VitalsService,
    private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
      this.vitalsService.getVitalChange().subscribe(data => {
        this.createTable(data);
      });
  
      this.vitalsService.getMessageChange().subscribe(data => {
        this._snackBar.open(data, 'INFO', { duration: 2000,horizontalPosition: 'right', verticalPosition: 'top'});
      });
  
      this.vitalsService.listPageable(0, 4).subscribe(data => {
        this.totalElements = data.totalElements;
        this.createTable(data.content);
      });

    }
    
    createTable(data: VitalS[]){
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
     // this.dataSource.paginator = this.paginator;
    }
    
    applyFilter(e: any) {
      this.dataSource.filter = e.target.value.trim().toLowerCase();
    }
   
    
    conPatientInfo(row: VitalS): string {
    return row.patient ? row.patient.dni + ' ' + row.patient.firstName +' '+row.patient.lastName: '';
    }

    delete(idVitalS: number){
      this.vitalsService.delete(idVitalS).pipe(switchMap( ()=> {
        return this.vitalsService.findAll();
      }))
      .subscribe(data => {
        this.vitalsService.setVitalChange(data);
        this.vitalsService.setMessageChange('DELETED!');
      })
      ;
    }
    checkChildren(): boolean{
      return this.route.children.length != 0;
    }
    showMore(e: any){
      this.vitalsService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
        this.vitalsService = data.totalElements;
        this.createTable(data.content);
      });
    }
    
}

 