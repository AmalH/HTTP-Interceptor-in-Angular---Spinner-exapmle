import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { PendingRequestsInterceptor } from './services/pending-requests-interceptor.service';
import { SpinnerVisibilityService } from './services/spinner-visibility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'spinner-wtih-http-interceptor-sample';

  constructor(protected httpClient: HttpClient) {
  }

  public hitMyAPI() {

    console.log("worked --- ");
    this.httpClient.get("https://httpbin.org/get", {
      params: {},
      withCredentials: false,
      headers: new HttpHeaders(),
      observe: null,
      reportProgress: false
    }).pipe(finalize(() => {}))
    .subscribe(
      (data) => {
        console.log('HTTP Call test passed -- -- '+JSON.stringify(data));
      },
      (error) => {
        if (error.error.error) {
          console.log('ERROR ERROR ERROR -- -- '+JSON.stringify(error));
        }
      }
    );

  }
}
