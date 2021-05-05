export const Paths = {
  loginPath : "https://medicaslapiorc.azurewebsites.net/api/Login/UserLogin/",
  reportPath : "https://medicaslapiorc.azurewebsites.net/api/Claim/GetClaimReport",
  claimPath: "https://medicaslapiorc.azurewebsites.net/api/Claim/GetClaim",
  
  
  attributes: "https://medicaslapiorc.azurewebsites.net/api/Attribute/GetAllAttributeID",
  attribute: "https://medicaslapiorc.azurewebsites.net/api/Attribute/GetAttributeDetails?attributeId=",
  attributeAdd: "https://medicaslapiorc.azurewebsites.net/api/Attribute/AddAttributes", 
  attributeUpdate: "https://medicaslapiorc.azurewebsites.net/api/Attribute/UpdateAttributes",
  attributeGroup: "https://medicaslapiorc.azurewebsites.net/api/Attribute/GetAttributeGroup",

  benefits: "https://medicaslapiorc.azurewebsites.net/api/Benefits/GetAllBenefitsID",
  benefit: "https://medicaslapiorc.azurewebsites.net/api/Benefits/GetBenefitsdetail/",
  benefitAdd: "https://medicaslapiorc.azurewebsites.net/api/Benefits/AddBenefits",
  benefitUpdate: "https://medicaslapiorc.azurewebsites.net/api/Benefits/UpdateBenefits",

  programs: "https://medicaslapiorc.azurewebsites.net/api/Programs/GetAllProgramsID",
  program: "https://medicaslapiorc.azurewebsites.net/api/Programs/GetProgramDetail/",
  programAdd: "https://medicaslapiorc.azurewebsites.net/api/Programs/AddPrograms",
  programUpdate: "https://medicaslapiorc.azurewebsites.net/api/Programs/UpdatePrograms",

  contracts: "https://medicaslapiorc.azurewebsites.net/api/Contracts/GetAllContractsID/",
  contractsByClientPath: "https://medicaslapiorc.azurewebsites.net/api/Contracts/GetAllContractsID/",
  contract: "https://medicaslapiorc.azurewebsites.net/api/Contracts/GetContracts/",
  contractAdd: "https://medicaslapiorc.azurewebsites.net/api/Contracts/AddContracts",
  contractUpdate: "https://medicaslapiorc.azurewebsites.net/api/Contracts/UpdateContracts",
  contractAll: "https://medicaslapiorc.azurewebsites.net/api/Contracts/GetAllContracts",

  clients: "https://medicaslapiorc.azurewebsites.net/api/Clients/LoadClientDetails",
  client: "https://medicaslapiorc.azurewebsites.net/api/Clients/GetClientDetails/",
  clientAdd: "https://medicaslapiorc.azurewebsites.net/api/Clients/AddClients",
  clientUpdate: "https://medicaslapiorc.azurewebsites.net/api/Clients/UpdateClients",
  activeClients:"https://medicaslapiorc.azurewebsites.net/api/Clients/GetActiveClients",
  parentClient:"https://medicaslapiorc.azurewebsites.net/api/Clients/GetParentClient",



  roles: "https://medicaslapiorc.azurewebsites.net/api/Roles/GetAllRoles",
  role: "https://medicaslapiorc.azurewebsites.net/api/Roles/GetRolesDetail/",
  roleAdd: "https://medicaslapiorc.azurewebsites.net/api/Roles/AddRoles",
  roleUpdate: "https://medicaslapiorc.azurewebsites.net/api/Roles/UpdateRoles",

  rules: "https://medicaslapiorc.azurewebsites.net/api/Rules/GetAllRuleID",
  rule: "https://medicaslapiorc.azurewebsites.net/api/Rules/GetRulesDetails?ruleId=",
  ruleGroups: "https://medicaslapiorc.azurewebsites.net/api/Rules/GetRuleGroup", 
  ruleAdd: "https://medicaslapiorc.azurewebsites.net/api/Rules/AddRules",
  ruleUpdate: "https://medicaslapiorc.azurewebsites.net/api/Rules/UpdateRules",
  
  claimCalculate: "https://medicaslapiorc.azurewebsites.net/api/Claim/CalculateClaimAmount/",

  UsersPath:"https://medicaslapiorc.azurewebsites.net/api/UserAdministration/GetAllUsers",
  UserDetailPath:"https://medicaslapiorc.azurewebsites.net/api/UserAdministration/GetUserDetails/",
  userAdd:"https://medicaslapiorc.azurewebsites.net/api/UserAdministration/AddUsers",
  userTerminate:"https://medicaslapiorc.azurewebsites.net/api/UserAdministration/TerminateUsers",
  userChange:"https://medicaslapiorc.azurewebsites.net/api/UserAdministration/ChangeUsers",
 
  BatchStatusPath:"https://medicaslapiorc.azurewebsites.net/api/BatchProcess/GetBatchStatus",
  BatchProcessPath:"https://medicaslapiorc.azurewebsites.net/api/BatchProcess/GetBatchProcessDetail/",
  BatchHistoryPath:"https://medicaslapiorc.azurewebsites.net/api/BatchProcess/GetBatchProcessHistoryDetail?batchProcessId=",
  BatchProcessAdd: "https://medicaslapiorc.azurewebsites.net/api/BatchProcess/AddBatchProcess",
  BatchProcessUpdate: "https://medicaslapiorc.azurewebsites.net/api/BatchProcess/UpdateBatchProcess",
  BatchProcessCalculate: "https://medicaslapiorc.azurewebsites.net/api/BatchProcess/BatchCalculateClaimAmount?",

  planTires: "https://medicaslapiorc.azurewebsites.net/api/Plan/GetTiers",
  planAll: "https://medicaslapiorc.azurewebsites.net/api/Plan/GetPlanDetails",
  planAdd: "https://medicaslapiorc.azurewebsites.net/api/Plan/AddPlan",
  planUpdate: "https://medicaslapiorc.azurewebsites.net/api/Plan/UpdatePlan",

  memberSearch: "https://medicaslapiorc.azurewebsites.net/api/Member/GetMemberdetail?",
  memberAdd: "https://medicaslapiorc.azurewebsites.net/api/Member/AddMember",
  memberUpdate: "https://medicaslapiorc.azurewebsites.net/api/Member/UpdateMember",

  productAll: "https://medicaslapiorc.azurewebsites.net/api/Product/GetAllProducts",
  product: "https://medicaslapiorc.azurewebsites.net/api/Product/GetProducts?productId=",
  productAdd: "https://medicaslapiorc.azurewebsites.net//api/Product/AddProducts",
  productUpdate:"https://medicaslapiorc.azurewebsites.net/api/Product/UpdateProducts",
  productCovertClaims:"https://medicaslapiorc.azurewebsites.net/api/Product//GetCoveredClaims",

  
}
