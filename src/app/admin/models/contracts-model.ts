export interface IContract{
    contractId: number;
    clientId: string;
    startDate: string;
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
    ftn: string;
    ftnName: string;
    policyYear: number;
    description: string;
    exclusionIncurredStartDate:string;
    exclusionIncurredEndDate:string;
    exclusionPaidStartDate:string;
    exclusionPaidEndDate:string;
}

export interface IContractIDRequest{
    contractsId: string;
}


export interface IContractsByClient{
    contractId: number;
    clientId: string;
    startDate: string;
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
    ftn: string;
    ftnName: string;
    policyYear: number;
    description: string;
    exclusionIncurredStartDate:string;
    exclusionIncurredEndDate:string;
    exclusionPaidStartDate:string;
    exclusionPaidEndDate:string;
}

export interface IContractAdd{
    contractId: number;
    clientId:string;
    startDate: string;
    endDate: string;
    claimsAdministrator: string;
    pharmacyClaimsAdministrator: string;
    runInStartDate: string;
    runInEndDate: string;
    runOutStartDate: string;
    runOutEndDate: string;
    terminationDate: string;
    status: number;
    userId:string;
    ftn: string;
    ftnName: string;
    policyYear: number;
    description: string;
    exclusionIncurredStartDate:string;
    exclusionIncurredEndDate:string;
    exclusionPaidStartDate:string;
    exclusionPaidEndDate:string;
}

export interface IAddContractSuccess{
    id: number;
    message: string;
}

export interface IContractUpdate{
    contractId: number;
    clientId:string;
    startDate: string;
    endDate: string;
    claimsAdministrator: string;
    pharmacyClaimsAdministrator: string;
    runInStartDate: string;
    runInEndDate: string;
    runOutStartDate: string;
    runOutEndDate: string;
    terminationDate: string;
    status: number;
    userId:string;
    ftn: string;
    ftnName: string;
    policyYear: string;
    description: string;
    exclusionIncurredStartDate:string;
    exclusionIncurredEndDate:string;
    exclusionPaidStartDate:string;
    exclusionPaidEndDate:string;
}
export interface IActiveClient{
    clientId: string;
    clientName: string;
  }

export interface IUpdateContractSuccess{
    id: string;
    message: string;
}


export interface IContractAudit{
    contractid: number,
    status: null,
    userId: string,
    sysDate: Date,
    actionType: string
  }
  