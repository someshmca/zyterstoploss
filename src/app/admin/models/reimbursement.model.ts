export interface IReimbursement
{
    slReimbursementId: number,
  requestStartDate: string,
  slGrpId: string,
  requestEndDate: string,
  slCategoryReport: string,
  slFrequencyType: string,
  slReimbursementMinAmt: number,
  slReimbursementMaxAmt: number,
  slApprovalInd: string,
  slReimbursementSeqId: number,
  slFundingRequestDate:string

}
export interface IReimbursementSearch
{
    slReimbursementId: number,
  requestStartDate: string,
  slGrpId: string,
  requestEndDate: string,
  slCategoryReport: string,
  slFrequencyType: string,
  slReimbursementMinAmt: number,
  slReimbursementMaxAmt: number,
  slApprovalInd: string,
  slReimbursementSeqId: number,
  slFundingRequestDate:string

}
export interface IReimbursementReportsModel{
  slReimbursementId: number,
  requestStartDate: string,
  slGrpId: string,
  requestEndDate: string,
  slCategoryReport: string,
  slFrequencyType: string,
  slReimbursementMinAmt: number,
  slReimbursementMaxAmt: number,
  slApprovalInd: string,
  slReimbursementSeqId: number,
  slFundingRequestDate:string,


}
export interface IReimbursementUpdate{
  slReimbursementId:number;
  slApprovalInd:string;
  slReasonText:string;
  userId:string;



}


export interface IReimbursementAdd{

slReimbursementId: number,
  slGrpId: string,
  slFundingRequestDate: String,
  slCategoryReport: string,
  slFrequencyType: string,
  slReimbursementAmt: number,
  slApprovalInd: string,
  insertUser: string,
  updateUser: string,
  insertTs: String,
  updateTs: String,
  slReimbursementSeqId: number,
  slReasonText: string,
  slDwPullTs: String
}
