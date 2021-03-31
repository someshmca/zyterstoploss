export interface IRole{
    roleId: number;
    roleName: string;
    description: string;
    menueAccess: string;
}

export interface IRoleNameRequest{
    roleName: string;  
}

export interface IAddRole{    
    roleId: number;
    roleName: string;
    description: string;
    createid: string;
    createdOn: string;
    updateid: string;
    lastupdate: Date;
}

export interface IAddRoleSuccess{
    roleID : string;
    message :  string;
}

export interface IUpdateRole{    
    roleId: number;
    roleName: string;
    description: string;
    createid: string;
    createdOn: string;
    updateid: string;
    lastupdate: Date;
}

export interface IUpdateRoleSuccess{
    roleID : string;
    message :  string;
}
