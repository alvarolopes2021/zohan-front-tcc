import { Component, OnInit } from '@angular/core';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, } from '@angular/material/core';
import { DateRange, DefaultMatCalendarRangeStrategy, MatRangeDateSelectionModel, MAT_DATE_RANGE_SELECTION_STRATEGY, MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { Moment } from 'moment';
import { RevenueService } from 'src/app/services/revenue.service';
import { catchError } from 'rxjs';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { RevenueModel } from 'src/app/models/revenue.model';
import { FormControl, FormGroup } from '@angular/forms';
import { BarbersService } from 'src/app/services/barbers.service';
import { UserModel } from 'src/app/models/user.model';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy
    },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { strict: true } },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS, },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE], },

    DefaultMatCalendarRangeStrategy,
    MatRangeDateSelectionModel
  ]
})
export class RevenueComponent implements OnInit {

  selected?: DateRange<Moment>;

  range: Date[] = [];

  isLoading: boolean = false;
  mode: ProgressSpinnerMode = 'indeterminate';

  manDate: Date = new Date();

  comparisonStart?: Date | null;
  comparisonEnd?: Date | null;

  revenueModel?: RevenueModel;

  barbersList: UserModel[] = [];

  errors: Map<string, string> = new Map<string, string>();

  form: FormGroup = new FormGroup({
    barber: new FormControl('')
  });

  constructor(
    private readonly selectionModel: MatRangeDateSelectionModel<Date>,
    private readonly selectionStrategy: DefaultMatCalendarRangeStrategy<Date>,
    private adapter: DateAdapter<any>,
    private revenueService: RevenueService,
    private barberService: BarbersService,
    private snackBar: MatSnackBar
  ) {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 7);
    this.selected = new DateRange(moment(fiveDaysAgo), moment(new Date()));
  }

  ngOnInit(): void {
    this.barberService.getAllBarbers()?.pipe(catchError(ErrorHandler.handleError)).subscribe(value => {
      if (value instanceof Map) {
        return;
      }
      this.barbersList = <UserModel[]>value;
    })
  }

  selectedChange(selectedDate: Date) {
    this.range.push(selectedDate);

    if (this.range.length == 2) {
      if (this.range[0] > this.range[1]) {
        this.range = this.range.reverse();
      }
      this.selected = new DateRange(moment(this.range[0]), moment(this.range[1]));
      return;
    }
    else if (this.range.length == 3) {
      this.range = [];
      this.range.push(selectedDate);
    }

  }

  consult() {
    if (this.selected == null)
      return alert('Escolha pelo menos uma data!');

    if (this.range.length == 1)
      this.selected = new DateRange(moment(this.range[0]), moment(this.range[0]));

    this.isLoading = true;

    this.revenueService.consult(this.selected, this.form.get('barber')?.value).pipe(catchError(ErrorHandler.handleError)).subscribe(value => {

      if (value instanceof Map) {
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
      this.revenueModel = <RevenueModel>value;

    });
  }

}
