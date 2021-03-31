
export interface IClaim{
    claimId: string,
    clientId: string,
    lastChangedOn: Date,
    status: boolean,
    adjudicatedOn: Date,
    claimType: string,
    manuallyPriced: boolean,
    sentToReview: boolean,
    benefitPlanType: string,
    capitatedService: boolean,
    removedClaim: boolean,
    voidedClaim: boolean,
    calculatedBenefitPlan: string,
    claimSource: string,
    claimAmount: number,
    startDate: Date,
    endDate: Date,
    stopLossAmount: number,
    memberId: number,
    isJobBatch: number
}


