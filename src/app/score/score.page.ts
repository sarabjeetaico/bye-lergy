import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { DataService } from '../services/data.service';
import * as HighCharts from 'highcharts';

@Component({
  standalone: true,
  selector: 'app-score',
  templateUrl: './score.page.html',
  styleUrls: ['./score.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, FooterComponent],
})
export class ScorePage {
  showStartCalendar = false;
  showEndCalendar = false;
  displayDateRange: string;
  today = new Date().toISOString().split('T')[0];
  fromDate: string;
  toDate: string;

  constructor(public dataService: DataService) {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    this.fromDate = oneWeekAgo.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];
    this.displayDateRange = this.formatDateRange({ from: this.fromDate, to: this.toDate });
  }

  ionViewDidEnter() {
    const selectedRange = { from: this.fromDate, to: this.toDate };
    this.displayDateRange = this.formatDateRange(selectedRange);
    this.dataService.get_grap_data(selectedRange).subscribe((res) => { 
      this.plotSimpleBarChart(
        res["day"], 
        res["occcular"], 
        res['Nasal'], 
        res['aqi'], 
        res['pollen'], 
        res['date_range']
      );
    });
  }

  plotSimpleBarChart(days: any, o: any, n: any, aqi: any, pollen: any, date_range: any) {
    HighCharts.chart('highcharts', {
      chart: { type: 'spline' }, // Set default chart type to line/spline
      title: { text: this.displayDateRange },
      xAxis: { categories: days, crosshair: true },
      yAxis: {
        min: 0,
        title: { text: '' }
      },
      credits: { enabled: false },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      series: [
        {
          name: 'Ocular',
          type: "spline",
          data: o,
          color: '#863391'
        },
        {
          name: 'Nasal',
          type: "spline",
          data: n,
          color: '#e3489f'
        },
        {
          name: 'AQI',
          type: "spline",
          data: aqi,
          color: '#3b82f6'
        },
        {
          name: 'Pollen',
          type: "spline",
          data: pollen,
          color: '#f59e42'
        }
      ]
    });
  }

  onDateChange() {
    const selectedRange = { from: this.fromDate, to: this.toDate };
    this.displayDateRange = this.formatDateRange(selectedRange);
    this.dataService.get_grap_data(selectedRange).subscribe((res) => { 
      this.plotSimpleBarChart(
        res["day"], 
        res["occcular"], 
        res['Nasal'], 
        res['aqi'], 
        res['pollen'], 
        res['date_range']
      );
    });
  }

  selectStartDate(event: any) {
    this.fromDate = event.detail.value;
    this.onDateChange();
  }

  selectEndDate(event: any) {
    this.toDate = event.detail.value;
    this.onDateChange();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  formatDateRange(range: { from: string; to: string }): string {
    const from = this.formatDate(range.from);
    const to = this.formatDate(range.to);
    return `${from} to ${to}`;
  }
}