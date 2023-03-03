import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/utils/util.service';
import { Constants } from 'src/constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {


  userInfo: Map<string, string> | null = new Map<string, string>();

  userModel: UserModel = {};

  willChangePassword: boolean = false;

  form: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    userPhone: new FormControl('', [Validators.required]),
    userEmail: new FormControl(''),
    oldPsw: new FormControl(''),
    newPsw: new FormControl(''),
    confirmNewPsw: new FormControl('')
  })

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
    this.userInfo = this.authService.getTokenInformation();

    if (this.userInfo != null && this.userInfo != undefined) {
      let userId = this.userInfo.get(Constants.Keys.SESSION_CLIENT_ID);

      if (userId != null && userId != undefined) {
        this.userService.getUserProfile(userId)?.pipe(catchError(ErrorHandler.handleError)).subscribe((user) => {

          if (user instanceof Map) {
            return;
          }
          this.userModel = <UserModel>user;
          this.userModel.userid = userId;

          let username = UtilService.getFromLocalStorage(Constants.Keys.USERNAME);

          if (username != null && username != undefined)
            this.form.setValue({
              userName: username,
              userPhone: this.userModel.userphone,
              userEmail: this.userModel.useremail,
              oldPsw: "",
              newPsw: "",
              confirmNewPsw: ""
            });

        });
      }
    }
  }

  updateProfile() {

    let formValues = this.form;

    if (formValues.get("userName")?.invalid)
      return alert("Nome ou apelido não pode ser vazio!");

    if (formValues.get("userPhone")?.invalid)
      return alert("Telefone não pode ser vazio!");

    this.userModel.userpsw = null;
    this.userModel.newpsw = null;

    if (this.willChangePassword) {
      if (String(formValues.get("oldPsw")?.value).length <= 0)
        return alert("A senha atual não pode ser vazia!");

      if (String(formValues.get("newPsw")?.value).length <= 0)
        return alert("A nova senha não pode ser vazia!");

      if (String(formValues.get("confirmNewPsw")?.value).length <= 0)
        return alert("Confirme sua nova senha digitando-a novamente!");
      else if (String(formValues.get("confirmNewPsw")?.value) !== String(formValues.get("newPsw")?.value))
        return alert("A nova senha e a confirmação não batem!");

      this.userModel.userpsw = String(formValues.get("oldPsw")?.value);
      this.userModel.newpsw = String(formValues.get("newPsw")?.value);
    }


    this.userModel.username = formValues.get("userName")?.value;
    this.userModel.userphone = formValues.get("userPhone")?.value;
    this.userModel.useremail = formValues.get("userEmail")?.value;

    this.userService.updateUserProfile(this.userModel)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

      if (value instanceof Map) {
        this.snackBar.open(`${value.get("ERROR")} ⛔`,
          "OK",
          { duration: 5000, panelClass: ['blue-snackbar'] }
        );
        return;
      }

      UtilService.setInLocalStorage(Constants.Keys.USERNAME, this.userModel.username!);

      this.snackBar.open("Perfil atualizado ✅",
        "OK",
        { duration: 5000, panelClass: ['blue-snackbar'] }
      );

      location.reload();

    });

  }

  deleteAccount() {
    let op = confirm("Deseja deletar a conta? ⛔");

    if (!op)
      return;

    this.userService.deleteAccount(this.userModel)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

      if (value instanceof Map) {
        return;
      }

      UtilService.removeFromLocalStorage(Constants.Auth.TOKEN);
      UtilService.removeFromLocalStorage(Constants.Keys.SESSION_CLIENT_ID);
      UtilService.removeFromLocalStorage(Constants.Keys.USERNAME);

      location.reload();

    });
  }

}
