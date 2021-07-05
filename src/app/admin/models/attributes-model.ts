
export interface IAttribute{
    attributeID: string;
    attributeGroupID: number;
    description: string;
    value: string;
    createdid: string;
    createdOn: string;
    updateid: string;
    lastupdate: string;
}

export interface IAttributeIDRequest{
    attributeId: string;
}
export interface IAttributeGroup{
    attributeGroupID: number;
    name: string;
}
export interface IAttributeAdd{ 
    attributeID: string;
    attributeGroupID: number;
    description: string;
    value: string;
    createdid: string;
    createdOn: string;
    updateid: string;
    lastupdate: string;
}
export interface IAddAttributeSuccess{
    id: string;
    message: string;
}
export interface IAttributeUpdate{    
    attributeId: string;
    attributeGroupID: number;
    description: string;
    value: string;
    createdid: string;
    createdOn: string;
    updateid: string;
    lastupdate: string;
}
export interface IUpdateAttributeSuccess{
    id: string;
    message: string;
}