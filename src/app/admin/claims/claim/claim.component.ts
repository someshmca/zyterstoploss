import { Component, OnInit } from '@angular/core';
import {ClaimService} from '../../services/claim.service';
import {IClaim} from '../../models/claim-model';
import {Router} from '@angular/router';

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
  stopLossAmount: any;
  locIsUnlimited: boolean;
  constructor(private _claimService: ClaimService, private router: Router){

  }

 ngOnInit(){
    this._claimService.selectedClaimID.subscribe((no) => {
      this.claimid = no;
    });
    setTimeout(()=>{
      this.getClaim(this.claimid);
    },600);
 }
  getClaim(id:string){
    this._claimService.setClaimId(id);                  
   // console.log("selected claim id  : "+this._claimService.selectedClaimID);
    this._claimService.getClaim(id).subscribe((data)=> {
      this.claimData = data;
      
      this.MemberID = this.claimData.memberId;
      this.locIsUnlimited = this.claimData.isUnlimited=='Y'?true:false;
      console.log("claim page data "+this.claimData);
      this.stopLossAmount = this.claimData.stopLossAmount;
     // 
    })
    //
  }
  goBackClaimSearch(){
    this.router.navigate(['/claim-search']);
  }
 calculateClaimAmount(){
    console.log("Claim ID in cal func : "+this.claimid);
    
    
    this.getClaim(this.claimid);
  
    this._claimService.calculateClaimAmount(this.MemberID).subscribe((data:any)=> {
      
      //this.isCalculateClicked = true; 
      this.stopLossAmount = data.stopLossAmount;
      
      console.log("calc stoploss amount kj : "+this.stopLossAmount);
    }) 
  }

  
  refreshClaim(){
    //this.isCalculateClicked = false;
  }

}
