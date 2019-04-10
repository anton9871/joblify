import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http.service'; 
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  showDetails = false 
  details
  fullDetails
  compareIds = []
  favJobs
  newJob

  constructor(private _httpService: HttpService, private modalService: NgbModal, private _router:Router) { }

  open(content) {
    this.modalService.open(content, {size: 'lg', centered: true}).result.then((result) => {
    }, (reason) => {
    });
  }
  openJobForm(jobForm) {
    this.modalService.open(jobForm, {centered: true}).result.then((result) => {
    }, (reason) => {
    });
  }

  ngOnInit() {
    this.retrieveFavorites();

    this.fullDetails = {
      status: '',
      contactName: '',
      contactPosition: '',
      contactEmail: '',
      salaryRange: '',
      performanceBonus: 0,
      stockCompensation: 0,
      health: 0,
      dental: 0,
      vision: 0,
      K: 0,
      lifeInsurance: 0,
      commuterStipend: 0,
      cateredLunch: 0,
      gymStipend: 0,
      phoneStipend: 0
    }
    this.newJob = {
      company: '',
      title: '',
      location: '',
      logo: '',
      datePosted: '',
      type: '',
      description: '',
      url: ''
    }
  }

  retrieveFavorites(){
    this._httpService.getFavorites().subscribe(data =>{
      console.log(data)
      this.favJobs = data['data']
    })
  }

  showJobDetails(detailsJob){
    var newDetails = detailsJob.description.replace(/\"/g, "")
    this.details = newDetails
    this.showDetails = true
    this.fullDetails = detailsJob
  }

  deleteJob(id){
    this._httpService.deleteOneJob(id).subscribe(status =>{
      console.log(id, status)
      this.retrieveFavorites()
    })
  }

  updateJobDetails(id){
    this._httpService.updateJobDeets(this.fullDetails, id).subscribe(status => {
      console.log(status)
      this.retrieveFavorites()
      this.modalService.dismissAll(ModalDismissReasons)
    })
  }

  addNewJob(){
    this._httpService.addJob(this.newJob).subscribe(data => {
      console.log(status)
      this.modalService.dismissAll(ModalDismissReasons)
      this.retrieveFavorites()
    })
  }

  appendId(id){
    this.compareIds.push(id)
    console.log(this.compareIds)
  }
  compareTwoCompanies(){
    this._router.navigate(['/compare', this.compareIds[0], this.compareIds[1]])
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


}


