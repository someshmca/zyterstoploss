
export interface IMemberSearch{
    MemberId: string;
    Fname: string;
    Lname: string;
    DateOfBirth: string;
}
export interface IMemberSearchResponse{
    memberId: string;
    fname: string;
    lname: string;
    mname: null;
    subscriptionID: null;
    gender: null;
    status: null;
    memberStartDate: null;
    dateOfBirth: Date;
    createid: null;
    createdby: null;
    updateid: null;
    lastupdate: null;
}
export interface IMemberAdd{
    memberId: string;
    fname: string;
    lname: string;
    mname: string;
    subscriptionID: string;
    gender: string;
    status: string;
    memberStartDate: Date;
    dateOfBirth: Date;
    createid: string;
    createdby: string;
    updateid: string;
    lastupdate: Date;
}

export interface IMemberUpdate{
    memberId: string;
    fname: string;
    lname: string;
    mname: string;
    subscriptionId: string;
    gender: string;
    status: string;
    dateOfBirth: Date;
    memberStartDate: Date;
    claimId: string;
    createid: string;
    createdby: string;
    updateid: string;
    lastupdate: Date;
}