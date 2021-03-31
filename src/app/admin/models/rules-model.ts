
export interface IRule{
    ruleID: string;
    ruleGroup: string;
    ruleGroupId:number;
    description: string;
    value: string;
    createdid: string;
    createdOn: string;
    updateid: string;
    lastupdate: string;
}

export interface IRuleIDRequest{     
    ruleID:string;
}

export interface IRuleAddRequest{
    ruleID: string;
    ruleGroup: string;
    ruleGroupId: number;
    description: string;
    value: string;
    createdid: string;
    createdOn: string;
    updateid: string;
    lastupdate: string;
}

export interface IRuleUpdateRequest{
    ruleID: string;
    description: string;
    value: string;
    createdid: string;
    createdOn: string;
    updateid: string;
    lastupdate: string;    
    ruleGroupId: number;
    isActive: boolean;
}

export interface IAddRuleSuccess{
     ruleID : string;
     message :  string;
}

export interface IUpdateRuleSuccess{
    ruleID : string;
    message :  string;
}

