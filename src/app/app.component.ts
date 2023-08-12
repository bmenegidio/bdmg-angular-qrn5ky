import { Component, OnInit, VERSION } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AppService } from './app.service';
import { LocalStorageService } from './local-storage.service';
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
  cepResultError = false;
  formGroup: FormGroup;
  cepDataLocalStorageKey = '@cepData';

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private appService: AppService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.fetchCepData();
  }

  fetchCepData() {
    this.cepResult$ = this.appService.getCep(this.cep).pipe(
      tap((cepData) => this.updateForm(cepData)),
      catchError((err) => {
        this.cepResultError = true;
        return throwError(() => err);
      })
    );
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
    this.localStorageService.set<CepModel>(
      this.cepDataLocalStorageKey,
      this.formGroup.value
    );
    this.snackBar.open('✅ Os dados foram salvos com sucesso.');
  }

  loadFromLocalStorage() {
    const cepData: CepModel = this.localStorageService.get<CepModel>(
      this.cepDataLocalStorageKey
    );

    if (!cepData) {
      this.snackBar.open('ℹ️ Não existem dados no LocalStorage.');
      return;
    }

    this.updateForm(cepData);
    this.snackBar.open('✅ Os dados foram carregados com sucesso.');
  }
}
