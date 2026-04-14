import { Component } from '@angular/core';
import { HISTORY_PAGE_UI } from '../../../../core/constants/ui/history-ui.constant';

@Component({
  selector: 'app-history-home',
  templateUrl: './history-home.component.html',
  styleUrl: './history-home.component.scss'
})
export class HistoryHomeComponent {
  readonly ui = HISTORY_PAGE_UI;
}
