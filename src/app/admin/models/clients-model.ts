export interface IClient{
  clientId: string;
  clientName: string;
  status: number;
  userId: string;
  startDate: string;
  endDate: string;
  parentID:string;
}
  

export interface IActiveClient{
  clientId: string;
  clientName: string;
}

export interface IParentClient{
  clientId:string;
  parentID:string;
  clientName: string;
  parentName:string
  
  
}

export interface IClientIDRequest{
    clientId: string;
}


export interface IClientAdd{
  clientID: string;
  clientName: string;
  status: number;
  startDate: Date;
  endDate: Date;
  parentID:string;
  userId:string; 
}

export interface IClientAddSuccess{
  clientID: string;
  message: string;
}

export interface IClientUpdate{
  clientID: string;
  clientName: string;
  status: number;
  startDate: Date;
  endDate: Date;
  parentID:string;
  userId:string;
 }

export interface IClientUpdateSuccess{
  clientID: string;
  message: string;
}
