export interface IContract{
    contractsId: string;
    contractEffectiveDate: Date;
    contractEndDate: Date;
    contractStatus: string;
    contractType: string;
    description: string;
    maxAllowedPeriod: number;
    createid: string;
    createdOn: Date;
    updateid: string;
    lastupdate: Date;
}

export interface IContractIDRequest{
    contractsId: string;
}



export interface IContractAdd{
    contractsId: string;
    contractEffectiveDate: Date;
    contractEndDate: Date;
    contractStatus: string;
    contractType: string;
    description: string;
    maxAllowedPeriod: number;
    createid: string;
    createdOn: Date;
    updateid: string;
    lastupdate: Date;
}

export interface IAddContractSuccess{
    id: string;
    message: string;
}

export interface IContractUpdate{
    contractsId: string;
    contractEffectiveDate: Date;
    contractEndDate: Date;
    contractStatus: string;
    contractType: string;
    description: string;
    maxAllowedPeriod: number;
    createid: string;
    createdOn: Date;
    updateid: string;
    lastupdate: Date;
}

export interface IUpdateContractSuccess{
    id: string;
    message: string;
}

