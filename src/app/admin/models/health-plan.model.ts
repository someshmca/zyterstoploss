export interface ITire{
    tierId: number;
    tierName: string;
    status: number;
}
export interface ITierObj{ 
}
export interface IPlanAll{
    planID: number;
    clientId: string;
    contractId: number;
    userId: string;
    planCode: string;
    planName: string;
    contractYear: string;
    clientName: string;
    status: number;
    lstTblPlanTier: IPlanTierChild[]
}
export interface IPlanAdd{    
    planID: number;
    clientId: string;
    contractId: number;
    userId: string;
    planCode: string;
    planName: string;
    contractYear: string;
    //clientName: string;
    status: number;
    lstTblPlanTier: IPlanTierChild[];  
}
export interface IPlanTierChild{   
    planId: number;
    tierId: number;
    tierAmount: number;
    tierName: string;
    expectedClaimsRate: number;
    isTerminalExtCoverage: string;
    stopLossTierStartDate: Date;
    stopLossTierEndDate: Date;
    createdOn?: Date;
    userId?: string;
    updatedOn?: Date;
}
export interface IPlanUpdate{
    planID: number;
    clientId: string;
    contractId: number;
    userId: string;
    planCode: string;
    planName: string;
    contractYear: string;
    //clientName: string;
    status: number;
    lstTblPlanTier: IPlanTierChild[];  
}
export interface IActiveClient{
    clientId: string;
    clientName: string;
}

export interface IContracts{
    contractId: number;
    claimsAdministrator: string;
}