import {Injectable} from '@angular/core';
import {Response} from "@angular/http";
import {HttpService} from "../providers/HttpService";

@Injectable()
export class CommonService {
  constructor(public httpService: HttpService) {
  }

  postRegPatient(data) {
    return this.httpService.post('regPatient', data).map((res: Response) => res.json());
  }
}
