
export interface IClaim{
    claimId: string;                                                            
    memberId: string;
    memberHrid: string;
    fname: string;
    lname: string;
    dateOfBirth: string;
    climReceivedOn: string;
    adjudicatedOn: string;
    paidDate: string;
    paidAmount: number;
    laserValue: number;
    isUnlimited: string;
    contractId: number;
    clientName: string;
    planName: string;
    memberStartDate: string;
    memberEndDate: string;
    stopLossAmount: number,
    exclusion: string;
}

