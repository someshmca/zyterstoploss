export interface IClaimReportsModel{
        claimId: string;
        clientName: string;
        memberId: string;
        firstName: string;
        lastName: string;
        paidAmount: number;
        climReceivedOn: string;
        paidDate: string;
        dateOfBirth: string;
        clientId: string;
        sequenceNumber: number;
        dollorAmount: number;
        diagnosisCode: string;
        claimSource: string;
        claimType: string;
        alternateId: string;
        subscriberFirstName: string;
        subscriberLastName: string;
        paidFromDate: string;
        paidToDate: string
}
export interface IClaimUpdate{  
        claimId: string;
        exclusion:string;
}
export interface IClaimUpdateResponse{  
        id: string;
        message:string;
}

export interface IClaimAudit{
        memberId: number,
        fname: string,
        lname: string,
        dateOfBirth: Date,
        claimId: string,
        subsriptionId: string,
        memberStartDate: Date,
        gender: string,
        status: null,
        mname: string,
        userId: string,
        sysDate: Date,
        actionType: string
      }