export interface OrdersModel {
    orderid?: string;

    order_userid? : string;
    order_username? : string;
    order_userphone? : string;
        
    order_barbertimeid? : string;

    order_barbername? : string;

    order_daytimeid? : string;
    order_daytimeday? : string;
    order_daytimestart? : string;
    order_daytimeend? : string;
    order_daytimepretty? : string;

    order_serviceid? : string;
    order_servicedescription? : string;
    order_servicevalue? : string;

    order_willusemoretime? : boolean;

    barberid? : string;
    
    isabsent?: boolean;
    
    orderdate?:  Date;   
    
    canCancelOrder?: boolean;
}

/*
export interface OrderBindingModel {
    orderid??: string;
    daytimeday??: string;
    daytimestart??: string;
    daytimepretty??: string;
    username??: string;
    barbername??: string;
    order_userphone??: string;
    order_servicedescription??: string;

    order_barbertimeid??: string;

    order_servicevalue??: string;
    canCancelOrder??: boolean;
}
*/