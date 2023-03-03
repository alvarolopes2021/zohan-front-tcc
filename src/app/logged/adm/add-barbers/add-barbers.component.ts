import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';

import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { BarbersService } from 'src/app/services/barbers.service';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { UserService } from 'src/app/services/user.service';
import { IconServiceService } from 'src/assets/icon-service.service';
import { Constants } from 'src/constants';
import { BarberDetailComponent } from '../barber-detail/barber-detail.component';

@Component({
  selector: 'app-add-barbers',
  templateUrl: './add-barbers.component.html',
  styleUrls: ['./add-barbers.component.css']
})

export class AddBarbersComponent implements OnInit {

  @ViewChildren(BarberDetailComponent) children: QueryList<BarberDetailComponent> | undefined;

  icons: Map<string, any> = new Map<string, any>();

  readonly CONSTANTS = Constants;
  errors: Map<string, string> = new Map<string, string>();

  barbers: UserModel[] = [];

  form: FormGroup = new FormGroup({
    barberName: new FormControl('', [Validators.required]),
    barberPhone: new FormControl('', [Validators.required]),
    barberPsw: new FormControl('', [Validators.required]),
    confirmBarberPsw: new FormControl('', [Validators.required]),
  });

  constructor(
    private iconService: IconServiceService,
    private userService: UserService,
    private authService: AuthService,
    private barbersService: BarbersService,
    private snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
    this.icons = this.iconService.getIcons();
    this.barbersService.getAllBarbers()?.pipe(catchError(ErrorHandler.handleError)).subscribe((barbers) => {

      if (barbers instanceof Map) {
        return;
      }

      this.barbers = <UserModel[]>barbers;
    });
  }

  addBarber() {
    if (this.form.get('barberName')?.invalid)
      return alert('Dê um nome ao barbeiro');
    else if (this.form.get('barberPhone')?.invalid)
      return alert('O barbeiro deve ter um número!')
    else if (this.form.get('barberPsw')?.invalid)
      return alert('A senha não pode ser vazia!');
    else if (this.form.get('confirmBarberPsw')?.invalid)
      return alert('Você deve confirmar a senha!')

    if (this.form.get('barberPsw')?.value != this.form.get('confirmBarberPsw')?.value)
      return alert('As senhas não batem!')

    let userModel: UserModel = {};

    userModel.username = this.form.get('barberName')?.value;
    userModel.userphone = this.form.get('barberPhone')?.value
    userModel.userpsw = this.form.get('barberPsw')?.value
    userModel.usertype = Constants.Roles.BARBER;

    this.authService.signup(userModel)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

      if (value instanceof Map) {
        return;
      }

      this.snackBar.open("Barbeiro cadastrado com sucesso ✅",
        "OK",
        { duration: 5000, panelClass: ['blue-snackbar'] }
      );

      this.barbers.push(userModel);

    });
  }

  editBarbers(item: UserModel): void {

    let element = document.getElementById(item.userid!) as HTMLDivElement;

    if (element == null || element == undefined)
      return;

    if (element.className == 'display-block') {

      element.className = "hold-barber-detail";

      let barberDetailReference = this.children?.find((value) => value.barber.userid == item.userid);

      if (barberDetailReference != null && barberDetailReference != undefined) {
        
        barberDetailReference.editBarber().pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

          if (value instanceof Map) {
            this.snackBar.open(`${value.get("ERROR")} ⛔`,
              "OK",
              { duration: 5000, panelClass: ['blue-snackbar'] }
            );
            return;
          }

          let index = this.barbers.indexOf(item);

          if (index != -1) {
            this.barbers[index].username = value.username;
          }

          this.snackBar.open("Barbeiro editado com sucesso ✅",
            "OK",
            { duration: 5000, panelClass: ['blue-snackbar'] }
          );

          return;

        });
      }

      return;
    }

    element.className = "display-block";
  }

  deleteBarber(item: UserModel) {

    let op = confirm("Deseja deletar este barbeiro? ⛔");

    if (!op)
      return;

    this.barbersService.deleteBarber(item.userid!)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

      if (value instanceof Map) {
        return;
      }

      this.snackBar.open("Barbeiro removido com sucesso ✅",
        "OK",
        { duration: 5000, panelClass: ['blue-snackbar'] }
      );

      this.barbers.splice(this.barbers.indexOf(item), 1);

    });
  }


}
