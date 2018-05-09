import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  constructor(private http: HttpService) { }

  ngOnInit() {
    // this.http.getData().subscribe(res => {
    //   console.log('getData results', res);
    // });
  }
}
