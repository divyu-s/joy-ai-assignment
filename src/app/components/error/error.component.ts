import { Component, Input } from '@angular/core';
import { APP_CONSTANT, Error } from 'src/app/constants/app-constant';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  @Input() errors: Error[] = [];
  APP_CONSTANT = APP_CONSTANT;
}
