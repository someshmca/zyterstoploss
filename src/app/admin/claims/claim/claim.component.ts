import { Component, OnInit } from '@angular/core';
import {ClaimService} from '../../services/claim.service';
import {IClaim} from '../../models/claim-model';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {

  claimData: IClaim;
  claimid : string;
  MemberID: any;
  isJobBatch: any = 0;
  //isCalculateClicked: boolean = false;
  stopLossAmount: number;
  constructor(private _claimService: ClaimService){

  }

 ngOnInit(){
    this._claimService.selectedClaimID.subscribe((no) => {
      this.claimid = no;
    })
    this.getClaim(this.claimid);
 }
  getClaim(id:string){
    this._claimService.setClaimId(id);                  
   // console.log("selected claim id  : "+this._claimService.selectedClaimID);
    this._claimService.getClaim(id).subscribe((data)=> {
      this.claimData = data;
      this.MemberID = this.claimData.memberId;
      
      console.log("claim page data "+this.claimData);
      this.stopLossAmount = this.claimData.stopLossAmount;
     // 
    })
    //
  }
 calculateClaimAmount(){
    console.log("Claim ID in cal func : "+this.claimid);
    
    
    this.getClaim(this.claimid);
  
    this._claimService.calculateClaimAmount(this.MemberID, this.isJobBatch).subscribe((data)=> {
      
      //this.isCalculateClicked = true;
      this.stopLossAmount = data.stopLossAmount;
      console.log("calc stoploss amount kj : "+this.stopLossAmount);
    }) 
  }

  
  refreshClaim(){
    //this.isCalculateClicked = false;
  }

}
