import { Component, Input, OnInit } from '@angular/core';
import { merge, Observable, partition, timer } from 'rxjs';
import { debounce, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Spinkit } from 'src/app/models/spinkits';
import { PendingRequestsInterceptor } from 'src/app/services/pending-requests-interceptor.service';
import { SpinnerVisibilityService } from 'src/app/services/spinner-visibility.service';
@Component({
    selector: 'ng-http-loader',
    templateUrl: './ng-http-loader.component.html',
    styleUrls: ['./ng-http-loader.component.scss']
})
export class NgHttpLoaderComponent implements OnInit {

    public spinkit = Spinkit;
    public isVisible$!: Observable<boolean>;
    private visibleUntil = Date.now();

    @Input() public backdrop = true;
    @Input() public backgroundColor!: string;
    @Input() public debounceDelay = 0;
    @Input() public entryComponent: any = null;
    @Input() public extraDuration = 0;
    @Input() public filteredHeaders: string[] = [];
    @Input() public filteredMethods: string[] = [];
    @Input() public filteredUrlPatterns: string[] = [];
    @Input() public minDuration = 0;
    @Input() public opacity = '.7';
    @Input() public spinner: string | null = Spinkit.skCubeGrid;

    constructor(private pendingRequestsInterceptor: PendingRequestsInterceptor, private spinnerVisibility: SpinnerVisibilityService) {
    }

    public ngOnInit(): void {
        this.initIsvisibleObservable();
        this.nullifySpinnerIfEntryComponentIsDefined();
        this.initFilters();
    }

    private initIsvisibleObservable(): void {
        const [showSpinner$, hideSpinner$] = partition(this.pendingRequestsInterceptor.pendingRequestsStatus$, h => h);

        this.isVisible$ = merge(
            this.pendingRequestsInterceptor.pendingRequestsStatus$
                .pipe(switchMap(() => showSpinner$.pipe(debounce(() => timer(this.debounceDelay))))),
            showSpinner$
                .pipe(switchMap(() => hideSpinner$.pipe(debounce(() => this.getVisibilityTimer$())))),
            this.spinnerVisibility.visibility$
        ).pipe(
            distinctUntilChanged(),
            tap(h => this.updateExpirationDelay(h))
        );
    }

    private nullifySpinnerIfEntryComponentIsDefined(): void {
        if (this.entryComponent) {
            this.spinner = null;
        }
    }

    private initFilters(): void {
        this.initFilteredUrlPatterns();
        this.initFilteredMethods();
        this.initFilteredHeaders();
    }

    private initFilteredUrlPatterns(): void {
        if (!!this.filteredUrlPatterns.length) {
            this.filteredUrlPatterns.forEach(e =>
                this.pendingRequestsInterceptor.filteredUrlPatterns.push(new RegExp(e))
            );
        }
    }

    private initFilteredMethods(): void {
        this.pendingRequestsInterceptor.filteredMethods = this.filteredMethods;
    }

    private initFilteredHeaders(): void {
        this.pendingRequestsInterceptor.filteredHeaders = this.filteredHeaders;
    }

    private updateExpirationDelay(showSpinner: boolean): void {
        if (showSpinner) {
            this.visibleUntil = Date.now() + this.minDuration;
        }
    }

    private getVisibilityTimer$(): Observable<number> {
        return timer(Math.max(this.extraDuration, this.visibleUntil - Date.now()));
    }
}
