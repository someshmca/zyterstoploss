export interface LoginModel{
    emailId: string;
    password: string;
}

export interface LoginResponseModel{
    name: string;
    roleName: string;
    emailID: string;
    password: string;
    token: string;
    menus:menus[]; 
}
export interface menus{
        id: number;
        name: string;
        description: string;
        route: string;
        roleid: number;
} 