import { Injectable } from '@angular/core';
import {
  faFileSignature,
  faEnvelope,
  faPhone,
  faLock,
  faCheck,
  faHome,
  faPencil,
  faBook,
  faSignHanging,
  faLocationPin,
  faUser,
  faSignOut,
  faUpload,
  faList,
  faTrashCan,
  faScissors,
  faClock,
  faClockRotateLeft,
  faPeopleArrows,
  faBan,
  faHandScissors,
  faBars,
  faSearch,
  faUserCog,
  faUserClock,
  faArrowDown,
  faDollar
} from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconServiceService {

  constructor() { }

  getIcons(): Map<string, any> {
    const icons = new Map<string, any>();

    icons.set("faFileSignature", faFileSignature);
    icons.set("faEnvelope", faEnvelope);
    icons.set("faPhone", faPhone);
    icons.set("faLock", faLock);
    icons.set("faCheck", faCheck);
    icons.set("faHome", faHome);
    icons.set("faPencil", faPencil);
    icons.set("faBook", faBook);
    icons.set("faSign", faSignHanging);
    icons.set("faLocation", faLocationPin);
    icons.set("faUser", faUser);
    icons.set("faSignOut", faSignOut);
    icons.set("faUpload", faUpload);
    icons.set("faList", faList);
    icons.set("faDelete", faTrashCan);
    icons.set("faScissors", faScissors);
    icons.set("faClock", faClock);
    icons.set("faEditClock", faClockRotateLeft);
    icons.set("faPeople", faPeopleArrows);
    icons.set("faBan", faBan);
    icons.set("faHandScissors", faHandScissors);
    icons.set("faHamburger", faBars);
    icons.set("faSearch", faSearch);
    icons.set('faBarber', faUserCog);
    icons.set('faBarberClock', faUserClock);
    icons.set('faArrowDown', faArrowDown);
    icons.set('faMoney', faDollar);

    return icons;
  }
}

