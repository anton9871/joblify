import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // 
import { HttpService } from './http.service'; //
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { LoginRegistrationComponent } from './login-registration/login-registration.component';
import { NavbarComponent } from './navbar/navbar.component';
import { JobSearchComponent } from './job-search/job-search.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { StatusBoardComponent } from './status-board/status-board.component';
import { CompareComponent } from './compare/compare.component';
import { MetricsComponent } from './metrics/metrics.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginRegistrationComponent,
    NavbarComponent,
    JobSearchComponent,
    FavoritesComponent,
    StatusBoardComponent,
    CompareComponent,
    MetricsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
