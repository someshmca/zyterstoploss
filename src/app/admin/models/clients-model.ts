export interface IClient{
  clientId: string;
  clientName: string;
  status: number;
  userId: string;
  startDate: string;
  endDate: string;
  parentID:string;
  claimsAdministrator: string;
  pharmacyClaimsAdministrator: string;
  subAccountid: string;
  subSubAccountid: string;
  ftn: string;
  ftnname: string;
  createdon: string;
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
  startDate: string;
  endDate: string;
  parentID:string;
  userId:string; 
  createdon: string;
  claimsAdministrator: string;
  pharmacyClaimsAdministrator: string;
  subAccountid: string;
  subSubAccountid: string;
  ftn: string;
  ftnname: string;
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
  claimsAdministrator: string;
  pharmacyClaimsAdministrator: string;
  subAccountid: string;
  subSubAccountid: string;
  ftn: string;
  ftnname: string;
  createdon: string;
 }

export interface IClientUpdateSuccess{
  clientID: string;
  message: string;
}
