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
    menuDetails:menus[]; 
}

export interface menuDetails{
    menuGroupID: number;
        name: string;
        menuGroup: number;
       menus:menus[];
} 
export interface menus{
        id: number;
        name: string;
        description: string;
        route: string;
        roleid: number;
} 