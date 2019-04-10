import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http.service'; 
import { ActivatedRoute, Router, ParamMap } from '@angular/router'

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  favJobs
  showTable: boolean = false

  company1
  company2
  company3
 
  job1
  job2
  job3

  constructor(private _httpService: HttpService, private _route:ActivatedRoute, private _router:Router) { }

  ngOnInit() {
    this.retrieveFavorites()
    this._route.paramMap.subscribe((params: ParamMap) =>{
      let id1 = parseInt(params.get('id1'))
      this.company1 = id1
      let id2 = parseInt(params.get('id2'))
      this.company2 = id2 
      let id3 = parseInt(params.get('id3'))
      this.company3 = id3
    })
    this.getCompany1(this.company1)
    this.getCompany2(this.company2)
    this.getCompany2(this.company3)
  }

  retrieveFavorites(){
    this._httpService.getFavorites().subscribe(data =>{
      console.log(data)
      this.favJobs = data['data']
    })
  }

  getCompany1(company1){
    this._httpService.getCompany(company1).subscribe(data => {
      this.job1 = data['data'][0]
    })
  }
  getCompany2(company2){
    this._httpService.getCompany(company2).subscribe(data => {
      this.job2 = data['data'][0]
    })
  }
  getCompany3(company3){
    this._httpService.getCompany(company3).subscribe(data => {
      this.job2 = data['data'][0]
    })
  }

}
