import { Component, EventEmitter, Output } from '@angular/core';
import { SHELL_HEADER_UI } from '../../../core/constants/ui/shell-ui.constant';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter<void>();

  readonly headerUi = SHELL_HEADER_UI;
}
