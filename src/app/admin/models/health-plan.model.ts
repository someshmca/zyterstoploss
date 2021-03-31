export interface IPlanTires{
    tierId: number;
    tierName: string;
    status: boolean;
}
export interface IPlanAll{
    planID: number;
    clientId: string;
    contractId: number;
    userID: string;
    planCode: string;
    planName: string;
    clientName: string;
    tier1Aggfactamt: number;
    tier2Aggfactamt: number;
    tier3Aggfactamt: number;
    tier4Aggfactamt: number;
    familySpecificDeductible: number;
    status: number;
    isTerminalExtCoverage: string;
}
export interface IPlanAdd{
    planId: number;
    planCode: string;
    userId: string;
    planName: string;
    clientId: string;
    contractId: number;
    tier1Aggfactamt: number;
    tier2Aggfactamt: number;
    tier3Aggfactamt: number;
    tier4Aggfactamt: number;
    familySpecificDeductible: number;
    status: number;
    isTerminalExtCoverage: string;
}
export interface IPlanUpdate{
    planId: number;
    planCode: string;
    userId: string;
    planName: string;
    clientId: string;
    contractId: number;
    tier1Aggfactamt: number;
    tier2Aggfactamt: number;
    tier3Aggfactamt: number;
    tier4Aggfactamt: number;
    familySpecificDeductible: number;
    status: number;
    isTerminalExtCoverage: string
}
export interface IActiveClient{
    clientId: string;
    clientName: string;
}

export interface IContracts{
    contractId: number;
    claimsAdministrator: string;
}