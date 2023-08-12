import { Component, OnInit, VERSION } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  formGroup: FormGroup;
  cepDataLocalStorageKey = '@cepData';

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.initForm();
    this.cepResult$ = this.appService
      .getCep(this.cep)
      .pipe(tap((cepData) => this.updateForm(cepData)));
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      cep: [''],
      street: [''],
      complement: [''],
      neighborhood: [''],
      city: [''],
      uf: [''],
      ibgeCode: [{ value: '', disabled: true }],
      gia: [''],
      ddd: [''],
      siafi: [{ value: '', disabled: true }],
    });
  }

  updateForm(cepData: CepModel) {
    Object.keys(cepData).map((formKey) => {
      this.formGroup.patchValue({
        [formKey]: cepData[formKey],
      });
    });
  }

  saveToLocalStorage() {
    localStorage.setItem(
      this.cepDataLocalStorageKey,
      JSON.stringify(this.formGroup.value)
    );
    this.snackBar.open('✅ Os dados foram salvos com sucesso.', '', {});
  }

  loadFromLocalStorage() {
    const cepData: CepModel = JSON.parse(
      localStorage.getItem(this.cepDataLocalStorageKey)
    );

    if (!cepData) {
      this.snackBar.open('ℹ️ Não existem dados no LocalStorage.');
      return;
    }

    this.updateForm(cepData);
  }
}
