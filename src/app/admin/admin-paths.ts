// for Azure 
// export const Paths = {
//   loginPath : "https://medicaslapiorc.azurewebsites.net/api/Login/UserLogin/",
//   reportPath : "https://medicaslapiorc.azurewebsites.net/api/Claim/GetClaimReport",
//   claimPath: "https://medicaslapiorc.azurewebsites.net/api/Claim/GetClaim",
  
  
  
//   attributes: "https://medicaslapiorc.azurewebsites.net/api/Attribute/GetAllAttributeID",
//   attribute: "https://medicaslapiorc.azurewebsites.net/api/Attribute/GetAttributeDetails?attributeId=",
//   attributeAdd: "https://medicaslapiorc.azurewebsites.net/api/Attribute/AddAttributes", 
//   attributeUpdate: "https://medicaslapiorc.azurewebsites.net/api/Attribute/UpdateAttributes",
//   attributeGroup: "https://medicaslapiorc.azurewebsites.net/api/Attribute/GetAttributeGroup",

//   benefits: "https://medicaslapiorc.azurewebsites.net/api/Benefits/GetAllBenefitsID",
//   benefit: "https://medicaslapiorc.azurewebsites.net/api/Benefits/GetBenefitsdetail/",
//   benefitAdd: "https://medicaslapiorc.azurewebsites.net/api/Benefits/AddBenefits",
//   benefitUpdate: "https://medicaslapiorc.azurewebsites.net/api/Benefits/UpdateBenefits",

//   programs: "https://medicaslapiorc.azurewebsites.net/api/Programs/GetAllProgramsID",
//   program: "https://medicaslapiorc.azurewebsites.net/api/Programs/GetProgramDetail/",
//   programAdd: "https://medicaslapiorc.azurewebsites.net/api/Programs/AddPrograms",
//   programUpdate: "https://medicaslapiorc.azurewebsites.net/api/Programs/UpdatePrograms",

//   contracts: "https://medicaslapiorc.azurewebsites.net/api/Contracts/GetAllContractsID/",
//   contractsByClientPath: "https://medicaslapiorc.azurewebsites.net/api/Contracts/GetAllContractsID/",
//   contract: "https://medicaslapiorc.azurewebsites.net/api/Contracts/GetContracts/",
//   contractAdd: "https://medicaslapiorc.azurewebsites.net/api/Contracts/AddContracts",
//   contractUpdate: "https://medicaslapiorc.azurewebsites.net/api/Contracts/UpdateContracts",
//   contractAll: "https://medicaslapiorc.azurewebsites.net/api/Contracts/GetAllContracts",
//   contractDateValidation: "https://medicaslapiorc.azurewebsites.net/api/Contracts/DateValidation/",

//   clients: "https://medicaslapiorc.azurewebsites.net/api/Clients/LoadClientDetails",
//   client: "https://medicaslapiorc.azurewebsites.net/api/Clients/GetClientDetails/",
//   clientAdd: "https://medicaslapiorc.azurewebsites.net/api/Clients/AddClients",
//   clientUpdate: "https://medicaslapiorc.azurewebsites.net/api/Clients/UpdateClients",
//   getClientDetails: "https://medicaslapiorc.azurewebsites.net/api/Clients/GetClientDetails/",
//   activeClients:"https://medicaslapiorc.azurewebsites.net/api/Clients/GetActiveClients",
//   parentClient:"https://medicaslapiorc.azurewebsites.net/api/Clients/GetParentClient",
//   duplicateClientId: "https://medicaslapiorc.azurewebsites.net/api/Clients/DuplicateClientID?clientId=",
//   duplicateClientName: "https://medicaslapiorc.azurewebsites.net/api/Clients/DuplicateClient?client=",


//   roles: "https://medicaslapiorc.azurewebsites.net/api/Roles/GetAllRoles",
//   role: "https://medicaslapiorc.azurewebsites.net/api/Roles/GetRolesDetail/",
//   roleAdd: "https://medicaslapiorc.azurewebsites.net/api/Roles/AddRoles",
//   roleUpdate: "https://medicaslapiorc.azurewebsites.net/api/Roles/UpdateRoles",

//   rules: "https://medicaslapiorc.azurewebsites.net/api/Rules/GetAllRuleID",
//   rule: "https://medicaslapiorc.azurewebsites.net/api/Rules/GetRulesDetails?ruleId=",
//   ruleGroups: "https://medicaslapiorc.azurewebsites.net/api/Rules/GetRuleGroup", 
//   ruleAdd: "https://medicaslapiorc.azurewebsites.net/api/Rules/AddRules",
//   ruleUpdate: "https://medicaslapiorc.azurewebsites.net/api/Rules/UpdateRules",
  
//   claimCalculate: "https://medicaslapiorc.azurewebsites.net/api/Claim/CalculateClaimAmount/",
//   claimUpdate: "https://medicaslapiorc.azurewebsites.net/api/Claim/UpdateClaim?",

//   UsersPath:"https://medicaslapiorc.azurewebsites.net/api/UserAdministration/GetAllUsers",
//   UserDetailPath:"https://medicaslapiorc.azurewebsites.net/api/UserAdministration/GetUserDetails/",
//   userAdd:"https://medicaslapiorc.azurewebsites.net/api/UserAdministration/AddUsers",
//   userTerminate:"https://medicaslapiorc.azurewebsites.net/api/UserAdministration/TerminateUsers",
//   userChange:"https://medicaslapiorc.azurewebsites.net/api/UserAdministration/ChangeUsers",
 
//   BatchStatusPath:"https://medicaslapiorc.azurewebsites.net/api/BatchProcess/GetBatchStatus",
//   BatchProcessPath:"https://medicaslapiorc.azurewebsites.net/api/BatchProcess/GetBatchProcessDetail/",
//   BatchHistoryPath:"https://medicaslapiorc.azurewebsites.net/api/BatchProcess/GetBatchProcessHistoryDetail?batchProcessId=",
//   BatchProcessAdd: "https://medicaslapiorc.azurewebsites.net/api/BatchProcess/AddBatchProcess",
//   BatchProcessUpdate: "https://medicaslapiorc.azurewebsites.net/api/BatchProcess/UpdateBatchProcess",
//   BatchProcessCalculate: "https://medicaslapiorc.azurewebsites.net/api/BatchProcess/BatchCalculateClaimAmount?",
//   duplicateBatchProcess: "https://medicaslapiorc.azurewebsites.net/api/BatchProcess/DuplicateBatchProcess?batchProcessId=", 

//   planTires: "https://medicaslapiorc.azurewebsites.net/api/Plan/GetTiers",
//   planAll: "https://medicaslapiorc.azurewebsites.net/api/Plan/GetPlanDetails",
//   planAdd: "https://medicaslapiorc.azurewebsites.net/api/Plan/AddPlan",
//   planUpdate: "https://medicaslapiorc.azurewebsites.net/api/Plan/UpdatePlan",
//   duplicatePlanId:"https://medicaslapiorc.azurewebsites.net/api/Plan/DuplicatePlanCode?planCode=", 
//   duplicatePlanName:"https://medicaslapiorc.azurewebsites.net/api/Plan/DuplicatePlanName?planName=", 

//   memberSearch: "https://medicaslapiorc.azurewebsites.net/api/Member/GetMemberdetail?",
//   memberAdd: "https://medicaslapiorc.azurewebsites.net/api/Member/AddMember",
//   memberUpdate: "https://medicaslapiorc.azurewebsites.net/api/Member/UpdateMember",
//   memberAll: "https://medicaslapiorc.azurewebsites.net/api/Member/GetAllMember",
//   member:"https://medicaslapiorc.azurewebsites.net/api/Member/GetMemberDetailsByClientId/",


//   productAll: "https://medicaslapiorc.azurewebsites.net/api/Product/GetAllProducts",
//   product: "https://medicaslapiorc.azurewebsites.net/api/Product/GetProducts?productId=",
//   productAdd: "https://medicaslapiorc.azurewebsites.net/api/Product/AddProducts",
//   productUpdate:"https://medicaslapiorc.azurewebsites.net/api/Product/UpdateProduct",
//   productCovertClaims:"https://medicaslapiorc.azurewebsites.net/api/Product/GetCoveredClaims",
//   duplicateContract: "https://medicaslapiorc.azurewebsites.net/api/Product/DuplicateContract?contractId=",
//   productByContractPeriod: "https://medicaslapiorc.azurewebsites.net/api/Product/GetProductByContractPeriod?",

//   ExcelUploadPath: "https://medicaslapiorc.azurewebsites.net/api/ExcelUpload/UploadExcel?userId=",

//   sslReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FMedica%20SL%2FSpecific%20Report",
//   aslReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fusers%2Fsrajamani%40infinite.com%2FMedica%20SL%2FSpecific%20Report",
//   maxLiabilityReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fusers%2Fsrajamani%40infinite.com%2FMedica%20SL%2FSpecific%20Report",

//   authenticateUser: "https://medicaslapiorc.azurewebsites.net/api/Login/AuthenticateUser?userName="

// }

// for Medica Dev 

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
 contractDateValidation: "http://10.48.30.158:92/api/Contracts/DateValidation/",

  clients: "http://10.48.30.158:92/api/Clients/LoadClientDetails",
  client: "http://10.48.30.158:92/api/Clients/GetClientDetails/",
  clientAdd: "http://10.48.30.158:92/api/Clients/AddClients",
  clientUpdate: "http://10.48.30.158:92/api/Clients/UpdateClients",
  getClientDetails: "http://10.48.30.158:92/api/Clients/GetClientDetails/",
  activeClients:"http://10.48.30.158:92/api/Clients/GetActiveClients",
  parentClient:"http://10.48.30.158:92/api/Clients/GetParentClient",
    duplicateClientId: "http://10.48.30.158:92/api/Clients/DuplicateClientID?clientId=",
    duplicateClientName: "http://10.48.30.158:92/api/Clients/DuplicateClient?client=",



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
 claimUpdate: "http://10.48.30.158:92/api/Claim/UpdateClaim?",

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
  duplicateBatchProcess: "http://10.48.30.158:92/api/BatchProcess/DuplicateBatchProcess?batchProcessId=",

  planTires: "http://10.48.30.158:92/api/Plan/GetTiers",
  planAll: "http://10.48.30.158:92/api/Plan/GetPlanDetails",
  planAdd: "http://10.48.30.158:92/api/Plan/AddPlan",
  planUpdate: "http://10.48.30.158:92/api/Plan/UpdatePlan",
  duplicatePlanId:"http://10.48.30.158:92/api/Plan/DuplicatePlanCode?planCode=", 
   duplicatePlanName:"http://10.48.30.158:92/api/Plan/DuplicatePlanName?planName=",

  memberSearch: "http://10.48.30.158:92/api/Member/GetMemberdetail?",
  memberAdd: "http://10.48.30.158:92/api/Member/AddMember",
  memberUpdate: "http://10.48.30.158:92/api/Member/UpdateMember",
    memberAll: "http://10.48.30.158:92/api/Member/GetAllMember",
    member:"http://10.48.30.158:92/api/Member/GetMemberDetailsByClientId/",
  

  productAll: "http://10.48.30.158:92/api/Product/GetAllProducts",
  product: "http://10.48.30.158:92/api/Product/GetProducts?productId=",
  productAdd: "http://10.48.30.158:92/api/Product/AddProducts",
  productUpdate:"http://10.48.30.158:92/api/Product/UpdateProduct",
  productCovertClaims:"http://10.48.30.158:92/api/Product/GetCoveredClaims",
  duplicateContract: "http://10.48.30.158:92/api/Product/DuplicateContract?contractId=",
  productByContractPeriod: "http://10.48.30.158:92/api/Product/GetProductByContractPeriod?",

 ExcelUploadPath: "http://10.48.30.158:92/api/ExcelUpload/UploadExcel?userId=",
  
  sslReportURL: "http://dwim4-obiee01.qdint.local:9502/analytics/saw.dll?PortalGo&Action=prompt&path=%2Fshared%2FPOC%2FAgg_Claim_Expenese",
  aslReportURL: "http://dwim4-obiee01.qdint.local:9502/analytics/saw.dll?PortalGo&Action=prompt&path=%2Fshared%2FPOC%2FAgg_Claim_Expenese",
  maxLiabilityReportURL: "http://dwim4-obiee01.qdint.local:9502/analytics/saw.dll?PortalGo&Action=prompt&path=%2Fshared%2FPOC%2FAgg_Claim_Expenese"

}


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
//   contractDateValidation: "http://10.45.30.100:92/api/Contracts/DateValidation/",

//   clients: "http://10.45.30.100:92/api/Clients/LoadClientDetails",
//   client: "http://10.45.30.100:92/api/Clients/GetClientDetails/",
//   clientAdd: "http://10.45.30.100:92/api/Clients/AddClients",
//   clientUpdate: "http://10.45.30.100:92/api/Clients/UpdateClients",
//   getClientDetails: "http://10.45.30.100:92/api/Clients/GetClientDetails/",
//   activeClients:"http://10.45.30.100:92/api/Clients/GetActiveClients",
//   parentClient:"http://10.45.30.100:92/api/Clients/GetParentClient",
//   duplicateClientId: "http://10.45.30.100:92/api/Clients/DuplicateClientID?clientId=",
//   duplicateClientName: "http://10.45.30.100:92/api/Clients/DuplicateClient?client=",


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
//   duplicatePlanName:"http://10.45.30.100:92/api/Plan/DuplicatePlanName?planName=", 

//   memberSearch: "http://10.45.30.100:92/api/Member/GetMemberdetail?",
//   memberAdd: "http://10.45.30.100:92/api/Member/AddMember",
//   memberUpdate: "http://10.45.30.100:92/api/Member/UpdateMember",
//   memberAll: "http://10.45.30.100:92/api/Member/GetAllMember",
//   member:"http://10.45.30.100:92/api/Member/GetMemberDetailsByClientId/",


//   productAll: "http://10.45.30.100:92/api/Product/GetAllProducts",
//   product: "http://10.45.30.100:92/api/Product/GetProducts?productId=",
//   productAdd: "http://10.45.30.100:92/api/Product/AddProducts",
//   productUpdate:"http://10.45.30.100:92/api/Product/UpdateProduct",
//   productCovertClaims:"http://10.45.30.100:92/api/Product/GetCoveredClaims",

//   ExcelUploadPath: "http://10.45.30.100:92/api/ExcelUpload/UploadExcel?userId=",

//   sslReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fshared%2FMedica%20SL%2FSpecific%20Report",
//   aslReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fusers%2Fsrajamani%40infinite.com%2FMedica%20SL%2FSpecific%20Report",
//   maxLiabilityReportURL: "https://medicaanalytics-axw4of8ufwa4-hy.analytics.ocp.oraclecloud.com/ui/dv/ui/project.jsp?pageid=visualAnalyzer&reportmode=full&reportpath=%2F%40Catalog%2Fusers%2Fsrajamani%40infinite.com%2FMedica%20SL%2FSpecific%20Report",

//   authenticateUser: "http://10.45.30.100:92/api/Login/AuthenticateUser?userName="

// }

