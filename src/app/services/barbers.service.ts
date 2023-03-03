import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/constants';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class BarbersService {

  constructor(
    private http: HttpClient
  ) { }


  getAllBarbers() : Observable<any> | null{
    return this.http.get(Constants.HttpEndpoints.Barbers.GET_ALL_BARBERS);
  }

  deleteBarber(barberId: string): Observable<any> | null{
    return this.http.delete(Constants.HttpEndpoints.Barbers.DELETE_BARBER + barberId);
  }

  editBarber(barber: UserModel) : Observable<any> | null{
    return this.http.put(Constants.HttpEndpoints.Barbers.EDIT_BARBER, barber);
  }
}
