import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, Observable, of } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { BarbersService } from 'src/app/services/barbers.service';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { UserService } from 'src/app/services/user.service';
import { Constants } from 'src/constants';

@Component({
  selector: 'app-barber-detail',
  templateUrl: './barber-detail.component.html',
  styleUrls: ['./barber-detail.component.css']
})
export class BarberDetailComponent implements OnInit {

  form: FormGroup = new FormGroup({
    barberUsername: new FormControl('', [Validators.required]),
    barberPhone: new FormControl('', [Validators.required]),
    barberPsw: new FormControl(''),
    barberOldPsw: new FormControl(''),
    barberConfirmPsw: new FormControl(''),
  });


  constructor(
    private barberService: BarbersService,
    private userService: UserService
  ) { }

  @Input()
  barber: UserModel = {};

  ngOnInit(): void {
    this.form.setValue({
      barberUsername: this.barber.username,
      barberPhone: this.barber.userphone,
      barberPsw: "",
      barberOldPsw: "",
      barberConfirmPsw: ""
    });
  }


  public editBarber() : Observable<any> {
    if (this.form.get('barberUsername')?.invalid) {
      return of(alert('Dê um nome ao barbeiro'));
    }
    else if (this.form.get('barberPhone')?.invalid) {
      return of(alert('O barbeiro deve ter um número!'));
    }
    if (this.form.get('barberPsw')?.value != this.form.get('barberConfirmPsw')?.value)
      return of(alert('As senhas não batem!'));

    let userModel: UserModel = {};

    userModel.userid = this.barber.userid;
    userModel.username = this.form.get('barberUsername')?.value;
    userModel.userphone = this.form.get('barberPhone')?.value
    userModel.useremail = "";
    userModel.userpsw = this.form.get('barberOldPsw')?.value;
    userModel.newpsw = this.form.get('barberPsw')?.value;

    if (this.form.get('barberPsw')?.value == "" || this.form.get('barberPsw')?.value == null)
      userModel.newpsw = null;

    userModel.usertype = Constants.Roles.BARBER;

    return this.userService.updateUserProfile(userModel)!;
  }

}
