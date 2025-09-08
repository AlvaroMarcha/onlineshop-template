import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderBack } from '../../../components/private/header-back/header-back';
import { FooterBack } from '../../../components/private/footer-back/footer-back';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderBack, FooterBack, RouterOutlet],
  templateUrl: './dashboard.html',
})
export class Dashboard {}
