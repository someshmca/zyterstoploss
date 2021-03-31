
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
    status: number;
    memberStartDate: Date;
    dateOfBirth: Date;
    createid: string;
    createdby: string;
    updateid: string;
    lastupdate: Date;
}

export interface IMemberUpdate{
memberId: string;
  memberHrid: string;
  alternateId: string;
  clientId: string;
  contractId: number;
  planId: number;
  tierId: number;
  fname: string;
  lname: string;
  mname: string;
  dateOfBirth: string;
  gender: string;
  memberStartDate: string;
  memberEndDate: string;
  subscriberId: string;
  subscriberFname: string;
  subscriberLname: string;
  laserValue: number;
  isUnlimited: string;
  status: number;
  userId: string;
}