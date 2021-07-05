
export interface IAllUserIDs{
    userId: string,
    userName:string,
    firstName:string,
    middleName:string,
    lastName:string,
    description:string,
    emailAddress:string,
    departmentName: string,
    effectiveFrom:string,
    effectiveTo:string,
    terminationDate: string,
    status:boolean,
    updatedId:string,
    roleId:number,
    password: string,
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
    departmentName: string,
    roleID:number,
    effectiveFrom:string,
    effectiveTo:string,
    terminationDate: string,
    status:boolean,
    updatedId:string,
    roleId: number,
    password: string,
    roleName: string
}

export interface IUserAdd{
    userId:string,
    firstName: string,
    middleName: string,
    lastName: string, 
    description:string,  
    emailAddress: string,
    effectiveFrom:string,
    effectiveTo: string,
    terminationDate:string,
    status: string,
    createdId:string,
    createdOn: string,
    updatedId: string,
    lastupdate: string,
    roleId:number,
    password:string   
 }
 
 export interface IUserAddResponse{
      id : string;
      message :  string;
 }
 
 export interface IUserUpdate{
    userId:string,
    userName: string,
    firstName: string,
    middleName: string,
    lastName: string, 
    description:string,  
    emailAddress: string,
    departmentName: string,
    roleID:number,
    effectiveFrom:string,
    effectiveTo: string,
    terminationDate:string,
    status: string,
    updatedId:string,
    roleId: number,
    password: string,
    roleName: string
}

export interface IUserUpdateResponse{
    id : string;
    message :  string;
}




