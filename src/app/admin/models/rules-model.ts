
export interface IRule{
    ruleID: string;
    description: string;
    value: string;
    createdid: string;
    createdOn: Date;
    updateid: string;
    lastupdate: Date;
    ruleGroup: string;
    isActive: boolean;
}

export interface IRuleIDRequest{     
    ruleID:string;
}

export interface IRuleAddRequest{
    ruleID: string;
    ruleGroup: string;
    description: string;
    value: string;
    createdid: string;
    createdOn: Date;
    updateid: string;
    lastupdate: Date
}

export interface IAddRuleSuccess{
     ruleID : string;
     message :  string;
}

export interface IUpdateRuleSuccess{
    ruleID : string;
    message :  string;
}

