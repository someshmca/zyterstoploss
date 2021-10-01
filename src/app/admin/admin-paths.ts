const apiPath = "https://medicaslapiorc.azurewebsites.net/api/";  // Azure Server Internal
//const apiPath = "http://10.48.30.158:92/api/"; // Dev Server 
//const apiPath = "http://10.45.30.100:92/api/"; // QA Server
//const apiPath = "http://10.12.30.40:92/api/"; //UAT Server
//const apiPath = "http://10.10.30.206:92/api/"; // Production Server 1 
//const apiPath = "http://10.10.30.207:92/api/"; // Production Server 2

// for Azure 
export const Paths = {
  loginPath : apiPath+"Login/UserLogin/",
  reportPath : apiPath+"Claim/GetClaimReport",
  claimPath: apiPath+"Claim/GetClaim",

  attributes: apiPath+"Attribute/GetAllAttributeID",
  attribute: apiPath+"Attribute/GetAttributeDetails?attributeId=",
  attributeAdd: apiPath+"Attribute/AddAttributes", 
  attributeUpdate: apiPath+"Attribute/UpdateAttributes",
  attributeGroup: apiPath+"Attribute/GetAttributeGroup",

  benefits: apiPath+"Benefits/GetAllBenefitsID",
  benefit: apiPath+"Benefits/GetBenefitsdetail/",
  benefitAdd: apiPath+"Benefits/AddBenefits",
  benefitUpdate: apiPath+"Benefits/UpdateBenefits",

  programs: apiPath+"Programs/GetAllProgramsID",
  program: apiPath+"Programs/GetProgramDetail/",
  programAdd: apiPath+"Programs/AddPrograms",
  programUpdate: apiPath+"Programs/UpdatePrograms",

  contracts: apiPath+"Contracts/GetAllContractsID/",
  contractsByClientPath: apiPath+"Contracts/GetAllContractsID/",
  contract: apiPath+"Contracts/GetContracts/",
  contractAdd: apiPath+"Contracts/AddContracts",
  contractUpdate: apiPath+"Contracts/UpdateContracts",
  contractAll: apiPath+"Contracts/GetAllContracts",
  contractDateValidation: apiPath+"Contracts/DateValidation/",

  clients: apiPath+"Clients/LoadClientDetails",
  client: apiPath+"Clients/GetClientDetails/",
  clientAdd: apiPath+"Clients/AddClients",
  clientUpdate: apiPath+"Clients/UpdateClients",
  getClientDetails: apiPath+"Clients/GetClientDetails/",
  activeClients:apiPath+"Clients/GetActiveClients",
  parentClient:apiPath+"Clients/GetParentClient",
  duplicateClientId: apiPath+"Clients/DuplicateClientID?clientId=",
  duplicateClientName: apiPath+"Clients/DuplicateClient?client=",

  roles: apiPath+"Roles/GetAllRoles",
  role: apiPath+"Roles/GetRolesDetail/",
  roleAdd: apiPath+"Roles/AddRoles",
  roleUpdate: apiPath+"Roles/UpdateRoles",

  rules: apiPath+"Rules/GetAllRuleID",
  rule: apiPath+"Rules/GetRulesDetails?ruleId=",
  ruleGroups: apiPath+"Rules/GetRuleGroup", 
  ruleAdd: apiPath+"Rules/AddRules",
  ruleUpdate: apiPath+"Rules/UpdateRules",
  
  claimCalculate: apiPath+"Claim/CalculateClaimAmount/",
  claimUpdate: apiPath+"Claim/UpdateClaim?",

  UsersPath:apiPath+"UserAdministration/GetAllUsers",
  UserDetailPath:apiPath+"UserAdministration/GetUserDetails/",
  userAdd:apiPath+"UserAdministration/AddUsers",
  userTerminate:apiPath+"UserAdministration/TerminateUsers",
  userChange:apiPath+"UserAdministration/ChangeUsers",
 
  BatchStatusPath:apiPath+"BatchProcess/GetBatchStatus",
  BatchProcessPath:apiPath+"BatchProcess/GetBatchProcessDetail/",
  BatchHistoryPath:apiPath+"BatchProcess/GetBatchProcessHistoryDetail?batchProcessId=",
  BatchProcessAdd: apiPath+"BatchProcess/AddBatchProcess",
  BatchProcessUpdate: apiPath+"BatchProcess/UpdateBatchProcess",
  BatchProcessCalculate: apiPath+"BatchProcess/BatchCalculateClaimAmount?",
  duplicateBatchProcess: apiPath+"BatchProcess/DuplicateBatchProcess?batchProcessId=", 

  planTires: apiPath+"Plan/GetTiers",
  planAll: apiPath+"Plan/GetPlanDetails",
  planAdd: apiPath+"Plan/AddPlan",
  planUpdate: apiPath+"Plan/UpdatePlan",
  duplicatePlanId:apiPath+"Plan/DuplicatePlanCode?planCode=", 
  duplicatePlan:apiPath+"Plan/DuplicatePlanCode?", 
  duplicatePlanName:apiPath+"Plan/DuplicatePlanName?planName=", 

  memberSearch: apiPath+"Member/GetMemberdetail?",
  memberAdd: apiPath+"Member/AddMember",
  memberUpdate: apiPath+"Member/UpdateMember",
  memberAll: apiPath+"Member/GetAllMember",
  member:apiPath+"Member/GetMemberDetailsByClientId/",

  productAll: apiPath+"Product/GetAllProducts",
  product: apiPath+"Product/GetProducts?productId=",
  productAdd: apiPath+"Product/AddProducts",
  productUpdate:apiPath+"Product/UpdateProduct",
  productCovertClaims:apiPath+"Product/GetCoveredClaims",
  duplicateContract: apiPath+"Product/DuplicateContract?contractId=",
  productByContractPeriod: apiPath+"Product/GetProductByContractPeriod?",

  ExcelUploadPath: apiPath+"ExcelUpload/UploadExcel?userId=",

  sslReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FMedica%20SL%2FSpecific%20Report",
  aslReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fusers%2Fsrajamani%40infinite.com%2FMedica%20SL%2FSpecific%20Report",
  maxLiabilityReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fusers%2Fsrajamani%40infinite.com%2FMedica%20SL%2FSpecific%20Report",

  authenticateUser: apiPath+"Login/AuthenticateUser?userName="

}

// for Medica Dev 

// export const Paths = {
//   loginPath : "http://10.48.30.158:92/api/Login/UserLogin/",
//   reportPath : "http://10.48.30.158:92/api/Claim/GetClaimReport",
//   claimPath: "http://10.48.30.158:92/api/Claim/GetClaim",
  
  
//   attributes: "http://10.48.30.158:92/api/Attribute/GetAllAttributeID",
//   attribute: "http://10.48.30.158:92/api/Attribute/GetAttributeDetails?attributeId=",
//   attributeAdd: "http://10.48.30.158:92/api/Attribute/AddAttributes", 
//   attributeUpdate: "http://10.48.30.158:92/api/Attribute/UpdateAttributes",
//   attributeGroup: "http://10.48.30.158:92/api/Attribute/GetAttributeGroup",

//   benefits: "http://10.48.30.158:92/api/Benefits/GetAllBenefitsID",
//   benefit: "http://10.48.30.158:92/api/Benefits/GetBenefitsdetail/",
//   benefitAdd: "http://10.48.30.158:92/api/Benefits/AddBenefits",
//   benefitUpdate: "http://10.48.30.158:92/api/Benefits/UpdateBenefits",

//   programs: "http://10.48.30.158:92/api/Programs/GetAllProgramsID",
//   program: "http://10.48.30.158:92/api/Programs/GetProgramDetail/",
//   programAdd: "http://10.48.30.158:92/api/Programs/AddPrograms",
//   programUpdate: "http://10.48.30.158:92/api/Programs/UpdatePrograms",

//   contracts: "http://10.48.30.158:92/api/Contracts/GetAllContractsID/",
//   contractsByClientPath: "http://10.48.30.158:92/api/Contracts/GetAllContractsID/",
//   contract: "http://10.48.30.158:92/api/Contracts/GetContracts/",
//   contractAdd: "http://10.48.30.158:92/api/Contracts/AddContracts",
//   contractUpdate: "http://10.48.30.158:92/api/Contracts/UpdateContracts",
//   contractAll: "http://10.48.30.158:92/api/Contracts/GetAllContracts",
//  contractDateValidation: "http://10.48.30.158:92/api/Contracts/DateValidation/",

//   clients: "http://10.48.30.158:92/api/Clients/LoadClientDetails",
//   client: "http://10.48.30.158:92/api/Clients/GetClientDetails/",
//   clientAdd: "http://10.48.30.158:92/api/Clients/AddClients",
//   clientUpdate: "http://10.48.30.158:92/api/Clients/UpdateClients",
//   getClientDetails: "http://10.48.30.158:92/api/Clients/GetClientDetails/",
//   activeClients:"http://10.48.30.158:92/api/Clients/GetActiveClients",
//   parentClient:"http://10.48.30.158:92/api/Clients/GetParentClient",
//     duplicateClientId: "http://10.48.30.158:92/api/Clients/DuplicateClientID?clientId=",
//     duplicateClientName: "http://10.48.30.158:92/api/Clients/DuplicateClient?client=",



//   roles: "http://10.48.30.158:92/api/Roles/GetAllRoles",
//   role: "http://10.48.30.158:92/api/Roles/GetRolesDetail/",
//   roleAdd: "http://10.48.30.158:92/api/Roles/AddRoles",
//   roleUpdate: "http://10.48.30.158:92/api/Roles/UpdateRoles",

//   rules: "http://10.48.30.158:92/api/Rules/GetAllRuleID",
//   rule: "http://10.48.30.158:92/api/Rules/GetRulesDetails?ruleId=",
//   ruleGroups: "http://10.48.30.158:92/api/Rules/GetRuleGroup", 
//   ruleAdd: "http://10.48.30.158:92/api/Rules/AddRules",
//   ruleUpdate: "http://10.48.30.158:92/api/Rules/UpdateRules",
  
//   claimCalculate: "http://10.48.30.158:92/api/Claim/CalculateClaimAmount/",
//  claimUpdate: "http://10.48.30.158:92/api/Claim/UpdateClaim?",

//   UsersPath:"http://10.48.30.158:92/api/UserAdministration/GetAllUsers",
//   UserDetailPath:"http://10.48.30.158:92/api/UserAdministration/GetUserDetails/",
//   userAdd:"http://10.48.30.158:92/api/UserAdministration/AddUsers",
//   userTerminate:"http://10.48.30.158:92/api/UserAdministration/TerminateUsers",
//   userChange:"http://10.48.30.158:92/api/UserAdministration/ChangeUsers",
 
//   BatchStatusPath:"http://10.48.30.158:92/api/BatchProcess/GetBatchStatus",
//   BatchProcessPath:"http://10.48.30.158:92/api/BatchProcess/GetBatchProcessDetail/",
//   BatchHistoryPath:"http://10.48.30.158:92/api/BatchProcess/GetBatchProcessHistoryDetail?batchProcessId=",
//   BatchProcessAdd: "http://10.48.30.158:92/api/BatchProcess/AddBatchProcess",
//   BatchProcessUpdate: "http://10.48.30.158:92/api/BatchProcess/UpdateBatchProcess",
//   BatchProcessCalculate: "http://10.48.30.158:92/api/BatchProcess/BatchCalculateClaimAmount?",
//   duplicateBatchProcess: "http://10.48.30.158:92/api/BatchProcess/DuplicateBatchProcess?batchProcessId=",

//   planTires: "http://10.48.30.158:92/api/Plan/GetTiers",
//   planAll: "http://10.48.30.158:92/api/Plan/GetPlanDetails",
//   planAdd: "http://10.48.30.158:92/api/Plan/AddPlan",
//   planUpdate: "http://10.48.30.158:92/api/Plan/UpdatePlan",
//   duplicatePlanId:"http://10.48.30.158:92/api/Plan/DuplicatePlanCode?planCode=", 
//    duplicatePlanName:"http://10.48.30.158:92/api/Plan/DuplicatePlanName?planName=",

//   memberSearch: "http://10.48.30.158:92/api/Member/GetMemberdetail?",
//   memberAdd: "http://10.48.30.158:92/api/Member/AddMember",
//   memberUpdate: "http://10.48.30.158:92/api/Member/UpdateMember",
//     memberAll: "http://10.48.30.158:92/api/Member/GetAllMember",
//     member:"http://10.48.30.158:92/api/Member/GetMemberDetailsByClientId/",
  

//   productAll: "http://10.48.30.158:92/api/Product/GetAllProducts",
//   product: "http://10.48.30.158:92/api/Product/GetProducts?productId=",
//   productAdd: "http://10.48.30.158:92/api/Product/AddProducts",
//   productUpdate:"http://10.48.30.158:92/api/Product/UpdateProduct",
//   productCovertClaims:"http://10.48.30.158:92/api/Product/GetCoveredClaims",
//   duplicateContract: "http://10.48.30.158:92/api/Product/DuplicateContract?contractId=",
//   productByContractPeriod: "http://10.48.30.158:92/api/Product/GetProductByContractPeriod?",

//  ExcelUploadPath: "http://10.48.30.158:92/api/ExcelUpload/UploadExcel?userId=",
  
//   sslReportURL: "http://dwim4-obiee01.qdint.local:9502/analytics/saw.dll?PortalGo&Action=prompt&path=%2Fshared%2FPOC%2FAgg_Claim_Expenese",
//   aslReportURL: "http://dwim4-obiee01.qdint.local:9502/analytics/saw.dll?PortalGo&Action=prompt&path=%2Fshared%2FPOC%2FAgg_Claim_Expenese",
//   maxLiabilityReportURL: "http://dwim4-obiee01.qdint.local:9502/analytics/saw.dll?PortalGo&Action=prompt&path=%2Fshared%2FPOC%2FAgg_Claim_Expenese"

// }


// for Medica QA
// export const Paths = {
//   loginPath : "http://10.45.30.100:92/api/Login/UserLogin/",
//   reportPath : "http://10.45.30.100:92/api/Claim/GetClaimReport",
//   claimPath: "http://10.45.30.100:92/api/Claim/GetClaim",
  
  
//   attributes: "http://10.45.30.100:92/api/Attribute/GetAllAttributeID",
//   attribute: "http://10.45.30.100:92/api/Attribute/GetAttributeDetails?attributeId=",
//   attributeAdd: "http://10.45.30.100:92/api/Attribute/AddAttributes", 
//   attributeUpdate: "http://10.45.30.100:92/api/Attribute/UpdateAttributes",
//   attributeGroup: "http://10.45.30.100:92/api/Attribute/GetAttributeGroup",

//   benefits: "http://10.45.30.100:92/api/Benefits/GetAllBenefitsID",
//   benefit: "http://10.45.30.100:92/api/Benefits/GetBenefitsdetail/",
//   benefitAdd: "http://10.45.30.100:92/api/Benefits/AddBenefits",
//   benefitUpdate: "http://10.45.30.100:92/api/Benefits/UpdateBenefits",

//   programs: "http://10.45.30.100:92/api/Programs/GetAllProgramsID",
//   program: "http://10.45.30.100:92/api/Programs/GetProgramDetail/",
//   programAdd: "http://10.45.30.100:92/api/Programs/AddPrograms",
//   programUpdate: "http://10.45.30.100:92/api/Programs/UpdatePrograms",

//   contracts: "http://10.45.30.100:92/api/Contracts/GetAllContractsID/",
//   contractsByClientPath: "http://10.45.30.100:92/api/Contracts/GetAllContractsID/",
//   contract: "http://10.45.30.100:92/api/Contracts/GetContracts/",
//   contractAdd: "http://10.45.30.100:92/api/Contracts/AddContracts",
//   contractUpdate: "http://10.45.30.100:92/api/Contracts/UpdateContracts",
//   contractAll: "http://10.45.30.100:92/api/Contracts/GetAllContracts",
//  contractDateValidation: "http://10.45.30.100:92/api/Contracts/DateValidation/",

//   clients: "http://10.45.30.100:92/api/Clients/LoadClientDetails",
//   client: "http://10.45.30.100:92/api/Clients/GetClientDetails/",
//   clientAdd: "http://10.45.30.100:92/api/Clients/AddClients",
//   clientUpdate: "http://10.45.30.100:92/api/Clients/UpdateClients",
//   getClientDetails: "http://10.45.30.100:92/api/Clients/GetClientDetails/",
//   activeClients:"http://10.45.30.100:92/api/Clients/GetActiveClients",
//   parentClient:"http://10.45.30.100:92/api/Clients/GetParentClient",
//     duplicateClientId: "http://10.45.30.100:92/api/Clients/DuplicateClientID?clientId=",
//     duplicateClientName: "http://10.45.30.100:92/api/Clients/DuplicateClient?client=",



//   roles: "http://10.45.30.100:92/api/Roles/GetAllRoles",
//   role: "http://10.45.30.100:92/api/Roles/GetRolesDetail/",
//   roleAdd: "http://10.45.30.100:92/api/Roles/AddRoles",
//   roleUpdate: "http://10.45.30.100:92/api/Roles/UpdateRoles",

//   rules: "http://10.45.30.100:92/api/Rules/GetAllRuleID",
//   rule: "http://10.45.30.100:92/api/Rules/GetRulesDetails?ruleId=",
//   ruleGroups: "http://10.45.30.100:92/api/Rules/GetRuleGroup", 
//   ruleAdd: "http://10.45.30.100:92/api/Rules/AddRules",
//   ruleUpdate: "http://10.45.30.100:92/api/Rules/UpdateRules",
  
//   claimCalculate: "http://10.45.30.100:92/api/Claim/CalculateClaimAmount/",
//  claimUpdate: "http://10.45.30.100:92/api/Claim/UpdateClaim?",

//   UsersPath:"http://10.45.30.100:92/api/UserAdministration/GetAllUsers",
//   UserDetailPath:"http://10.45.30.100:92/api/UserAdministration/GetUserDetails/",
//   userAdd:"http://10.45.30.100:92/api/UserAdministration/AddUsers",
//   userTerminate:"http://10.45.30.100:92/api/UserAdministration/TerminateUsers",
//   userChange:"http://10.45.30.100:92/api/UserAdministration/ChangeUsers",
 
//   BatchStatusPath:"http://10.45.30.100:92/api/BatchProcess/GetBatchStatus",
//   BatchProcessPath:"http://10.45.30.100:92/api/BatchProcess/GetBatchProcessDetail/",
//   BatchHistoryPath:"http://10.45.30.100:92/api/BatchProcess/GetBatchProcessHistoryDetail?batchProcessId=",
//   BatchProcessAdd: "http://10.45.30.100:92/api/BatchProcess/AddBatchProcess",
//   BatchProcessUpdate: "http://10.45.30.100:92/api/BatchProcess/UpdateBatchProcess",
//   BatchProcessCalculate: "http://10.45.30.100:92/api/BatchProcess/BatchCalculateClaimAmount?",
//   duplicateBatchProcess: "http://10.45.30.100:92/api/BatchProcess/DuplicateBatchProcess?batchProcessId=",

//   planTires: "http://10.45.30.100:92/api/Plan/GetTiers",
//   planAll: "http://10.45.30.100:92/api/Plan/GetPlanDetails",
//   planAdd: "http://10.45.30.100:92/api/Plan/AddPlan",
//   planUpdate: "http://10.45.30.100:92/api/Plan/UpdatePlan",
//   duplicatePlanId:"http://10.45.30.100:92/api/Plan/DuplicatePlanCode?planCode=", 
//    duplicatePlanName:"http://10.45.30.100:92/api/Plan/DuplicatePlanName?planName=",

//   memberSearch: "http://10.45.30.100:92/api/Member/GetMemberdetail?",
//   memberAdd: "http://10.45.30.100:92/api/Member/AddMember",
//   memberUpdate: "http://10.45.30.100:92/api/Member/UpdateMember",
//     memberAll: "http://10.45.30.100:92/api/Member/GetAllMember",
//     member:"http://10.45.30.100:92/api/Member/GetMemberDetailsByClientId/",
  

//   productAll: "http://10.45.30.100:92/api/Product/GetAllProducts",
//   product: "http://10.45.30.100:92/api/Product/GetProducts?productId=",
//   productAdd: "http://10.45.30.100:92/api/Product/AddProducts",
//   productUpdate:"http://10.45.30.100:92/api/Product/UpdateProduct",
//   productCovertClaims:"http://10.45.30.100:92/api/Product/GetCoveredClaims",
//   duplicateContract: "http://10.45.30.100:92/api/Product/DuplicateContract?contractId=",
//   productByContractPeriod: "http://10.45.30.100:92/api/Product/GetProductByContractPeriod?",

//  ExcelUploadPath: "http://10.45.30.100:92/api/ExcelUpload/UploadExcel?userId=",
  
//   sslReportURL: "http://dwim4-obiee01.qdint.local:9502/analytics/saw.dll?PortalGo&Action=prompt&path=%2Fshared%2FPOC%2FAgg_Claim_Expenese",
//   aslReportURL: "http://dwim4-obiee01.qdint.local:9502/analytics/saw.dll?PortalGo&Action=prompt&path=%2Fshared%2FPOC%2FAgg_Claim_Expenese",
//   maxLiabilityReportURL: "http://dwim4-obiee01.qdint.local:9502/analytics/saw.dll?PortalGo&Action=prompt&path=%2Fshared%2FPOC%2FAgg_Claim_Expenese"

// }

//UAT paths

// export const Paths = {
//   loginPath : "http://10.12.30.40:92/api/Login/UserLogin/",
//   reportPath : "http://10.12.30.40:92/api/Claim/GetClaimReport",
//   claimPath: "http://10.12.30.40:92/api/Claim/GetClaim",
  
  
//   attributes: "http://10.12.30.40:92/api/Attribute/GetAllAttributeID",
//   attribute: "http://10.12.30.40:92/api/Attribute/GetAttributeDetails?attributeId=",
//   attributeAdd: "http://10.12.30.40:92/api/Attribute/AddAttributes", 
//   attributeUpdate: "http://10.12.30.40:92/api/Attribute/UpdateAttributes",
//   attributeGroup: "http://10.12.30.40:92/api/Attribute/GetAttributeGroup",

//   benefits: "http://10.12.30.40:92/api/Benefits/GetAllBenefitsID",
//   benefit: "http://10.12.30.40:92/api/Benefits/GetBenefitsdetail/",
//   benefitAdd: "http://10.12.30.40:92/api/Benefits/AddBenefits",
//   benefitUpdate: "http://10.12.30.40:92/api/Benefits/UpdateBenefits",

//   programs: "http://10.12.30.40:92/api/Programs/GetAllProgramsID",
//   program: "http://10.12.30.40:92/api/Programs/GetProgramDetail/",
//   programAdd: "http://10.12.30.40:92/api/Programs/AddPrograms",
//   programUpdate: "http://10.12.30.40:92/api/Programs/UpdatePrograms",

//   contracts: "http://10.12.30.40:92/api/Contracts/GetAllContractsID/",
//   contractsByClientPath: "http://10.12.30.40:92/api/Contracts/GetAllContractsID/",
//   contract: "http://10.12.30.40:92/api/Contracts/GetContracts/",
//   contractAdd: "http://10.12.30.40:92/api/Contracts/AddContracts",
//   contractUpdate: "http://10.12.30.40:92/api/Contracts/UpdateContracts",
//   contractAll: "http://10.12.30.40:92/api/Contracts/GetAllContracts",
//  contractDateValidation: "http://10.12.30.40:92/api/Contracts/DateValidation/",

//   clients: "http://10.12.30.40:92/api/Clients/LoadClientDetails",
//   client: "http://10.12.30.40:92/api/Clients/GetClientDetails/",
//   clientAdd: "http://10.12.30.40:92/api/Clients/AddClients",
//   clientUpdate: "http://10.12.30.40:92/api/Clients/UpdateClients",
//   getClientDetails: "http://10.12.30.40:92/api/Clients/GetClientDetails/",
//   activeClients:"http://10.12.30.40:92/api/Clients/GetActiveClients",
//   parentClient:"http://10.12.30.40:92/api/Clients/GetParentClient",
//     duplicateClientId: "http://10.12.30.40:92/api/Clients/DuplicateClientID?clientId=",
//     duplicateClientName: "http://10.12.30.40:92/api/Clients/DuplicateClient?client=",



//   roles: "http://10.12.30.40:92/api/Roles/GetAllRoles",
//   role: "http://10.12.30.40:92/api/Roles/GetRolesDetail/",
//   roleAdd: "http://10.12.30.40:92/api/Roles/AddRoles",
//   roleUpdate: "http://10.12.30.40:92/api/Roles/UpdateRoles",

//   rules: "http://10.12.30.40:92/api/Rules/GetAllRuleID",
//   rule: "http://10.12.30.40:92/api/Rules/GetRulesDetails?ruleId=",
//   ruleGroups: "http://10.12.30.40:92/api/Rules/GetRuleGroup", 
//   ruleAdd: "http://10.12.30.40:92/api/Rules/AddRules",
//   ruleUpdate: "http://10.12.30.40:92/api/Rules/UpdateRules",
  
//   claimCalculate: "http://10.12.30.40:92/api/Claim/CalculateClaimAmount/",
//  claimUpdate: "http://10.12.30.40:92/api/Claim/UpdateClaim?",

//   UsersPath:"http://10.12.30.40:92/api/UserAdministration/GetAllUsers",
//   UserDetailPath:"http://10.12.30.40:92/api/UserAdministration/GetUserDetails/",
//   userAdd:"http://10.12.30.40:92/api/UserAdministration/AddUsers",
//   userTerminate:"http://10.12.30.40:92/api/UserAdministration/TerminateUsers",
//   userChange:"http://10.12.30.40:92/api/UserAdministration/ChangeUsers",
 
//   BatchStatusPath:"http://10.12.30.40:92/api/BatchProcess/GetBatchStatus",
//   BatchProcessPath:"http://10.12.30.40:92/api/BatchProcess/GetBatchProcessDetail/",
//   BatchHistoryPath:"http://10.12.30.40:92/api/BatchProcess/GetBatchProcessHistoryDetail?batchProcessId=",
//   BatchProcessAdd: "http://10.12.30.40:92/api/BatchProcess/AddBatchProcess",
//   BatchProcessUpdate: "http://10.12.30.40:92/api/BatchProcess/UpdateBatchProcess",
//   BatchProcessCalculate: "http://10.12.30.40:92/api/BatchProcess/BatchCalculateClaimAmount?",
//   duplicateBatchProcess: "http://10.12.30.40:92/api/BatchProcess/DuplicateBatchProcess?batchProcessId=",

//   planTires: "http://10.12.30.40:92/api/Plan/GetTiers",
//   planAll: "http://10.12.30.40:92/api/Plan/GetPlanDetails",
//   planAdd: "http://10.12.30.40:92/api/Plan/AddPlan",
//   planUpdate: "http://10.12.30.40:92/api/Plan/UpdatePlan",
//   duplicatePlanId:"http://10.12.30.40:92/api/Plan/DuplicatePlanCode?planCode=", 
//    duplicatePlanName:"http://10.12.30.40:92/api/Plan/DuplicatePlanName?planName=",

//   memberSearch: "http://10.12.30.40:92/api/Member/GetMemberdetail?",
//   memberAdd: "http://10.12.30.40:92/api/Member/AddMember",
//   memberUpdate: "http://10.12.30.40:92/api/Member/UpdateMember",
//     memberAll: "http://10.12.30.40:92/api/Member/GetAllMember",
//     member:"http://10.12.30.40:92/api/Member/GetMemberDetailsByClientId/",
  

//   productAll: "http://10.12.30.40:92/api/Product/GetAllProducts",
//   product: "http://10.12.30.40:92/api/Product/GetProducts?productId=",
//   productAdd: "http://10.12.30.40:92/api/Product/AddProducts",
//   productUpdate:"http://10.12.30.40:92/api/Product/UpdateProduct",
//   productCovertClaims:"http://10.12.30.40:92/api/Product/GetCoveredClaims",
//   duplicateContract: "http://10.12.30.40:92/api/Product/DuplicateContract?contractId=",
//   productByContractPeriod: "http://10.12.30.40:92/api/Product/GetProductByContractPeriod?",

//  ExcelUploadPath: "http://10.12.30.40:92/api/ExcelUpload/UploadExcel?userId=",
  
//   sslReportURL: "https://obianalyticsstg.corp.medica.com/analytics",
//   aslReportURL: "https://obianalyticsstg.corp.medica.com/analytics",
//   maxLiabilityReportURL: "https://obianalyticsstg.corp.medica.com/analytics"

// }


// Production Server 1 
// export const Paths = {
//   loginPath : "http://10.10.30.206:92/api/Login/UserLogin/",
//   reportPath : "http://10.10.30.206:92/api/Claim/GetClaimReport",
//   claimPath: "http://10.10.30.206:92/api/Claim/GetClaim",
  
  
  
//   attributes: "http://10.10.30.206:92/api/Attribute/GetAllAttributeID",
//   attribute: "http://10.10.30.206:92/api/Attribute/GetAttributeDetails?attributeId=",
//   attributeAdd: "http://10.10.30.206:92/api/Attribute/AddAttributes", 
//   attributeUpdate: "http://10.10.30.206:92/api/Attribute/UpdateAttributes",
//   attributeGroup: "http://10.10.30.206:92/api/Attribute/GetAttributeGroup",

//   benefits: "http://10.10.30.206:92/api/Benefits/GetAllBenefitsID",
//   benefit: "http://10.10.30.206:92/api/Benefits/GetBenefitsdetail/",
//   benefitAdd: "http://10.10.30.206:92/api/Benefits/AddBenefits",
//   benefitUpdate: "http://10.10.30.206:92/api/Benefits/UpdateBenefits",

//   programs: "http://10.10.30.206:92/api/Programs/GetAllProgramsID",
//   program: "http://10.10.30.206:92/api/Programs/GetProgramDetail/",
//   programAdd: "http://10.10.30.206:92/api/Programs/AddPrograms",
//   programUpdate: "http://10.10.30.206:92/api/Programs/UpdatePrograms",

//   contracts: "http://10.10.30.206:92/api/Contracts/GetAllContractsID/",
//   contractsByClientPath: "http://10.10.30.206:92/api/Contracts/GetAllContractsID/",
//   contract: "http://10.10.30.206:92/api/Contracts/GetContracts/",
//   contractAdd: "http://10.10.30.206:92/api/Contracts/AddContracts",
//   contractUpdate: "http://10.10.30.206:92/api/Contracts/UpdateContracts",
//   contractAll: "http://10.10.30.206:92/api/Contracts/GetAllContracts",
//   contractDateValidation: "http://10.10.30.206:92/api/Contracts/DateValidation/",

//   clients: "http://10.10.30.206:92/api/Clients/LoadClientDetails",
//   client: "http://10.10.30.206:92/api/Clients/GetClientDetails/",
//   clientAdd: "http://10.10.30.206:92/api/Clients/AddClients",
//   clientUpdate: "http://10.10.30.206:92/api/Clients/UpdateClients",
//   getClientDetails: "http://10.10.30.206:92/api/Clients/GetClientDetails/",
//   activeClients:"http://10.10.30.206:92/api/Clients/GetActiveClients",
//   parentClient:"http://10.10.30.206:92/api/Clients/GetParentClient",
//   duplicateClientId: "http://10.10.30.206:92/api/Clients/DuplicateClientID?clientId=",
//   duplicateClientName: "http://10.10.30.206:92/api/Clients/DuplicateClient?client=",


//   roles: "http://10.10.30.206:92/api/Roles/GetAllRoles",
//   role: "http://10.10.30.206:92/api/Roles/GetRolesDetail/",
//   roleAdd: "http://10.10.30.206:92/api/Roles/AddRoles",
//   roleUpdate: "http://10.10.30.206:92/api/Roles/UpdateRoles",

//   rules: "http://10.10.30.206:92/api/Rules/GetAllRuleID",
//   rule: "http://10.10.30.206:92/api/Rules/GetRulesDetails?ruleId=",
//   ruleGroups: "http://10.10.30.206:92/api/Rules/GetRuleGroup", 
//   ruleAdd: "http://10.10.30.206:92/api/Rules/AddRules",
//   ruleUpdate: "http://10.10.30.206:92/api/Rules/UpdateRules",
  
//   claimCalculate: "http://10.10.30.206:92/api/Claim/CalculateClaimAmount/",
//   claimUpdate: "http://10.10.30.206:92/api/Claim/UpdateClaim?",

//   UsersPath:"http://10.10.30.206:92/api/UserAdministration/GetAllUsers",
//   UserDetailPath:"http://10.10.30.206:92/api/UserAdministration/GetUserDetails/",
//   userAdd:"http://10.10.30.206:92/api/UserAdministration/AddUsers",
//   userTerminate:"http://10.10.30.206:92/api/UserAdministration/TerminateUsers",
//   userChange:"http://10.10.30.206:92/api/UserAdministration/ChangeUsers",
 
//   BatchStatusPath:"http://10.10.30.206:92/api/BatchProcess/GetBatchStatus",
//   BatchProcessPath:"http://10.10.30.206:92/api/BatchProcess/GetBatchProcessDetail/",
//   BatchHistoryPath:"http://10.10.30.206:92/api/BatchProcess/GetBatchProcessHistoryDetail?batchProcessId=",
//   BatchProcessAdd: "http://10.10.30.206:92/api/BatchProcess/AddBatchProcess",
//   BatchProcessUpdate: "http://10.10.30.206:92/api/BatchProcess/UpdateBatchProcess",
//   BatchProcessCalculate: "http://10.10.30.206:92/api/BatchProcess/BatchCalculateClaimAmount?",
//   duplicateBatchProcess: "http://10.10.30.206:92/api/BatchProcess/DuplicateBatchProcess?batchProcessId=", 

//   planTires: "http://10.10.30.206:92/api/Plan/GetTiers",
//   planAll: "http://10.10.30.206:92/api/Plan/GetPlanDetails",
//   planAdd: "http://10.10.30.206:92/api/Plan/AddPlan",
//   planUpdate: "http://10.10.30.206:92/api/Plan/UpdatePlan",
//   duplicatePlanId:"http://10.10.30.206:92/api/Plan/DuplicatePlanCode?planCode=", 
//   duplicatePlan:"http://10.10.30.206:92/api/Plan/DuplicatePlanCode?", 
//   duplicatePlanName:"http://10.10.30.206:92/api/Plan/DuplicatePlanName?planName=", 

//   memberSearch: "http://10.10.30.206:92/api/Member/GetMemberdetail?",
//   memberAdd: "http://10.10.30.206:92/api/Member/AddMember",
//   memberUpdate: "http://10.10.30.206:92/api/Member/UpdateMember",
//   memberAll: "http://10.10.30.206:92/api/Member/GetAllMember",
//   member:"http://10.10.30.206:92/api/Member/GetMemberDetailsByClientId/",


//   productAll: "http://10.10.30.206:92/api/Product/GetAllProducts",
//   product: "http://10.10.30.206:92/api/Product/GetProducts?productId=",
//   productAdd: "http://10.10.30.206:92/api/Product/AddProducts",
//   productUpdate:"http://10.10.30.206:92/api/Product/UpdateProduct",
//   productCovertClaims:"http://10.10.30.206:92/api/Product/GetCoveredClaims",
//   duplicateContract: "http://10.10.30.206:92/api/Product/DuplicateContract?contractId=",
//   productByContractPeriod: "http://10.10.30.206:92/api/Product/GetProductByContractPeriod?",

//   ExcelUploadPath: "http://10.10.30.206:92/api/ExcelUpload/UploadExcel?userId=",

//   sslReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FMedica%20SL%2FSpecific%20Report",
//   aslReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fusers%2Fsrajamani%40infinite.com%2FMedica%20SL%2FSpecific%20Report",
//   maxLiabilityReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fusers%2Fsrajamani%40infinite.com%2FMedica%20SL%2FSpecific%20Report",

//   authenticateUser: "http://10.10.30.206:92/api/Login/AuthenticateUser?userName="

// }


// Production Server 2
// export const Paths = {
//   loginPath : "https://10.10.30.207:92/api/Login/UserLogin/",
//   reportPath : "https://10.10.30.207:92/api/Claim/GetClaimReport",
//   claimPath: "https://10.10.30.207:92/api/Claim/GetClaim",
  
  
  
//   attributes: "https://10.10.30.207:92/api/Attribute/GetAllAttributeID",
//   attribute: "https://10.10.30.207:92/api/Attribute/GetAttributeDetails?attributeId=",
//   attributeAdd: "https://10.10.30.207:92/api/Attribute/AddAttributes", 
//   attributeUpdate: "https://10.10.30.207:92/api/Attribute/UpdateAttributes",
//   attributeGroup: "https://10.10.30.207:92/api/Attribute/GetAttributeGroup",

//   benefits: "https://10.10.30.207:92/api/Benefits/GetAllBenefitsID",
//   benefit: "https://10.10.30.207:92/api/Benefits/GetBenefitsdetail/",
//   benefitAdd: "https://10.10.30.207:92/api/Benefits/AddBenefits",
//   benefitUpdate: "https://10.10.30.207:92/api/Benefits/UpdateBenefits",

//   programs: "https://10.10.30.207:92/api/Programs/GetAllProgramsID",
//   program: "https://10.10.30.207:92/api/Programs/GetProgramDetail/",
//   programAdd: "https://10.10.30.207:92/api/Programs/AddPrograms",
//   programUpdate: "https://10.10.30.207:92/api/Programs/UpdatePrograms",

//   contracts: "https://10.10.30.207:92/api/Contracts/GetAllContractsID/",
//   contractsByClientPath: "https://10.10.30.207:92/api/Contracts/GetAllContractsID/",
//   contract: "https://10.10.30.207:92/api/Contracts/GetContracts/",
//   contractAdd: "https://10.10.30.207:92/api/Contracts/AddContracts",
//   contractUpdate: "https://10.10.30.207:92/api/Contracts/UpdateContracts",
//   contractAll: "https://10.10.30.207:92/api/Contracts/GetAllContracts",
//   contractDateValidation: "https://10.10.30.207:92/api/Contracts/DateValidation/",

//   clients: "https://10.10.30.207:92/api/Clients/LoadClientDetails",
//   client: "https://10.10.30.207:92/api/Clients/GetClientDetails/",
//   clientAdd: "https://10.10.30.207:92/api/Clients/AddClients",
//   clientUpdate: "https://10.10.30.207:92/api/Clients/UpdateClients",
//   getClientDetails: "https://10.10.30.207:92/api/Clients/GetClientDetails/",
//   activeClients:"https://10.10.30.207:92/api/Clients/GetActiveClients",
//   parentClient:"https://10.10.30.207:92/api/Clients/GetParentClient",
//   duplicateClientId: "https://10.10.30.207:92/api/Clients/DuplicateClientID?clientId=",
//   duplicateClientName: "https://10.10.30.207:92/api/Clients/DuplicateClient?client=",


//   roles: "https://10.10.30.207:92/api/Roles/GetAllRoles",
//   role: "https://10.10.30.207:92/api/Roles/GetRolesDetail/",
//   roleAdd: "https://10.10.30.207:92/api/Roles/AddRoles",
//   roleUpdate: "https://10.10.30.207:92/api/Roles/UpdateRoles",

//   rules: "https://10.10.30.207:92/api/Rules/GetAllRuleID",
//   rule: "https://10.10.30.207:92/api/Rules/GetRulesDetails?ruleId=",
//   ruleGroups: "https://10.10.30.207:92/api/Rules/GetRuleGroup", 
//   ruleAdd: "https://10.10.30.207:92/api/Rules/AddRules",
//   ruleUpdate: "https://10.10.30.207:92/api/Rules/UpdateRules",
  
//   claimCalculate: "https://10.10.30.207:92/api/Claim/CalculateClaimAmount/",
//   claimUpdate: "https://10.10.30.207:92/api/Claim/UpdateClaim?",

//   UsersPath:"https://10.10.30.207:92/api/UserAdministration/GetAllUsers",
//   UserDetailPath:"https://10.10.30.207:92/api/UserAdministration/GetUserDetails/",
//   userAdd:"https://10.10.30.207:92/api/UserAdministration/AddUsers",
//   userTerminate:"https://10.10.30.207:92/api/UserAdministration/TerminateUsers",
//   userChange:"https://10.10.30.207:92/api/UserAdministration/ChangeUsers",
 
//   BatchStatusPath:"https://10.10.30.207:92/api/BatchProcess/GetBatchStatus",
//   BatchProcessPath:"https://10.10.30.207:92/api/BatchProcess/GetBatchProcessDetail/",
//   BatchHistoryPath:"https://10.10.30.207:92/api/BatchProcess/GetBatchProcessHistoryDetail?batchProcessId=",
//   BatchProcessAdd: "https://10.10.30.207:92/api/BatchProcess/AddBatchProcess",
//   BatchProcessUpdate: "https://10.10.30.207:92/api/BatchProcess/UpdateBatchProcess",
//   BatchProcessCalculate: "https://10.10.30.207:92/api/BatchProcess/BatchCalculateClaimAmount?",
//   duplicateBatchProcess: "https://10.10.30.207:92/api/BatchProcess/DuplicateBatchProcess?batchProcessId=", 

//   planTires: "https://10.10.30.207:92/api/Plan/GetTiers",
//   planAll: "https://10.10.30.207:92/api/Plan/GetPlanDetails",
//   planAdd: "https://10.10.30.207:92/api/Plan/AddPlan",
//   planUpdate: "https://10.10.30.207:92/api/Plan/UpdatePlan",
//   duplicatePlanId:"https://10.10.30.207:92/api/Plan/DuplicatePlanCode?planCode=", 
//   duplicatePlan:"https://10.10.30.207:92/api/Plan/DuplicatePlanCode?", 
//   duplicatePlanName:"https://10.10.30.207:92/api/Plan/DuplicatePlanName?planName=", 

//   memberSearch: "https://10.10.30.207:92/api/Member/GetMemberdetail?",
//   memberAdd: "https://10.10.30.207:92/api/Member/AddMember",
//   memberUpdate: "https://10.10.30.207:92/api/Member/UpdateMember",
//   memberAll: "https://10.10.30.207:92/api/Member/GetAllMember",
//   member:"https://10.10.30.207:92/api/Member/GetMemberDetailsByClientId/",


//   productAll: "https://10.10.30.207:92/api/Product/GetAllProducts",
//   product: "https://10.10.30.207:92/api/Product/GetProducts?productId=",
//   productAdd: "https://10.10.30.207:92/api/Product/AddProducts",
//   productUpdate:"https://10.10.30.207:92/api/Product/UpdateProduct",
//   productCovertClaims:"https://10.10.30.207:92/api/Product/GetCoveredClaims",
//   duplicateContract: "https://10.10.30.207:92/api/Product/DuplicateContract?contractId=",
//   productByContractPeriod: "https://10.10.30.207:92/api/Product/GetProductByContractPeriod?",

//   ExcelUploadPath: "https://10.10.30.207:92/api/ExcelUpload/UploadExcel?userId=",

//   sslReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FMedica%20SL%2FSpecific%20Report",
//   aslReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fusers%2Fsrajamani%40infinite.com%2FMedica%20SL%2FSpecific%20Report",
//   maxLiabilityReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fusers%2Fsrajamani%40infinite.com%2FMedica%20SL%2FSpecific%20Report",

//   authenticateUser: "https://10.10.30.207:92/api/Login/AuthenticateUser?userName="

// }
