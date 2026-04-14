import { Component } from '@angular/core';
import { SHELL_FOOTER_UI } from '../../../core/constants/ui/shell-ui.constant';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly footerUi = SHELL_FOOTER_UI;
}
