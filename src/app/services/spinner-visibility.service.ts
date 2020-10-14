import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { PendingRequestsInterceptor } from './pending-requests-interceptor.service';

@Injectable({
    providedIn: 'root'
})
export class SpinnerVisibilityService {

    private _visibility$ = new ReplaySubject<boolean>(1);

    constructor(private pendingRequestsInterceptor: PendingRequestsInterceptor) {
    }

    get visibility$(): Observable<boolean> {
        return this._visibility$.asObservable();
    }

    public show(): void {
        this.pendingRequestsInterceptor.forceByPass = true;
        this._visibility$.next(true);
    }

    public hide(): void {
        this._visibility$.next(false);
        this.pendingRequestsInterceptor.forceByPass = false;
    }
}
