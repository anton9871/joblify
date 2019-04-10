import { Component, OnInit } from '@angular/core'
import {HttpService} from '../http.service'
import { Router } from '@angular/router'
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css']
})
export class JobSearchComponent implements OnInit {

  job:Object = {
    keyWord: "",
    location: ""
  }

  public searchResults

  newJob:object

  showDetails = false
  details
  fullDetails

  // success message when user favorites a job
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  


  constructor(private _httpService: HttpService, private _router:Router) { }

  ngOnInit() {
    
    setTimeout(() => this.staticAlertClosed = true, 3000);
    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);

  }

  searchForJob(){
    this._httpService.searchJob(this.job).subscribe(data =>{
      console.log(data)
      if(data['status'] == 'fail'){
        this._router.navigate(['/'])
      }
      this.searchResults = data
    })
  }

  addFavoriteJob(job){
    this.newJob = {
      title: job.title,
      company: job.company,
      logo: job.company_logo,
      datePosted: job.created_at ,
      type: job.type ,
      description: job.description ,
      howToApply: job.how_to_apply,
      url : job.company_url ,
      location: job.location
      
    }
    this._httpService.addFavJob(this.newJob).subscribe(data => {
      console.log(data)
    })
  }


  showJobDetails(detailsJob){
    var newDetails = detailsJob.description.replace(/\"/g, "")
    this.details = newDetails
    this.showDetails = true
    this.fullDetails = detailsJob
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  public successAlert() {
    this._success.next('Successfully added job to favorites list');
  }
}
