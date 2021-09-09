
export interface IMemberSearch{
    MemberId: string;
    Fname: string;
    Lname: string;
    DateOfBirth: string;
}
export interface IMemberSearchResponse{
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
export interface IMemberAdd{
    memberId: string;
    fname: string;
    lname: string;
    mname: string;
    subscriptionID: string;
    gender: string;
    status: number;
    memberHrid: string;
    laserValue: number;
    isUnlimited: string;
    userId: string;
    memberStartDate: string;
    memberEndDate: string;
    alternateId: string;
    clientId: string;
    contractId: number;
    planId: number;
    tierId: number;
    dateOfBirth: string;
}

export interface IMemberUpdate{
  laserType:string;
  laserTypeId: string;
  laserValue:number;
  isUnlimited: string;
  status: number;
  createdBy: string;
  updatedBy:string;
  createdOn:Date;
  updatedOn:Date;
  exclusion: string;
  contractId: number;
  memberStartDate: string;
  memberEndDate: string;
}