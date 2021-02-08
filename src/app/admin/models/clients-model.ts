export interface IClient{
    clientId: string ;
    clientName: string;
    contractId: string;
    description: string;
    isActive: boolean;
    createdId: string;
    createdBy: Date;
    updatedId: string;
    lastUpdate: Date;
    deductible: number;
    individualDeductible: number;    
    start: Date;
    end: Date;
    asl: string;
    contractType: string;
    runIn: number;
    runOut: number;
    corridor: string;
    maxAttachmentPoint: number;
    coveredBenefit: string;
    attachmentPoint: number;
    paid: boolean;
    monthlyAccomodation: boolean;
    terminalLiability: boolean;
    retireesInclude: boolean;
    annualMaximum: number;
    lifetimeMaximum: number;
    specificLaser: boolean;
    unlimited: boolean;
    contract: boolean;
    familySpecificDeductibles: boolean;
    expectedRefund: boolean;
  }
  

export interface IClientIDRequest{
    clientId: string;
}


export interface IClientAdd{
    clientId: string;
    clientName: string;
    contractId: string;
    description: string;
    isActive: boolean;
    createdId: string;
    createdBy: Date;
    updatedId: string;
    lastUpdate: Date;
    deductible: number;
    individualDeductible: number;
    laserAmount: number;
    start: Date;
    end: Date;
    asl: string;
    contractType: string;
    runIn: number;
    runOut: number;
    corridor: string;
    maxAttachmentPoint: number;
    coveredBenefit: string;
    attachmentPoint: number;
    paid: boolean;
    monthlyAccomodation: boolean;
    terminalLiability: boolean;
    retireesInclude: boolean;
    annualMaximum: number;
    lifetimeMaximum: number;
    specificLaser: boolean;
    unlimited: boolean;
    contract: boolean;
    familySpecificDeductibles: boolean;
    expectedRefund: boolean;
    monthlyClaimAmount: number;
    numOfEmployee: number;
}

export interface IClientAddSuccess{
  clientID: string;
  message: string;
}

export interface IClientUpdate{
  clientId: string;
  clientName: string;
  contractId: string;
  description: string;
  isActive: boolean;
  createdId: string;
  createdBy: Date;
  updatedId: string;
  lastUpdate: Date;
  deductible: number;
  individualDeductible: number;
  laserAmount: number;
  start: Date;
  end: Date;
  asl: string;
  contractType: string;
  runIn: number;
  runOut: number;
  corridor: string;
  maxAttachmentPoint: number;
  coveredBenefit: string;
  attachmentPoint: number;
  paid: boolean;
  monthlyAccomodation: boolean;
  terminalLiability: boolean;
  retireesInclude: boolean;
  annualMaximum: number;
  lifetimeMaximum: number;
  specificLaser: boolean;
  unlimited: boolean;
  contract: boolean;
  familySpecificDeductibles: boolean;
  expectedRefund: boolean;
  monthlyClaimAmount: number;
  numOfEmployee: number;
}

export interface IClientUpdateSuccess{
  clientID: string;
  message: string;
}
