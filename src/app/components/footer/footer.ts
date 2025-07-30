import { Component } from '@angular/core';
import { Image } from 'primeng/image';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [Image, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}
