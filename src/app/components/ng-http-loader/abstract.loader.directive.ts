import { Input, Directive } from '@angular/core';

@Directive()
export abstract class AbstractLoaderDirective {

    @Input() public backgroundColor!: string;
}
