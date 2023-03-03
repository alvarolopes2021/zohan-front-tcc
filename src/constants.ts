export class Constants {

    static HttpEndpoints = class {

        static Login = class {

            static IP: string = "https://zohan-tcc-backend.onrender.com/";
            //static IP: string = "http://localhost:3000/";
            /*static IP: string = "http://192.168.0.7:3000/";*/

            static LOGIN: string = this.IP + "auth/login";

            static SIGN_UP: string = this.IP + "auth/signup";
        }

        static Schedules = class {

            static IP: string = "https://zohan-tcc-backend.onrender.com/";
            //static IP: string = "http://localhost:3000/";
            /*static IP: string = "http://192.168.0.7:3000/";*/
            static CREATE_SCHEDULE: string = this.IP + "schedule/create-schedule";
            static CREATE_SCHEDULE_FROM_INTERVAL: string = this.IP + "schedule/create-schedule-from-interval";
            static GET_SCHEDULES: string = this.IP + "schedule/get-schedules";
            static UPDATE_SCHEDULES: string = this.IP + "schedule/update-schedules";
            static DELETE_DAYTIME: string = this.IP + "schedule/delete-dayTime";
            static GET_AVAILABLE_DAYTIME: string = this.IP + "schedule/get-available-dayTime";
            static GET_AVAILABLE_DAYTIME_USES_MORE_TIME: string = this.IP + "schedule/get-available-dayTime-uses-more-time";
            static GET_ASSIGNED_DAY_TIME: string = this.IP + "schedule/get-assigned-daytime";
        }

        static Users = class {
            static IP: string = "https://zohan-tcc-backend.onrender.com/";
            //static IP: string = "http://localhost:3000/";
            /*static IP: string = "http://192.168.0.7:3000/";*/
            static GET_ALL_USERS: string = this.IP + "user/get-all-users";
            static USER_PROFILE: string = this.IP + "user/user-profile";
            static UPDATE_USER_PROFILE: string = this.IP + "user/update-user-profile";
            static DELETE_ACCOUNT: string = this.IP + "user/delete-account";
            static ADD_NOTIFICATION_SUBSCRIPTION: string = this.IP + "user/add-notification-subscription";
        }

        static Ads = class {
            static IP: string = "https://zohan-tcc-backend.onrender.com/";
            //static IP: string = "http://localhost:3000/";
            /*static IP: string = "http://192.168.0.7:3000/";*/
            static CREATE_AD: string = this.IP + "ads/insert-ad";
            static GET_ADD: string = this.IP + "ads/get-ads";
        }

        static Services = class {
            static IP: string = "https://zohan-tcc-backend.onrender.com/";
            //static IP: string = "http://localhost:3000/";
            /*static IP: string = "http://192.168.0.7:3000/";*/
            static ADD_SERVICES = this.IP + "services/add-services";
            static GET_SERVICES = this.IP + "services/get-services";
            static DELETE_SERVICES = this.IP + "services/delete-services";
            static UPDATE_SERVICES = this.IP + "services/update-services";
        }

        static Orders = class {
            static IP: string = "https://zohan-tcc-backend.onrender.com/";
            //static IP: string = "http://localhost:3000/";
            /*static IP: string = "http://192.168.0.7:3000/";*/
            static CRAETE_ORDER = this.IP + "orders/create-order";
            static GET_ORDER_BY_USER_ID = this.IP + "orders/get-orders-by-user-id";
            static GET_ALL_ORDERS = this.IP + "orders/get-all-orders";
            static GET_NEXT_ORDERS = this.IP + "orders/get-next-orders";
            static GET_NEXT_ORDERS_BY_BARBER_ID = this.IP + "orders/get-next-orders-by-barber-id";
            static GET_ORDERS_BY_BARBER_ID = this.IP + "orders/get-orders-by-barber-id";
            static MARK_ABSENT = this.IP + "orders/mark-absent";
            static CANCEL_ORDER = this.IP + "orders/cancel-order";
        }

        static Barbers = class {
            static IP: string = "https://zohan-tcc-backend.onrender.com/";
            //static IP: string = "http://localhost:3000/";
            /*static IP: string = "http://192.168.0.7:3000/";*/
            static GET_ALL_BARBERS = this.IP + "barbers/get-all-barbers";
            static DELETE_BARBER = this.IP + "barbers/delete-barber/";
            static EDIT_BARBER = this.IP + "barbers/edit-barber";
        }

        static BarberTime = class {
            static IP: string = "https://zohan-tcc-backend.onrender.com/";
            //static IP: string = "http://localhost:3000/";
            /*static IP: string = "http://192.168.0.7:3000/";*/
            static ASSIGN_BARBER_TIME = this.IP + "barber-time/assign-barber-time";
            static ASSIGN_LIST_TO_BARBER_TIME = this.IP + "barber-time/assign-list-to-barber-time";
            static REMOVE_ASSIGNMET_TO_TIME = this.IP + "barber-time/remove-assignment";
        }

        static Revenue = class {
            static IP: string = "https://zohan-tcc-backend.onrender.com/";
            //static IP: string = "http://localhost:3000/";
            static GET_REVENUE = this.IP + "revenue/get-revenue";
        }

    }

    static HttpResponseTags = class {
        static CONTENT: string = "CONTENT";
        static AUTH: string = "AUTH";
    }

    static Errors = class {
        static ERROR = "ERROR";

        static USERNAME_EMPTY = 'USERNAME_EMPTY';

        static USER_PHONE_EMPTY = 'USER_PHONE_EMPTY';

        static PASSWORD_EMPTY = 'PASSWORD_EMPTY';

        static PHONE_EXISTS = 'PHONE_EXISTS';

        static PASSWORD_DONT_MATCH = 'PASSWORD_DONT_MATCH';

        static ERR_BLOCKED_BY_CLIENT = "ERR_BLOCKED_BY_CLIENT";

    }

    static Auth = class {
        static TOKEN = "TOKEN";
        static EXPIRES_IN = "EXPIRES_IN";
    }

    static Roles = class {
        static USER = "USER";
        static ADMIN = "ADMIN";
        static BARBER = "BARBER";
    }

    static Keys = class {
        static USERNAME: string = "USERNAME";
        static ROLE: string = "ROLE";
        static DATE: string = "DATE";
        static SCHEDULE_LIST: string = "SCHEDULE_LIST";
        static USER_PHONE: string = "USER_PHONE";
        static SESSION_CLIENT_ID: string = "SESSION_CLIENT_ID";
        static BARBERTIME_USERID: string = "BARBERTIME_USERID";
        static BARBERTIME_DAYTIMEID: string = "BARBERTIME_DAYTIMEID";
        static DAY_TIME: string = "DAY_TIME";
        static SERVICE_ID: string = "SERVICE_ID";
        static ORDER_ID: string = "ORDER_ID";
        static HAS_SUBSCRIBED_TO_RECEIVE_PUSH = "HAS_SUBSCRIBED_TO_RECEIVE_PUSH";        
        static REVENUE_PARAMS: string = "REVENUE_PARAMS";
    }

}
