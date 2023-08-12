import { Component, OnInit, VERSION } from '@angular/core';
import { Observable } from 'rxjs';

import { AppService } from './app.service';
import { CepModel } from './models/cep-model';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  cep = '30160907';
  cepResult$: Observable<CepModel>;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.cepResult$ = this.appService.getCep(this.cep);
  }
}
