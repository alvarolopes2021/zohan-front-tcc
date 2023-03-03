import { HttpErrorResponse } from "@angular/common/http";
import { of } from "rxjs";
import { Constants } from "src/constants";

export class ErrorHandler {

    public static handleError(error: HttpErrorResponse) {

        let errors: Map<string, string> = new Map<string, string>();

        errors.set(Constants.Errors.ERROR, error.error );

        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            return of(errors);

        }
        else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            // Return an observable with a user-facing error message. 
            return of(errors);

        }

    }
}