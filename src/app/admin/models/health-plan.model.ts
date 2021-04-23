export interface ITire{
    tierId: number;
    tierName: string;
    status: boolean;
}
export interface IPlanAll{
    planID: number;
    clientId: string;
    contractId: number;
    userId: string;
    planCode: string;
    planName: string;
    clientName: string;
    tier1Aggfactamt: number;
    tier2Aggfactamt: number;
    tier3Aggfactamt: number;
    tier4Aggfactamt: number;
    familySpecificDeductible: number;
    status: number;
    isTerminalExtCoverage: string; // 'Y' or 'N'
    lstTblPlanTier: [
        {
            planId: number;
            tierId: number;
            tierAmount: number;
        }
    ]
}
export interface IPlanAdd{    
        planID: number;
        clientId: string;
        contractId:number;
        userId: string;
        planCode: string;
        planName: string;
        clientName: string;
        status: number;
        isTerminalExtCoverage: string;
        lstTblPlanTier: IPlanTierChild[];   
}
export interface IPlanTierChild{        
        planId: number;
        tierId: number;
        tierAmount: number;    
}
export interface IPlanUpdate{
    planID: number;
    clientId: string;
    contractId:number;
    userId: string;
    planCode: string;
    planName: string;
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