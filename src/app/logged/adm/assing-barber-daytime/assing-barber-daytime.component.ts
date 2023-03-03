import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { BarberTimeModel } from 'src/app/models/barberTime.model';
import { DayTimeModel } from 'src/app/models/dayTime.model';
import { UserModel } from 'src/app/models/user.model';
import { BarberTimeService } from 'src/app/services/barber-time.service';
import { BarbersService } from 'src/app/services/barbers.service';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { ScheduleService } from 'src/app/services/schedule.service';
import { IconServiceService } from 'src/assets/icon-service.service';

@Component({
  selector: 'app-assing-barber-daytime',
  templateUrl: './assing-barber-daytime.component.html',
  styleUrls: ['./assing-barber-daytime.component.css']
})
export class AssingBarberDaytimeComponent implements OnInit {


  selected?: Date;
  oldSelection?: Date;
  minDate?: Date | null = new Date();

  errors: Map<string, string> = new Map<string, string>();

  schedules: DayTimeModel[] = [];
  selectedDayTime: DayTimeModel[] = [];
  barbers: UserModel[] = [];

  icons: Map<string, any> = new Map<string, any>();

  form = new FormGroup({
    barber: new FormControl('', [Validators.required])
  })

  constructor(
    private daytimeService: ScheduleService,
    private iconsService: IconServiceService,
    private snackBar: MatSnackBar,
    private barbersService: BarbersService,
    private barberTimeService: BarberTimeService) { }

  ngOnInit(): void {
    this.icons = this.iconsService.getIcons();
    this.barbersService.getAllBarbers()?.pipe(catchError(ErrorHandler.handleError)).subscribe((barbers) => {
      if (barbers instanceof Map) {
        return;
      }

      this.barbers = <UserModel[]>barbers;

    });
  }

  change() {
    if (this.selected == null || this.selected == undefined)
      return alert('Escolha um dia!');

    this.selectedDayTime = [];

    for (let i = 0; i < this.schedules.length; i++)
      this.schedules[i].checked = false;

    this.daytimeService.getAssignedDayTime(this.selected, this.form.get('barber')?.value).pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

      if (value instanceof Map) {
        return;
      }

      this.selectedDayTime = <DayTimeModel[]>value;

      this.selectedDayTime.forEach((daytime) => {
        this.schedules[this.schedules.findIndex((predicate) => predicate.daytimeid == daytime.daytimeid)].checked = true;
      });

    });
  }

  onCheckboxChange(event: any, daytime: DayTimeModel) {
    if (this.selected == null || this.selected == undefined)
      return alert('Escolha um dia!');

    if (this.form.get('barber')?.invalid)
      return alert('Escolha um barbeiro!');

    this.selectedDayTime = [];

    if (event.target.checked) {
      let barbertimeModel: BarberTimeModel = {};

      barbertimeModel.barbertime_userid = this.form.get('barber')?.value;
      barbertimeModel.barbertime_daytimeid_list = [];

      this.selectedDayTime.push(daytime);

      this.schedules[this.schedules.indexOf(daytime)].checked = true;

      this.selectedDayTime.forEach((element) => {
        barbertimeModel.barbertime_daytimeid_list!.push(element.daytimeid!);
      });

      this.barberTimeService.assignBarberToTime(barbertimeModel)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {
        if (value instanceof Map) {
          return;
        }
      });

    }
    else {
      let barbertimeModel: BarberTimeModel = {};

      barbertimeModel.barbertime_userid = this.form.get('barber')?.value;
      barbertimeModel.barbertime_daytimeid = daytime.daytimeid;

      this.schedules[this.schedules.indexOf(daytime)].checked = false;

      this.barberTimeService.removeAssignmentToTime(barbertimeModel)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {
        if (value instanceof Map) {
          return;
        }

        const index = this.selectedDayTime.findIndex(x => x.daytimeid === daytime.daytimeid);
        if (index != -1)
          this.selectedDayTime.splice(index, 1);

      });
    }

  }

  getDayTime() {
    if (this.selected == null || this.selected == undefined)
      return alert('Escolha um dia');

    this.selectedDayTime = [];
    this.schedules = [];

    this.daytimeService.getSchedules(this.selected)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

      if (value instanceof Map) {
        return;
      }

      this.schedules = <DayTimeModel[]>value;

      this.schedules = this.schedules.sort((a, b) => a.daytimepretty!.localeCompare(b.daytimepretty!));

      if (this.form.get('barber')?.valid)
        this.change();

    });

  }

  assignAll() {
    if (this.selected == null || this.selected == undefined)
      return alert('Escolha um dia');

    if (this.schedules.length <= 0)
      return alert('Não há horários para atribuir!');

    if (this.form.get('barber')?.invalid)
      return alert('Escolha um barbeiro');

    let barbertimeModel: BarberTimeModel = {};

    barbertimeModel.barbertime_userid = this.form.get('barber')?.value;
    barbertimeModel.barbertime_daytimeid_list = [];

    for(let i=0; i< this.schedules.length; i++){

      if(!this.schedules[i].checked){
        this.schedules[i].checked = true;
        barbertimeModel.barbertime_daytimeid_list!.push(this.schedules[i].daytimeid!);
      }
      
    }

    this.barberTimeService.assignBarberToTime(barbertimeModel)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {
      if (value instanceof Map) {
        for(let i=0; i< this.schedules.length; i++){
          this.schedules[i].checked = false;          
        }
        return;
      }

      this.change();

    });

  }

  // receives a daytime from the running list in HTML and checks if the barber is assigned to it
  checked(schedule: DayTimeModel) {
    return this.selectedDayTime.some(x => x.daytimeid == schedule.daytimeid);
  }

}
