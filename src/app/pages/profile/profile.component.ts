import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MaterialModule } from 'src/app/material/material.module';
import { Menu } from 'src/app/model/menu';
import { MenuService } from 'src/app/service/menu.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [MaterialModule]
})
export class ProfileComponent implements OnInit{

  username: string;
  role: [];
  constructor(
    private menuService: MenuService,
    @Inject(MAT_DIALOG_DATA) private data: Menu,
    private _dialogRef: MatDialogRef<ProfileComponent>
    ){
   
  }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const decodeToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));
    this.username = decodeToken.sub;
    this.role = decodeToken.role;
  }
  close(){
    this._dialogRef.close();
  }
}
