import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, interval } from 'rxjs';


import { DayTimeModel } from 'src/app/models/dayTime.model';
import { IntervalModel } from 'src/app/models/interval.model';
import { UserModel } from 'src/app/models/user.model';
import { BarbersService } from 'src/app/services/barbers.service';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { ScheduleService } from 'src/app/services/schedule.service';
import { IconServiceService } from 'src/assets/icon-service.service';

@Component({
  selector: 'app-edit-day-time',
  templateUrl: './edit-day-time.component.html',
  styleUrls: ['./edit-day-time.component.css']
})
export class EditDayTimeComponent implements OnInit {

  selected?: Date;
  oldSelection?: Date;
  minDate?: Date | null = new Date();

  errors: Map<string, string> = new Map<string, string>();

  schedules: DayTimeModel[] = [];

  icons: Map<string, any> = new Map<string, any>();

  form = new FormGroup({
    scheduleToInsert: new FormControl(''),
    daytimestart: new FormControl(''),
    daytimeend: new FormControl(''),
    jumps: new FormControl('')
  })

  constructor(
    private daytimeService: ScheduleService,
    private iconsService: IconServiceService,
    private snackBar: MatSnackBar,
    private barbersService: BarbersService
  ) { }

  ngOnInit(): void {
    this.icons = this.iconsService.getIcons();
  }

  addToList() {
    if (this.selected == null || this.selected == undefined)
      return alert('Escolha um dia!');

    let timeToBeInserted = this.form.get("scheduleToInsert")?.value;

    if (String(timeToBeInserted).length <= 0)
      return alert('O horário não pode ser vazio!');

    if (this.schedules.filter(e => e.daytimepretty === timeToBeInserted).length > 0)
      return;


    //this.selected.setHours(this.selected.getHours() - 3);

    let dayTimeModel: DayTimeModel = {};
    dayTimeModel.daytimeday = this.selected.toISOString().split("T")[0];
    dayTimeModel.daytimestart = String(timeToBeInserted).split("-")[0];
    dayTimeModel.daytimeend = String(timeToBeInserted).split("-")[1];
    dayTimeModel.daytimepretty = timeToBeInserted;


    this.daytimeService.createSchedule([dayTimeModel])?.pipe(catchError(ErrorHandler.handleError)).subscribe((response) => {

      if (response instanceof Map) {
        return;
      }

      this.schedules.push(response[0]);

      this.schedules = this.schedules.sort((a, b) => a.daytimepretty!.localeCompare(b.daytimepretty!));

    });
  }

  deleteFromList(value: DayTimeModel) {
    if (this.selected == null || this.selected == undefined)
      return alert('Escolha um dia!');

    let op = confirm("Deseja deletar este horário?");

    if (!op)
      return;

    if (this.schedules.includes(value)) {
      const index: number = this.schedules.indexOf(value);
      if (index !== -1) {
        this.schedules.splice(index, 1);
        this.schedules.sort((a, b) => a.daytimepretty!.localeCompare(b.daytimepretty!));

        this.daytimeService.deleteDayTime(value)?.pipe(catchError(ErrorHandler.handleError)).subscribe((resp) => {
          if (resp instanceof Map) {
            return;
          }

          this.snackBar.open("Horário deletado ✅",
            "OK",
            { duration: 5000, panelClass: ['blue-snackbar'] }
          );

        });

      }
    }
  }


  editItemFromList(value: DayTimeModel) {
    let edit = "edit_";
    let span = document.getElementById(value.daytimepretty!);
    let input = document.getElementById(edit + value.daytimepretty) as HTMLInputElement;

    if (span !== null) {
      span.innerHTML = `<input type='text' value='${value.daytimepretty}' id='${edit + value.daytimepretty}' class='list-input' mask='00:00-00:00' autofocus>`;
    }
    if (input !== null) {

      //find the old value in the list
      let oldSchedule = this.schedules.find((schedule) => schedule === value);

      //if the list has the old value
      if (oldSchedule != null && oldSchedule !== undefined) {

        if (input.value !== null && input.value.length > 0) { // ensures the input is not empty          

          oldSchedule.daytimestart = String(input.value).split("-")[0] + ":00";
          oldSchedule.daytimeend = String(input.value).split("-")[1] + ":00";
          oldSchedule.daytimepretty = input.value;

          let index = this.schedules.indexOf(value); // gets the index of the old value

          if (index !== null && oldSchedule !== undefined) //if the old value was found and input was not empty
            this.schedules[index] = oldSchedule; //we update the list in that point

          this.daytimeService.updateSchedules(this.schedules[index])?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

            if (value instanceof Map) {
              return;
            }

            this.snackBar.open("Horário atualizado  ✅",
              "OK",
              { duration: 5000, panelClass: ['blue-snackbar'] }
            );


          })

          this.schedules.sort((a, b) => a.daytimepretty!.localeCompare(b.daytimepretty!));
        }
      }

      if (span != null)
        span.innerHTML = `<span id="${value.daytimepretty}">${value.daytimepretty}</span>`;
    }
  }


  getDayTime() {
    if (this.selected == null)
      return;

    if (this.oldSelection !== this.selected) {
      this.oldSelection = this.selected;

      this.daytimeService.getSchedules(this.selected)?.pipe(catchError(ErrorHandler.handleError)).subscribe((dayTimeList) => {

        if (dayTimeList instanceof Map) {
          this.schedules = [];
          return;
        }

        this.schedules = <DayTimeModel[]>dayTimeList;

        this.schedules = this.schedules.sort((a, b) => a.daytimepretty!.localeCompare(b.daytimepretty!));

      });
    }
  }

  addInterval() {

    if (this.selected == null || this.selected == undefined)
      return alert('Escolha um dia!');

    if (this.form.get('daytimestart')?.value == null || this.form.get('daytimestart')?.value == "")
      return alert('O horário de início não pode ser vazio!');

    if (this.form.get('daytimeend')?.value == null || this.form.get('daytimestart')?.value == "")
      return alert('O horário de fim não pode ser vazio!');

    if (this.form.get('jumps')?.value == null || this.form.get('daytimestart')?.value == "")
      return alert('O intervalo de saltos não pode ser vazio!');


    //this.selected.setHours(this.selected.getHours() - 3);

    let intervalModel: IntervalModel = {};
    intervalModel.daytimeday = this.selected.toISOString().split("T")[0];
    intervalModel.daytimestart = this.form.get('daytimestart')?.value;
    intervalModel.daytimeend = this.form.get('daytimeend')?.value;
    intervalModel.jumps = this.form.get('jumps')?.value;

    this.daytimeService.createScheduleFromInterval(intervalModel)?.pipe(catchError(ErrorHandler.handleError)).subscribe((dayTimeList) => {

      if (dayTimeList instanceof Map) {
        this.schedules = [];
        return;
      }

      let list = <DayTimeModel[]>dayTimeList;
      this.schedules = this.schedules.concat(list);

      this.schedules = this.schedules.sort((a, b) => a.daytimepretty!.localeCompare(b.daytimepretty!));

    });


  }

}
