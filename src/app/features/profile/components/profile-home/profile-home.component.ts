import { Component } from '@angular/core';
import { PROFILE_PAGE_UI } from '../../../../core/constants/ui/profile-ui.constant';

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
  styleUrl: './profile-home.component.scss'
})
export class ProfileHomeComponent {
  readonly ui = PROFILE_PAGE_UI;
}
