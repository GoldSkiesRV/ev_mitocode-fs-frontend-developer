import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { Menu } from 'src/app/model/menu';
import { LoginService } from 'src/app/service/login.service';
import { MenuService } from 'src/app/service/menu.service';
import { ProfileComponent } from '../profile/profile.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [MaterialModule, RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgFor],
})
export class LayoutComponent implements OnInit {
  menus: Menu[];

  constructor(
    private loginService: LoginService,
    private menuService: MenuService
  ) {}
  private _dialog = inject(MatDialog);
  
  ngOnInit(): void {
    this.menuService.getMenuChange().subscribe((data) => {
      this.menus = data;
    });
  }

  logout() {
    this.loginService.logout();
  }
  openDialog(menu?: Menu) {
    this._dialog.open(ProfileComponent, {
      width: '350px',
      data: menu,
      disableClose: true
    });
  }
}
