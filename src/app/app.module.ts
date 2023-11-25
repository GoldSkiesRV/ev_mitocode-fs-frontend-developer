import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ServerErrorsInterceptor } from './interceptor/server-errors-interceptor';
import { environment } from 'src/environments/environment.development';
import { JwtModule } from '@auth0/angular-jwt';
import { VitalsComponent } from './pages/vitals/vitals.component';
import { VitalsEditComponent } from './pages/vitals/vitals-edit/vitals-edit.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PatientDialogComponent } from './pages/patient/patient-dialog/patient-dialog.component';

export function tokenGetter() {
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

@NgModule({
  declarations: [
    AppComponent,
    //PatientDialogComponent,
    //ProfileComponent,
    //VitalsComponent,
    //VitalsEditComponent,
    //PatientComponent, PatientEditComponent, MedicComponent, se remueve por que ahora es standalone 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:8080"],
        disallowedRoutes: ["http://localhost:8080/login/forget"],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
