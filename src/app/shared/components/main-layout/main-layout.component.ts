import { Component, ViewChild, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { APP_ROUTE_URLS } from '../../../core/constants/route-urls.constant';
import { MainNavLink, SHELL_MAIN_LAYOUT_UI, SHELL_MAIN_NAV_LINKS } from '../../../core/constants/ui/shell-ui.constant';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  @ViewChild('drawer') drawer?: MatSidenav;

  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly allNavLinks = SHELL_MAIN_NAV_LINKS;
  readonly layoutUi = SHELL_MAIN_LAYOUT_UI;

  /** Enlaces del menú según el estado de sesión (constantes + reglas de visibilidad). */
  get visibleNavLinks(): readonly MainNavLink[] {
    const authed = this.auth.isAuthenticated();
    return this.allNavLinks.filter((link) => {
      if (link.requiresAuth && !authed) {
        return false;
      }
      if (link.requiresGuest && authed) {
        return false;
      }
      return true;
    });
  }

  onMenuClick(): void {
    void this.drawer?.toggle();
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl(APP_ROUTE_URLS.authLogin, { replaceUrl: true });
  }
}
