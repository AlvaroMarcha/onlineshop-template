import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-card',
  imports: [FormsModule, PrimengModule, TranslateModule],
  templateUrl: './contact-card.html',
  styleUrl: './contact-card.css',
})
export class ContactCard {
  nameValue: string = '';
  emailValue: string = '';
  messageValue: string = '';
  topicValue: string = '';

  constructor(private router: Router) {}
}
