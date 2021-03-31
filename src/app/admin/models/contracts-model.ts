export interface IContract{
    clientId:string;
    contractId: number;
    effectiveDate: Date;
    endDate: Date;
    clientName:string;
   userId:string;
}

export interface IContractIDRequest{
    contractsId: string;
}


export interface IContractsByClient{
    contractId: number;
    clientId: string;
    effectiveDate: string;
    endDate: string;
    claimsAdministrator: string;
    pharmacyClaimsAdministrator: string;
    runInStartDate: string;
    runInEndDate: string;
    runOutStartDate: string;
    runOutEndDate: string;
    terminationDate: string;
    status: number;
    userId: string;
    clientName: string;
}

export interface IContractAdd{
    contractId: number;
    clientId:string;
    effectiveDate: Date;
    endDate: Date;
    claimsAdministrator: string;
    pharmacyClaimsAdministrator: string;
    runInStartDate: Date;
    runInEndDate: Date;
    runOutStartDate: Date;
    runOutEndDate: Date;
    terminationDate: Date;
    status: number;
    userId:string;
}

export interface IAddContractSuccess{
    id: string;
    message: string;
}

export interface IContractUpdate{
    contractId: number;
    clientId:string;
    effectiveDate: Date;
    endDate: Date;
    claimsAdministrator: string;
    pharmacyClaimsAdministrator: string;
    runInStartDate: Date;
    runInEndDate: Date;
    runOutStartDate: Date;
    runOutEndDate: Date;
    terminationDate: Date;
    status: number;
    userId:string;
}
export interface IActiveClient{
    clientId: string;
    clientName: string;
  }

export interface IUpdateContractSuccess{
    id: string;
    message: string;
}

