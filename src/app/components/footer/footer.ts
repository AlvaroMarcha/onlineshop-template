import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, PrimengModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}
