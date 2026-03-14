import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MButton } from '../marcha/m-button/m-button';
import { MDrawer } from '../marcha/m-drawer/m-drawer';
import { MInput } from '../marcha/m-input/m-input';

@Component({
  selector: 'app-search',
  imports: [TranslateModule, FormsModule, MButton, MDrawer, MInput],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  visible: boolean = false;
  searchText: string = '';
}
