import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpInterceptorInterceptor } from './http-interceptor.interceptor';

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorInterceptor, multi: true },
];