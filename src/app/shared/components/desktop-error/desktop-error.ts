import { Component, input } from '@angular/core';

@Component({
  selector: 'desktop-error',
  imports: [],
  templateUrl: './desktop-error.html',
})
export class DesktopError {
  errors = input.required<string>();
}
