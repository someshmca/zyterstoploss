import { OnInit, Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[focusInp]'
})
export class FocusDirective implements OnInit {

  @Input('focusInp') isFocused: boolean = true;

    constructor(private hostElement: ElementRef, private renderer: Renderer2) { }

    ngOnInit() {
        if (this.isFocused) {
             this.hostElement.nativeElement.focus();

        }
    }
}
