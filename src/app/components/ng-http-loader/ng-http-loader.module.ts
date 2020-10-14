import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SPINKIT_COMPONENTS } from 'src/app/models/spinkits';
import { NgHttpLoaderComponent } from './ng-http-loader.component';

@NgModule({
    declarations: [
        NgHttpLoaderComponent,
        ...SPINKIT_COMPONENTS,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        NgHttpLoaderComponent,
        ...SPINKIT_COMPONENTS,
    ]
})
export class NgHttpLoaderModule {
    public static forRoot(): ModuleWithProviders<NgHttpLoaderModule> {
        return {
            ngModule: NgHttpLoaderModule,
            providers: [
                PendingRequestsInterceptorProvider,
            ]
        };
    }
}
