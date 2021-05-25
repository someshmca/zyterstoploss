export const Paths = {
  loginPath : "http://10.48.30.158:92/api/Login/UserLogin/",
  reportPath : "http://10.48.30.158:92/api/Claim/GetClaimReport",
  claimPath: "http://10.48.30.158:92/api/Claim/GetClaim",
  
  
  attributes: "http://10.48.30.158:92/api/Attribute/GetAllAttributeID",
  attribute: "http://10.48.30.158:92/api/Attribute/GetAttributeDetails?attributeId=",
  attributeAdd: "http://10.48.30.158:92/api/Attribute/AddAttributes", 
  attributeUpdate: "http://10.48.30.158:92/api/Attribute/UpdateAttributes",
  attributeGroup: "http://10.48.30.158:92/api/Attribute/GetAttributeGroup",

  benefits: "http://10.48.30.158:92/api/Benefits/GetAllBenefitsID",
  benefit: "http://10.48.30.158:92/api/Benefits/GetBenefitsdetail/",
  benefitAdd: "http://10.48.30.158:92/api/Benefits/AddBenefits",
  benefitUpdate: "http://10.48.30.158:92/api/Benefits/UpdateBenefits",

  programs: "http://10.48.30.158:92/api/Programs/GetAllProgramsID",
  program: "http://10.48.30.158:92/api/Programs/GetProgramDetail/",
  programAdd: "http://10.48.30.158:92/api/Programs/AddPrograms",
  programUpdate: "http://10.48.30.158:92/api/Programs/UpdatePrograms",

  contracts: "http://10.48.30.158:92/api/Contracts/GetAllContractsID/",
  contractsByClientPath: "http://10.48.30.158:92/api/Contracts/GetAllContractsID/",
  contract: "http://10.48.30.158:92/api/Contracts/GetContracts/",
  contractAdd: "http://10.48.30.158:92/api/Contracts/AddContracts",
  contractUpdate: "http://10.48.30.158:92/api/Contracts/UpdateContracts",
  contractAll: "http://10.48.30.158:92/api/Contracts/GetAllContracts",

  clients: "http://10.48.30.158:92/api/Clients/LoadClientDetails",
  client: "http://10.48.30.158:92/api/Clients/GetClientDetails/",
  clientAdd: "http://10.48.30.158:92/api/Clients/AddClients",
  clientUpdate: "http://10.48.30.158:92/api/Clients/UpdateClients",
  activeClients:"http://10.48.30.158:92/api/Clients/GetActiveClients",
  parentClient:"http://10.48.30.158:92/api/Clients/GetParentClient",



  roles: "http://10.48.30.158:92/api/Roles/GetAllRoles",
  role: "http://10.48.30.158:92/api/Roles/GetRolesDetail/",
  roleAdd: "http://10.48.30.158:92/api/Roles/AddRoles",
  roleUpdate: "http://10.48.30.158:92/api/Roles/UpdateRoles",

  rules: "http://10.48.30.158:92/api/Rules/GetAllRuleID",
  rule: "http://10.48.30.158:92/api/Rules/GetRulesDetails?ruleId=",
  ruleGroups: "http://10.48.30.158:92/api/Rules/GetRuleGroup", 
  ruleAdd: "http://10.48.30.158:92/api/Rules/AddRules",
  ruleUpdate: "http://10.48.30.158:92/api/Rules/UpdateRules",
  
  claimCalculate: "http://10.48.30.158:92/api/Claim/CalculateClaimAmount/",

  UsersPath:"http://10.48.30.158:92/api/UserAdministration/GetAllUsers",
  UserDetailPath:"http://10.48.30.158:92/api/UserAdministration/GetUserDetails/",
  userAdd:"http://10.48.30.158:92/api/UserAdministration/AddUsers",
  userTerminate:"http://10.48.30.158:92/api/UserAdministration/TerminateUsers",
  userChange:"http://10.48.30.158:92/api/UserAdministration/ChangeUsers",
 
  BatchStatusPath:"http://10.48.30.158:92/api/BatchProcess/GetBatchStatus",
  BatchProcessPath:"http://10.48.30.158:92/api/BatchProcess/GetBatchProcessDetail/",
  BatchHistoryPath:"http://10.48.30.158:92/api/BatchProcess/GetBatchProcessHistoryDetail?batchProcessId=",
  BatchProcessAdd: "http://10.48.30.158:92/api/BatchProcess/AddBatchProcess",
  BatchProcessUpdate: "http://10.48.30.158:92/api/BatchProcess/UpdateBatchProcess",
  BatchProcessCalculate: "http://10.48.30.158:92/api/BatchProcess/BatchCalculateClaimAmount?",

  planTires: "http://10.48.30.158:92/api/Plan/GetTiers",
  planAll: "http://10.48.30.158:92/api/Plan/GetPlanDetails",
  planAdd: "http://10.48.30.158:92/api/Plan/AddPlan",
  planUpdate: "http://10.48.30.158:92/api/Plan/UpdatePlan",

  memberSearch: "http://10.48.30.158:92/api/Member/GetMemberdetail?",
  memberAdd: "http://10.48.30.158:92/api/Member/AddMember",
  memberUpdate: "http://10.48.30.158:92/api/Member/UpdateMember",

  productAll: "http://10.48.30.158:92/api/Product/GetAllProducts",
  product: "http://10.48.30.158:92/api/Product/GetProducts?productId=",
  productAdd: "http://10.48.30.158:92/api/Product/AddProducts",
  productUpdate:"http://10.48.30.158:92/api/Product/UpdateProduct",
  productCovertClaims:"http://10.48.30.158:92/api/Product/GetCoveredClaims",

  ExcelUploadPath: "http://10.48.30.158:92/api/ExcelUpload/UploadExcel",
  
  sslReportURL: "http://dwim4-obiee01.qdint.local:9502/analytics/saw.dll?PortalGo&Action=prompt&path=%2Fshared%2FPOC%2FAgg_Claim_Expenese",
  aslReportURL: "http://dwim4-obiee01.qdint.local:9502/analytics/saw.dll?PortalGo&Action=prompt&path=%2Fshared%2FPOC%2FAgg_Claim_Expenese",
  maxLiabilityReportURL: "http://dwim4-obiee01.qdint.local:9502/analytics/saw.dll?PortalGo&Action=prompt&path=%2Fshared%2FPOC%2FAgg_Claim_Expenese"

}
