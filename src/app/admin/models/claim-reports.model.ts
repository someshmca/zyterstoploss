export interface IClaimReportsModel{
        billId: string;
        claimId: string;
        providerName: string;
        memberName: string;
        converted: boolean;
        billed: number;
        memberId: string;
        hccamount: number;
        allowed: number;
        capitated: boolean;
        lastChanged: Date;
        workSheetState: string
}