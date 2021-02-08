export const Paths = {
  //reportPath : "http://localhost:56465/api/Claim/GetClaimReport",
  //loginPath : "http://localhost:56465/api/Login/UserLogin/"

  loginPath : "https://zyterhealthslapi.azurewebsites.net/api/Login/UserLogin/",
  reportPath : "https://zyterhealthslapi.azurewebsites.net/api/Claim/GetClaimReport",
  claimPath: "https://zyterhealthslapi.azurewebsites.net/api/Claim/GetClaim",
  
  
  attributes: "https://zyterhealthslapi.azurewebsites.net/api/Attribute/GetAllAttributeID",
  attribute: "https://zyterhealthslapi.azurewebsites.net/api/Attribute/GetAttributeDetails?attributeId=",
  attributeAdd: "https://zyterhealthslapi.azurewebsites.net/api/Attribute/AddAttributes", 

  benefits: "https://zyterhealthslapi.azurewebsites.net/api/Benefits/GetAllBenefitsID",
  benefit: "https://zyterhealthslapi.azurewebsites.net/api/Benefits/GetBenefitsdetail/",
  benefitAdd: "https://zyterhealthslapi.azurewebsites.net/api/Benefits/AddBenefits",
  benefitUpdate: "https://zyterhealthslapi.azurewebsites.net/api/Benefits/UpdateBenefits",

  programs: "https://zyterhealthslapi.azurewebsites.net/api/Programs/GetAllProgramsID",
  program: "https://zyterhealthslapi.azurewebsites.net/api/Programs/GetProgramDetail/",
  programAdd: "https://zyterhealthslapi.azurewebsites.net/api/Programs/AddPrograms",
  programUpdate: "https://zyterhealthslapi.azurewebsites.net/api/Programs/UpdatePrograms",

  contracts: "https://zyterhealthslapi.azurewebsites.net/api/Contracts/GetAllContractsID",
  contract: "https://zyterhealthslapi.azurewebsites.net/api/Contracts/GetContracts/",
  contractAdd: "https://zyterhealthslapi.azurewebsites.net/api/Contracts/AddContracts",
  contractUpdate: "https://zyterhealthslapi.azurewebsites.net/api/Contracts/UpdateContracts",

  clients: "https://zyterhealthslapi.azurewebsites.net/api/Clients/GetAllClients",
  client: "https://zyterhealthslapi.azurewebsites.net/api/Clients/GetClientDetails/",
  clientAdd: "https://zyterhealthslapi.azurewebsites.net/api/Clients/AddClients",
  clientUpdate: "https://zyterhealthslapi.azurewebsites.net/api/Clients/UpdateClients",

  roles: "https://zyterhealthslapi.azurewebsites.net/api/Roles/GetAllRoles",
  role: "https://zyterhealthslapi.azurewebsites.net/api/Roles/GetRolesDetail/",
  roleAdd: "https://zyterhealthslapi.azurewebsites.net/api/Roles/AddRoles",
  roleUpdate: "https://zyterhealthslapi.azurewebsites.net/api/Roles/UpdateRoles",

  rules: "https://zyterhealthslapi.azurewebsites.net/api/Rules/GetAllRuleID",
  rule: "https://zyterhealthslapi.azurewebsites.net/api/Rules/GetRulesDetails?ruleId=",
  ruleGroups: "https://zyterhealthslapi.azurewebsites.net/api/Rules/GetRuleGroup", 
  ruleAdd: "https://zyterhealthslapi.azurewebsites.net/api/Rules/AddRules",
  ruleUpdate: "https://zyterhealthslapi.azurewebsites.net/api/Rules/UpdateRules",
  ruleDelete: "https://zyterhealthslapi.azurewebsites.net/api/Rules/DeleteRules?ruleId=",
  
  claimCalculate: "https://zyterhealthslapi.azurewebsites.net/api/Claim/CalculateClaimAmount/",

  UsersPath:"https://zyterhealthslapi.azurewebsites.net/api/UserAdministration/GetAllUsers",
  UserDetailPath:"https://zyterhealthslapi.azurewebsites.net/api/UserAdministration/GetUserDetails",
  userAdd:"https://zyterhealthslapi.azurewebsites.net/api/UserAdministration/AddUsers",
  userTerminate:"https://zyterhealthslapi.azurewebsites.net/api/UserAdministration/TerminateUsers",
  userChange:"https://zyterhealthslapi.azurewebsites.net/api/UserAdministration/ChangeUsers",
 
  BatchStatusPath:"https://zyterhealthslapi.azurewebsites.net/api/BatchProcess/GetBatchStatus",
  BatchProcessPath:"https://zyterhealthslapi.azurewebsites.net/api/BatchProcess/GetBatchProcessDetail/",
  BatchHistoryPath:"https://zyterhealthslapi.azurewebsites.net/api/BatchProcess/GetBatchProcessHistoryDetail?batchProcessId=",
  BatchProcessAdd: "https://zyterhealthslapi.azurewebsites.net/api/BatchProcess/AddBatchProcess",
  BatchProcessUpdate: "https://zyterhealthslapi.azurewebsites.net/api/BatchProcess/UpdateBatchProcess",
  BatchProcessCalculate: "https://zyterhealthslapi.azurewebsites.net/api/BatchProcess/BatchCalculateClaimAmount?",

  memberSearch: "https://zyterhealthslapi.azurewebsites.net/api/Member/GetMemberdetail?"
}
