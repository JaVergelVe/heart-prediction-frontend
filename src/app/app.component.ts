import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DOCUMENT_TITLES } from './core/constants/document-titles.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly title = inject(Title);

  ngOnInit(): void {
    this.title.setTitle(DOCUMENT_TITLES.browserDefault);
  }
}
