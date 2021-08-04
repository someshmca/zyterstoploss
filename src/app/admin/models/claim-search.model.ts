export interface IClaimSearch{   
        claimId: string;
        memberId: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        fromDate: string;
        toDate: string;
        clientId: string;
        sequenceNumber?: number;
        minPaidAmount: number;
        maxPaidAmount: number;
        dollorAmount?: number;
        diagnosisCode: string;
        claimSource: string;
        claimType: string;
        alternateId: string;
        paidDate: string;
        paidFromDate: string;
        paidToDate: string;
}
