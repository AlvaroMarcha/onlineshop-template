import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  imports: [PrimengModule, TranslateModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  visible: boolean = false;
}
