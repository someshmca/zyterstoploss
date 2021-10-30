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
