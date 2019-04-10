import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) { }

  registerUser(user){
    return this._http.post('/registerUser', user)
  }

  loginUser(user){
    return this._http.post('/loginUser', user)
  }

  logOutOfAcct(){
    return this._http.get('/logOut')
  }

  searchJob(job){
    return this._http.post('/jobSearch', job)
  }

  addFavJob(job){
    return this._http.post('/addFavJob', job)
  }

  getFavorites(){
    return this._http.get('/getFavorites')
  }
  
  deleteOneJob(id){
    return this._http.delete('/deleteJob/'+id)
  }

  updateJobDeets(data, id){
    return this._http.put('/putJobDetails/'+id, data)
  }

  addJob(job){
    return this._http.post('/addNewJob', job)
  }

  putStatus(data){
    return this._http.put('/putStatus', data)
  }

  getCompany(id){
    return this._http.get('/getCompany/'+id)
  }

  getJobStatusChart(){
    return this._http.get('/jobStatusChart')
  }

  getSalaryChart(){
    return this._http.get('/salaryChart')
  }

  getJobsByDay(){
    return this._http.get('/jobsAddedChart')
  }
}
