import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http.service';
import { Chart } from 'chart.js'
import { toTypeScript } from '@angular/compiler';




@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {
doughnutData
doughnutLabels
doughnutType = 'doughnut'
doughnutOptions = {
  legend: {
    labels: {
      fontColor: 'white',
      fontSize: 14
    }
  }
}


salaryData
salaryLabels  
salaryType = 'horizontalBar'
salaryOptions = {
  legend: {
    display: false
    },
  scales: {
    xAxes: [{
        ticks: {
            beginAtZero: true,
            backgroundColor: 'green'
        }
    }],
    yAxes: [{
      ticks: {
          fontColor: "white"
      }
    }]
  }
}

jobsAddedData
jobsAddedLabels
jobsAddedType = 'line'
jobsAddedOptions = {
  legend: {
    display: false
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }
}


  

  
  constructor(private _httpService: HttpService) { }
  
  ngOnInit() {
    this.jobStatusChart()
    this.salaryChart()
    this.jobsByDayChart()

  }

  jobStatusChart(){
    this._httpService.getJobStatusChart().subscribe(res => {
      this.doughnutData = res['yAxis']
      this.doughnutLabels = res['xAxis']
    })
  }

  salaryChart(){
    this._httpService.getSalaryChart().subscribe(res => {
      this.salaryLabels = res['xAxis']
      this.salaryData = res['yAxis']
    })
  }

  jobsByDayChart(){
    this._httpService.getJobsByDay().subscribe(res => {
      this.jobsAddedLabels = res['xAxis']
      this.jobsAddedData = res['yAxis']
    })
  }







}
