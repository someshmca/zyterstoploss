


export interface IRule{
    ruleID: string;
    ruleGroup: string;
    ruleGroupId:number;
    description: string;
    value: string;
    userId: string;
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
    userId: string;
}

export interface IRuleUpdateRequest{
    ruleId: string;
    description: string;
    value: string;  
    ruleGroupId: number;
    isActive: boolean;
    userId: string;
}

export interface IAddRuleSuccess{
     ruleID : string;
     message :  string;
}

export interface IUpdateRuleSuccess{
    ruleID : string;
    message :  string;
}

