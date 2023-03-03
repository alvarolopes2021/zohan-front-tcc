import { Component, OnInit } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { UserService } from 'src/app/services/user.service';
import { IconServiceService } from 'src/assets/icon-service.service';
import { Constants } from 'src/constants';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.css']
})
export class ListClientsComponent implements OnInit {

  users: UserModel[] = [];

  usersCopy: UserModel[] = [];

  errors: Map<string, string> = new Map<string, string>();

  icons: Map<string, any> = new Map<string, any>();

  searchText: string = "";

  mode: ProgressSpinnerMode = 'indeterminate';
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private iconService: IconServiceService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.icons = this.iconService.getIcons();

    this.isLoading = true;

    this.userService.getAllUsers()?.
      pipe(catchError(ErrorHandler.handleError)).
      subscribe((users) => {
        if (users instanceof Map) {
          if (users.has(Constants.Errors.ERROR)) {
            this.errors.set(Constants.Errors.ERROR, users.get(Constants.Errors.ERROR) as string);
            this.users = [];
            this.isLoading = false;
            return;
          }
        }

        this.users = <UserModel[]>users;
        this.users.sort((a, b) => a.username!.localeCompare(b.username!));
        this.usersCopy = <UserModel[]>users;
        this.usersCopy.sort((a, b) => a.username!.localeCompare(b.username!));

        this.isLoading = false;

      });
  }

  search() {

    let input = document.getElementById('text') as HTMLInputElement;

    let name = input.value;

    if (this.usersCopy.length <= 0 || this.usersCopy == null)
      return;

    if (name == null || name == undefined || name.length <= 0) {
      this.users = this.usersCopy;
      this.searchText = "";
      return;
    }

    this.searchText = name;
    let users = this.usersCopy.filter((predicate) => predicate.username?.toLocaleLowerCase().includes(name.toLocaleLowerCase()));

    if (users == undefined) {
      this.users = [];
      return;
    }

    this.users = users;

  }

  deleteAccount(userId: string) {

    let op = confirm("Deseja deletar a conta? ⛔");

    if (!op)
      return;

    let user: UserModel = {};

    user.userid = userId;

    this.userService.deleteAccount(user)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

      if (value instanceof Map) {
        return;
      }

      let index = this.usersCopy.findIndex((predicate) => predicate.userid == userId);

      if (index == -1) {
        this.snackBar.open("Usuário não encontrado⛔",
          "OK",
          { duration: 5000, panelClass: ['blue-snackbar'] }
        );
        return;
      }

      this.usersCopy.splice(index, 1);
      this.search();

    });

  }

}
