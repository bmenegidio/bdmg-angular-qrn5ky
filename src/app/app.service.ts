import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs';

import { CepModel } from './models/cep-model';
import { ViaCepResponseModel } from './models/via-cep-response-model';

@Injectable()
export class AppService {
  constructor(private httpClient: HttpClient) {}

  private parseViaCepResponse(viaCepResponse: ViaCepResponseModel): CepModel {
    return {
      cep: viaCepResponse.cep,
      street: viaCepResponse.logradouro,
      complement: viaCepResponse.complemento,
      neighborhood: viaCepResponse.bairro,
      city: viaCepResponse.localidade,
      uf: viaCepResponse.uf,
      ibgeCode: viaCepResponse.ibge,
      gia: viaCepResponse.gia,
      ddd: viaCepResponse.ddd,
      siafi: viaCepResponse.siafi,
    };
  }

  getCep(cep: string) {
    return this.httpClient
      .get<ViaCepResponseModel>(`https://viacep.com.br/ws/${cep}/json/`)
      .pipe(
        map((viaCepResponse) => this.parseViaCepResponse(viaCepResponse)),
        take(1)
      );
  }
}
