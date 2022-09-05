import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { SocketService } from './socket.service';
import { DatePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  selectedTemp = '';
  selectedHum = '';
  stopListeningTemp:Boolean=false;
  stopListeningHum:Boolean=false;

  
  @ViewChild("canvas", { static: true }) canvas!: ElementRef;
  @ViewChild("canvasDos", { static: true }) canvasDos!: ElementRef;
  hum:String="0";
  temp:String="0";
  fecha:any;
  hora:any;
  chart!: Chart;
  chartDos!: Chart;
  gradient: any;
  array: any=[];
  arrayHum:any=[];
  arrayDate: any=[];
  arrayDate2: any=[];
  constructor(socket:SocketService){
    Chart.register(...registerables);
    socket.socket.on("iot/sensors",(dta:any)=>{
      this.fecha = new DatePipe("en-US").transform(new Date().getTime(),'short');
      if (dta.sensor == 'TEMP') {
        if(!this.stopListeningTemp){
          this.temp = ''+Math.trunc(dta.value)+" ºC";
          this.array.push(Math.trunc(dta.value))
          this.arrayDate.push( new DatePipe("en-US").transform(new Date().getTime(),'mediumTime'));
          this.updateChart();
          console.log(this.array)
          console.log(this.arrayDate)

        }
        
      }else{
        if(!this.stopListeningHum){
          this.hum = ''+Math.trunc(dta.value)+" %";
          this.arrayHum.push(Math.trunc(dta.value))
          this.arrayDate2.push(new DatePipe("en-US").transform(new Date().getTime(),'mediumTime'));
          this.updateChartDos(); 
        }
      }
      
    })
  }

  onSelectedTemp(value:string): void {
		this.selectedTemp = value;
    switch (value) {
      case "Tiempo Real":
        this.stopListeningTemp=false
        break;
      case "15 min":
        this.stopListeningTemp=true
        break;
      case "30 min":
        this.stopListeningTemp=true
        break;
      case "60 min":
        this.stopListeningTemp=true
        break;
    }
	}
	onSelectedHum(value:string): void {
		this.selectedHum = value;
    switch (value) {
      case "Tiempo Real":
        this.stopListeningHum=false
        break;
      case "15 min":
        this.stopListeningHum=true
        break;
      case "30 min":
        this.stopListeningHum=true
        break;
      case "60 min":
        this.stopListeningHum=true
        break;
    }
	}

  ngOnInit(){
    this.updateChart();
    this.updateChartDos();
  }

  resetChart2(){
   
  }

  initChart(){
    this.gradient = this.canvas.nativeElement.getContext("2d").createLinearGradient(0, 0, 0, 200);
    this.gradient.addColorStop(0, "#81818166");
    this.gradient.addColorStop(1,"#FFFFFF80");
    this.chart = new Chart(this.canvas.nativeElement, {
      type: "line",
      data: {
          labels: [],
          datasets: []
      },
      // Configuration options go here
      options: {
        responsive: true,
        scales: {
          y: {
            ticks: { color: 'white'}
          },
          x: {
            ticks: { color: 'white' }
          }
        }
      }
    });
  }
  initChartDos(){
    this.gradient = this.canvasDos.nativeElement.getContext("2d").createLinearGradient(0, 0, 0, 200);
    this.gradient.addColorStop(0, "#81818166");
    this.gradient.addColorStop(1,"#FFFFFF80");
    this.chartDos = new Chart(this.canvasDos.nativeElement, {
      type: "line",
      data: {
          labels: [],
          datasets: [],
      },
      // Configuration options go here
      options: {
        responsive: true,
        scales: {
          y: {
            ticks: { color: 'white'}
          },
          x: {
            ticks: { color: 'white' }
          }
        }
      }
    });
  }
  setLabels(){
    this.chart.data.labels = this.arrayDate;
  }
  setLabelsDos(){
    this.chartDos.data.labels = this.arrayDate2;
  }
  setDatasets(){
    this.chart.data.datasets = [{
       label: "Temperatura",
       data: this.array,
       backgroundColor: ['rgba(30,144,255)'],
       borderColor: ['rgba(30,144,255)'],
       borderWidth: 1,
       fill: false,
       pointBorderColor: 'rgba(0, 0, 0, 0)',
       pointBackgroundColor: 'rgba(0, 0, 0, 0)',
       pointHoverBackgroundColor: 'rgb(255, 99, 132)',
       pointHoverBorderColor: 'rgb(255, 99, 132)'
       
     }]
   }
   setDatasetsDos(){
    this.chartDos.data.datasets = [{
       label: "Humedad",
       data: this.arrayHum,
       backgroundColor: ['rgba(30,144,255)'],
       borderColor: ['rgba(30,144,255)'],
       borderWidth: 1,
       fill: false,
       pointBorderColor: 'rgba(0, 0, 0, 0)',
       pointBackgroundColor: 'rgba(0, 0, 0, 0)',
       pointHoverBackgroundColor: 'rgb(255, 99, 132)',
       pointHoverBorderColor: 'rgb(255, 99, 132)'
     }]
   }
   updateChart(){
    let chartCan = this.canvas.nativeElement;
    if(chartCan){
      if(!this.chart) this.initChart();
      this.setLabels();
      this.setDatasets();
      this.chart.update();
    } 
  }
  updateChartDos(){
    let chartCan = this.canvasDos.nativeElement;
    if(chartCan){
      if(!this.chartDos) this.initChartDos();
      this.setLabelsDos();
      this.setDatasetsDos();
      this.chartDos.update();
    } 
  }
  
}