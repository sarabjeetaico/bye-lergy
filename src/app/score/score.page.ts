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
  isLoading = false; // Add this flag

  constructor(public dataService: DataService) {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    this.fromDate = oneWeekAgo.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];
    this.displayDateRange = this.formatDateRange({ from: this.fromDate, to: this.toDate });
  }

  ionViewDidEnter() {
    this.fetchGraphData();
  }

  onDateChange() {
    this.fetchGraphData();
  }

  fetchGraphData() {
    this.isLoading = true;
    const selectedRange = { from: this.fromDate, to: this.toDate };
    this.displayDateRange = this.formatDateRange(selectedRange);
    this.dataService.get_grap_data(selectedRange).subscribe((res) => { 
      this.isLoading = false; // Hide loader first
      setTimeout(() => {      // Wait for DOM to update
        this.plotSimpleBarChart(
          res["day"], 
          res["occcular"], 
          res['Nasal'], 
          res['aqi'], 
          res['pollen'], 
          res['date_range']
        );
      }, 0);
    }, () => {
      this.isLoading = false;
    });
  }

  plotSimpleBarChart(days: any, o: any, n: any, aqi: any, pollen: any, date_range: any) {
    HighCharts.chart('highcharts', {
      chart: { type: 'spline' },
      title: { text: this.displayDateRange },
      xAxis: { categories: days, crosshair: true },
      yAxis: {
        min: 0,
        title: { text: '' }
      },
      credits: { enabled: false },
      tooltip: {
        useHTML: true,
        shared: true,
        formatter: function () {
          // Get the index of the hovered point
          const idx = this.points && this.points.length > 0 ? this.points[0].index : (typeof this.index === 'number' ? this.index : 0);
          let s = `<span style="font-size:10px">${days[idx]}</span><table>`;
          if (this.points) {
            this.points.forEach(function(point) {
              const yVal = typeof point.y === 'number' ? point.y.toFixed(1) : '';
              s += `<tr><td style="color:${point.color};padding:0">${point.series.name}: </td>` +
                   `<td style="padding:0"><b>${yVal}</b></td></tr>`;
            });
          }
          // Add AQI and Pollen manually
          s += `<tr><td style="color:#3b82f6;padding:0">AQI: </td><td style="padding:0"><b>${aqi[idx]}</b></td></tr>`;
          s += `<tr><td style="color:#f59e42;padding:0">Pollen: </td><td style="padding:0"><b>${pollen[idx]}</b></td></tr>`;
          s += '</table>';
          return s;
        }
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
          color: '#3b82f6',
          visible: false,        // Hide line
          showInLegend: false    // Hide from legend
        },
        {
          name: 'Pollen',
          type: "spline",
          data: pollen,
          color: '#f59e42',
          visible: false,        // Hide line
          showInLegend: false    // Hide from legend
        }
      ]
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

  // Add this method to your class to show a modal (example using Ionic Alert)
  async showAqiPollenModal(aqi: number, pollen: number, day: string) {
    const alert = document.createElement('ion-alert');
    alert.header = `Details for ${day}`;
    alert.message = `<b>AQI:</b> ${aqi}<br><b>Pollen:</b> ${pollen}`;
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    await alert.present();
  }
}