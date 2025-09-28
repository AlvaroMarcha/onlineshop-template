import { Component } from '@angular/core';
import { PrimengModule } from '../../shared/primeng/primeng-module';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, PrimengModule, TranslateModule],
  templateUrl: './footer.html',
})
export class Footer {}
