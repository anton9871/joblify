import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http.service'; 
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-status-board',
  templateUrl: './status-board.component.html',
  styleUrls: ['./status-board.component.css']
})
export class StatusBoardComponent implements OnInit {
  favJobs //binds all of the fav'd jobs from the db
  showDetails = false
  details
  fullDetails
  newJob




  constructor(private _httpService: HttpService, private modalService: NgbModal) { }

  open(content) {
    this.modalService.open(content, {size: 'lg', centered: true}).result.then((result) => {
    }, (reason) => {
    });
  }
  openJobReq(jobReq) {
    this.modalService.open(jobReq, {size: 'lg', centered: true}).result.then((result) => {
    }, (reason) => {
    });
  }
  openNewJobModal(jobForm) {
    this.modalService.open(jobForm, {centered: true}).result.then((result) => {
    }, (reason) => {
    });
  }

  setNewJobStatus(status){
    this.newJob.status = status
  }

  ngOnInit() {
    this.retrieveFavorites()
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
      url: '',
      status: ''
    }
  }

  retrieveFavorites(){
    this._httpService.getFavorites().subscribe(data =>{
      console.log(data['data'])
      this.favJobs = data['data']
    })
  }

  updateStatus(id, status){
    var statusObject = {
      id: id,
      status: status
    }
    this._httpService.putStatus(statusObject).subscribe(data => {
      console.log(data)
      this.retrieveFavorites()
    })
  }

  deleteJob(id){
    this._httpService.deleteOneJob(id).subscribe(data => {
      console.log(data)
      this.retrieveFavorites()
    })
  }

  showJobDetails(detailsJob){
    var newDetails = detailsJob.description.replace(/\"/g, "")
    this.details = newDetails
    this.showDetails = !this.showDetails
    this.fullDetails = detailsJob
    console.log(this.fullDetails)
  }
  updateJobDetails(id){
    this._httpService.updateJobDeets(this.fullDetails, id).subscribe(status => {
      console.log(status)
      this.modalService.dismissAll(ModalDismissReasons)
      this.retrieveFavorites()
    })
  }

  addNewJob(){
    this._httpService.addJob(this.newJob).subscribe(status => {
      console.log(status)
      this.modalService.dismissAll(ModalDismissReasons)
      this.retrieveFavorites() 
      this.newJob = {
        company: '',
        title: '',
        location: '',
        logo: '',
        datePosted: '',
        type: '',
        description: '',
        url: '',
        status: ''
      }
    })
  }


}
