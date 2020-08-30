import {Component, OnInit} from '@angular/core';
import {Chart} from 'chart.js';

import {HttpService, ITipes, Row} from '../http.service';


@Component({
  selector: 'app-table-and-doughnut',
  templateUrl: './table-and-doughnut.component.html',
  styleUrls: ['./table-and-doughnut.component.scss']
})

export class TableAndDoughnutComponent implements OnInit {
  tipes: ITipes[] = [];
  columnNames: string[];
  rows: Array<Row> = [];
  years = [];
  total = [];
  prevSortKey: string;
  prevIsAcs: boolean;

  chart = [];

  constructor(
    private http: HttpService
  ) {
  }

  ngOnInit() {
      this.http.getData().subscribe(response => {
      this.tipes = response.Tipe;
      const raw = response.Tipe;

      this.columnNames = this.tipes.map((it) => {
        return it.tipes;
      });
      const years = this.tipes.map((it) => {
        return Object.keys(it.count);
      })
        .reduce((l, r) => {
          return l.concat(r);
        })
        .reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], [])
        .sort();


      for (const year of years) {
        const map = new Map<string, number>();
        for (const name of this.columnNames) {
          const v = raw.find(x => x.tipes === name).count[year];
          map.set(name, v ? v : 0);
        }
        this.rows.push(new Row(year, map));
      }

      this.total = this.tipes.map((it) => {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        return Object.values(it.count).reduce(reducer);
      });

      this.chart = new Chart('canvas', {
        type: 'doughnut',
        data: {
          labels: this.columnNames, //
          datasets: [
            {
              data: this.total,
              borderColor: 'white',
              backgroundColor: [
                '#e5884b',
                '#c5051c',
                '#f5de4f',
                '#f66e24',
                '#00FFFF',
                '#f990a7',
                '#aad2ed',
                '#FF00FF'
              ],
            }
          ]
        },
        options: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
            }
          },
          scales: {
            xAxes: [{
              display: false
            }],
            yAxes: [{
              display: false
            }],
          }
        }
      });
    });

  }

  sortByYear() {
    this.prevIsAcs = this.prevSortKey === 'year' ? !this.prevIsAcs : true;

    this.rows.sort((a, b) => {
      return this.prevIsAcs ? a.year - b.year : b.year - a.year;
    });

    this.prevSortKey = 'year';
  }

  sort(event) {
    const sortKey = event.target.innerHTML;
    this.prevIsAcs = this.prevSortKey === sortKey ? !this.prevIsAcs : true;

    this.prevSortKey = sortKey;

    this.rows.sort((a, b) => {
      if (this.prevIsAcs) {
        return a.values.get(sortKey) - b.values.get(sortKey);
      } else {
        return b.values.get(sortKey) - a.values.get(sortKey);
      }

    });
  }


}
