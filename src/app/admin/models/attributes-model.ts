
export interface IAttribute{
    attributeId: string;
    description: string;
    value: string;
    createdid: string;
    createdBy: string;
    updateid: string;
    lastupdate: Date;
    isActive: boolean;
    attributeGroup: string;
}

export interface IAttributeIDRequest{
    attributeId: string;
}

export interface IAttributeAdd{ 
    attributeID: string;
    attributeGroup: string;
    description: string;
    value: string;
    createdid: string;
    createdby: string;
    updateid: string;
    lastupdate: Date;
}
export interface IAddAttributeSuccess{
    id: string;
    message: string;
}
export interface IAttributeUpdate{    
  attributeId: string;
  description: string;
  value: string;
  createdid: string;
  createdBy: string;
  updateid: string;
  lastupdate: Date;
  isActive: boolean;
  attributeGroup: string;
}
export interface IUpdateAttributeSuccess{
    id: string;
    message: string;
}