import { Component } from '@angular/core';
import { ContactCard } from '../../components/contact-card/contact-card';

@Component({
  selector: 'app-contact',
  imports: [ContactCard],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {}
