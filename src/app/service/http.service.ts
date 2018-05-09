import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpService {

  private baseApi: string = 'http://35.231.234.251:15647/api';
  constructor(private http: HttpClient) {

  }

  public login() {
    let headers: HttpHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/x-www-form-urlencoded',
      });
    let options: any = { headers: headers, observe: 'response' };
    let body = 'user=test&pass=test20181';
    return this.http.post(`${this.baseApi}/accounts/login/`, body, options);
  }

  public getData() {
    return this.http.get<GraphData>('http://35.231.234.251:15647/api/network/10.12.13.113/graph/',
      { withCredentials: true });
  }
}

export interface GraphData{
  incoming_devices:any[],
  incoming_links:any[],
  incoming_protocols:any[],
  outgoing_devices:any[],
}
