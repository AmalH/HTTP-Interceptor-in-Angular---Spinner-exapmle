import { Component } from '@angular/core';
import { AbstractLoaderDirective } from '../abstract.loader.directive';

@Component({
    selector: 'sk-cube-grid',
    templateUrl: './sk-cube-grid.component.html',
    styleUrls: ['./sk-cube-grid.component.scss']
})
export class SkCubeGridComponent extends AbstractLoaderDirective {
}
