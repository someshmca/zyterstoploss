export interface ITire{
    tierId: number;
    tierName: string;
    status: number;
}
export interface ITierObj{    
    factor1:number; 
    factor2:number; 
    factor3:number; 
    factor4:number;
    expectedClaims1:number;
    expectedClaims2:number;
    expectedClaims3:number;
    expectedClaims4:number;
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
    isTerminalExtCoverage: string;
    lstTblPlanTier: [
      {
        planId: number;
        tierId: number;
        tierAmount: number;
        expectedClaimsRate: number;
        createdOn: Date;
        userId: string;
        updatedOn: Date
      }
    ]
}
export interface IPlanAdd{    
    planID: number;
    clientId: string;
    contractId: number;
    userId: string;
    planCode: string;
    planName: string;
    contractYear: string;
    clientName: string;
    status: number;
    isTerminalExtCoverage: string;
    lstTblPlanTier: IPlanTierChild[];  
}
export interface IPlanTierChild{   
    planId: number;
    tierId: number;
    tierAmount: number;
    expectedClaimsRate: number;
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
    clientName: string;
    status: number;
    isTerminalExtCoverage: string;
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