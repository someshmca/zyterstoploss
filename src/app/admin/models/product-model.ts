export interface IProductAll{
    productId: number;
    contractId: number;
    sslClaimBasis:string;
    sslIncurredStartDate:Date;
    sslIncurredEndDate: Date;
    sslPaidStartDate: Date;
    sslPaidEndDate: Date;
    sslRunInLimit: number;
    sslDeductible: number;
    sslAggDeductible: number;
    sslAnnualLimit: number;
    sslLifetimeLimit: number;
    sslTermCoverageExtEndDate: Date;
    sslIsImmediateReimbursement: boolean;
    sslLasering: boolean;
    aslClaimBasis:string;
    aslDeductible: number;
    aslMinDeductible: number;
    aslExpectedClaimLiability:number;
    aslIncurrredStartDate: Date;
    aslIncurredEndDate: Date;
    aslPaidStartDate: Date;
    aslPaidEndDate:Date;
    aslRunInLimit:number;
    aslAnnualLimit: number;
    aslLifeTimeLimit: number;
    aslIsMonthlyAccomidation: boolean;
    aslTermCoverageExtEndDate: Date;
    isMaxLiability: boolean;
    ibnrPercentage: number;
    defferedFeePercentage: number;
    status: number;
    clientName: string;
    lstContractClaims: IListContractClaims[];

}
export interface IProductAdd{
    productId: number;
    contractId: number;
    clientId: string;
    sslClaimBasis: string;
    sslIncurredStartDate: string;
    sslIncurredEndDate: string;
    sslPaidStartDate: string;
    sslPaidEndDate: string;
    sslRunInLimit: number;
    sslDeductible: number;
    sslAggDeductible: number;
    sslAnnualLimit: number;
    sslLifetimeLimit: number;
    sslTermCoverageExtEndDate: string;
    sslIsImmediateReimbursement: boolean;
    sslLasering: boolean;
    aslClaimBasis: string;
    aslDeductible: number;
    aslMinDeductible: number;
    aslExpectedClaimLiability: number;
    aslIncurrredStartDate: string;
    aslIncurredEndDate: string;
    aslPaidStartDate: string;
    aslPaidEndDate: string;
    aslRunInLimit: number;
    aslAnnualLimit: number;
    aslLifeTimeLimit: number;
    aslIsMonthlyAccomidation: boolean;
    aslTermCoverageExtEndDate: string;
    isMaxLiability: boolean;
    ibnrPercentage: number;
    defferedFeePercentage: number;
    status: number;
    userId: string;
    lstContractClaims: IListContractClaims[];
}
export interface IProductUpdate{
  productId: number;
  contractId: number;
  sslClaimBasis: string;
  sslIncurredStartDate: string;
  sslIncurredEndDate: string;
  sslPaidStartDate: string;
  sslPaidEndDate: string;
  sslRunInLimit: number;
  sslDeductible: number;
  sslAggDeductible: number;
  sslAnnualLimit: number;
  sslLifetimeLimit: number;
  sslTermCoverageExtEndDate: string;
  sslIsImmediateReimbursement: boolean;
  sslLasering: boolean;
  aslClaimBasis: string;
  aslDeductible: number;
  aslMinDeductible: number;
  aslExpectedClaimLiability: number;
  aslIncurrredStartDate: string;
  aslIncurredEndDate: string;
  aslPaidStartDate: string;
  aslPaidEndDate: string;
  aslRunInLimit: number;
  aslAnnualLimit: number;
  aslLifeTimeLimit: number;
  aslIsMonthlyAccomidation: boolean;
  aslTermCoverageExtEndDate: string;
  isMaxLiability: boolean;
  ibnrPercentage: number;
  defferedFeePercentage: number;
  status: number;
  userId: string;
  lstContractClaims: IListContractClaims[];
}
export interface IActiveClient{
    clientId: string;
    clientName: string;
}

export interface IContracts{
    contractId: number;
    claimsAdministrator: string;
}

export interface IAddProductSuccess{
    id: string;
    message: string;
}
export interface IProduct{
    productId: number;
    contractId: number;
    sslClaimBasis:string;
    sslIncurredStartDate:Date;
    sslIncurredEndDate: Date;
    sslPaidStartDate: Date;
    sslPaidEndDate: Date;
    sslRunInLimit: number;
    sslDeductible: number;
    sslAggDeductible: number;
    sslAnnualLimit: number;
    sslLifetimeLimit: number;
    sslTermCoverageExtEndDate: Date;
    sslIsImmediateReimbursement: boolean;
    aslClaimBasis:string;
    aslDeductible: number;
    aslMinDeductible: number;
    aslExpectedClaimLiability:number;
    aslIncurrredStartDate: Date;
    aslIncurredEndDate: Date;
    aslPaidStartDate: Date;
    aslPaidEndDate:Date;
    aslRunInLimit:number;
    aslAnnualLimit: number;
    aslLifeTimeLimit: number;
    aslIsMonthlyAccomidation: boolean;
    aslTermCoverageExtEndDate: Date;
    isMaxLiability: boolean;
    ibnrPercentage: number;
    defferedFeePercentage: number;
    status: number;
    clientId: string;
    lstContractClaims: IListContractClaims[];
}

export interface ICoveredClaims{
    claimTypeCode: string;
    claimType: string;
    status: boolean;
}
export interface IListContractClaims{
    productid: number;
    claimtypecode: string;
    sltype: string;
}
