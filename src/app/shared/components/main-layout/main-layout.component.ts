import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SHELL_MAIN_NAV_LINKS } from '../../../core/constants/ui/shell-ui.constant';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  @ViewChild('drawer') drawer?: MatSidenav;

  readonly mainNavLinks = SHELL_MAIN_NAV_LINKS;

  onMenuClick(): void {
    void this.drawer?.toggle();
  }
}
