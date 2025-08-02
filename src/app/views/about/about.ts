import { Component } from '@angular/core';
import { Card } from "primeng/card";
import { Button } from "primeng/button";
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';   

@Component({
  selector: 'app-about',
  imports: [Card, Button, TranslateModule, CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
team = [
  { name: 'Lorem', role: 'Dolor' },
  { name: 'Ipsum', role: 'Sit' },
  { name: 'Saxa', role: 'Amet' }
];
}
