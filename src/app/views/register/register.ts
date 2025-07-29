import { Component } from '@angular/core';
import { RegisterCard } from '../../components/registerCard/registerCard';

@Component({
  selector: 'app-register',
  imports: [RegisterCard],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {}
