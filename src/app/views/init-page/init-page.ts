import { Component, OnInit } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';
import { Button } from "primeng/button";
import { Card } from "primeng/card";
import { Divider } from "primeng/divider";

@Component({
  selector: 'app-init-page',
  imports: [TranslateModule, Button, Card, Divider],
  templateUrl: './init-page.html',
  styleUrl: './init-page.css',
  standalone: true,
})
export class InitPage implements OnInit {
  t!: Record<string, string>;
  constructor(private lang: LanguageService) {}

  async ngOnInit() {
    this.t = await this.lang.tMany([
      'home.banner.button1',
      'home.banner.button2',
    ]);
  }
}
