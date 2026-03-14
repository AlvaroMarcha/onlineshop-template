import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MCard } from '../marcha/m-card/m-card';
import { MInput } from '../marcha/m-input/m-input';
import { MTextarea } from '../marcha/m-textarea/m-textarea';
import { MButton } from '../marcha/m-button/m-button';

@Component({
  selector: 'app-contact-card',
  imports: [FormsModule, TranslateModule, MCard, MInput, MTextarea, MButton],
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
