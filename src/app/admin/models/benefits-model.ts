export interface IBenefit{
    benefitId: string;
    description: string;
    code: string;
    codeType: string;
    createid: string;
    createdOn: Date;
    updateid: string;
    lastupdate: Date
}

export interface IBenefitIDRequest{
    benefitId: string;
}

export interface IBenefitAdd{    
    benefitId: string;
    description: string;
    code: string;
    codeType: string;
    createid: string;
    createdOn: Date;
    updateid: string;
    lastupdate: Date;     
}
export interface IAddBenefitSuccess{
    id: string;
    message: string;
}
export interface IBenefitUpdate{
    benefitId: string;
    description: string;
    code: string;
    codeType: string;
    createid: string;
    createdOn: Date;
    updateid: string;
    lastupdate: Date; 
}
export interface IUpdateBenefitSuccess{
    id: string;
    message: string;
}
