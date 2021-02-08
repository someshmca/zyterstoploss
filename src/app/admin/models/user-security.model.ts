
export interface IAllUserIDs{
    userId: string,
    userName:string,
    firstName:string,
    middleName:string,
    lastName:string,
    description:string,
    emailAddress:string,
    roleID:number,
    effectiveFrom:string,
    effectiveTo:string,
    terminationDate: string,
    status:boolean,
    updatedId:string,
    roleName:string
}

export interface IUserDetails{     
    userId: string,
    userName:string,
    firstName:string,
    middleName:string,
    lastName:string,
    description:string,
    emailAddress:string,
    roleID:number,
    effectiveFrom:string,
    effectiveTo:string,
    terminationDate: string,
    status:boolean,
    updatedId:string,
    roleName:string
}

export interface IUserAdd{
    userId:string,
    firstName: string,
   middleName: string,
   lastName: string, 
   description:string,  
   emailAddress: string,
   roleID:number,
   effectiveFrom:Date,
   effectiveTo: Date,
   terminationDate:Date,
   status: string,
   createdId:string,
   createdBy: string,
   updatedId: string,
   lastupdate: string,
   password:string
   
 }
 
 export interface IUserAddResponse{
      userID : string;
      message :  string;
 }
 
 export interface IUserUpdate{
    userId:string,
    firstName: string,
    middleName: string,
    lastName: string, 
    description:string,  
    emailAddress: string,
    roleID:number,
    effectiveFrom:Date,
    effectiveTo: Date,
    terminationDate:Date,
    status: string,
    updatedId:string 
}

export interface IUserUpdateResponse{
    userID : string;
    message :  string;
}




