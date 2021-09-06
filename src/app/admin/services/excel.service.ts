import { Injectable } from '@angular/core';
import { Color } from 'ag-grid-community';
import { Workbook } from 'exceljs'; 
import * as fs from 'file-saver';

import * as FileSaver from 'file-saver';
import { type } from 'os';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx'

@Injectable({
  providedIn: 'root'
})

export class ExcelService {
   

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
   const  headersArray = ['memberHrid','alternateId',	'clientId','contractId','planId','fname','lname','mname','dateOfBirth',	'gender',	'memberStartDate','memberEndDate','subscriberId',	'subscriberFname','subscriberLname','laserValue','userId','clientName','subscriberStartDate','subscriberEndDate','tier','benefitPlanId'];
    const data = json;

    const header1=['Medica Member ID','Alternate Member ID','Account ID','Contract ID','Plan ID','Member First Name','Member Last Name','Member Middle Name','Birth Date','Gender',
     'Member Start Date','Member End Date','Medica Subscriber ID','Subscriber First Name','Subscriber Last Name',
     'Laser Value','User Id','Account Name','Subscriber Start Date','Subscriber End Date','Coverage Tier','Medica Benefit Plan ID']

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(excelFileName);
    let headerRow = worksheet.addRow(header1);
    //let color = 'FF9999';
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',   
        fgColor: { argb:'000099'},
        bgColor: { argb: '000099' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.font={color:{argb:'FFFFFF'}, bold: false,name: 'Calibri'}
    })
    let altIdx=0;
    data.forEach((element) => {
      let eachRow = [];
      headersArray.forEach((headers) => {
        eachRow.push(element[headers]);  
        
      })     

      if (element.isDeleted === "Y") {
        let deletedRow = worksheet.addRow(eachRow);
        deletedRow.eachCell((cell, number) => {
          cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, strike: true };
        })
      } else {
        worksheet.addRow(eachRow);
      }
    })
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 25;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 20;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 15;
    worksheet.getColumn(17).width = 15;
    worksheet.getColumn(18).width = 15;
    worksheet.getColumn(19).width = 20;
    worksheet.getColumn(20).width = 20;
    worksheet.getColumn(21).width = 15;
    worksheet.getColumn(22).width = 30;

    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, excelFileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
  }
  public exportAsExcelFileClaim(json: any[], excelFileName: string): void {
   const  headersArray = ['claimId','clientId','clientName','memberId','firstName','lastName','minPaidAmount','maxPaidAmount','climReceivedOn','paidDate','dateOfBirth','serviceStartDate','serviceEndDate','sequenceNumber','diagnosisCode','claimSource','claimType','alternateId','subscriberFirstName','subscriberLastName'];
    const data = json;
    const header1=['Medica Claim ID','Account ID','Account Name','Medica Member ID','First Name','Last Name','Min Paid Amount','Max Paid Amount','Claim Received On','Paid Date','Birth Date','Service Start Date','Service End Date','Sequence Number','Diagnosis Code','Claim Source','Claim Type','Alternate Member ID','Subscriber First Name','Subscriber Last Name'];
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(excelFileName);
    //Add Header Row
    let headerRow = worksheet.addRow(header1);
    // Cell Style : Fill and Border
    let color = 'FF9999';
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb:'000099'},
        bgColor: { argb: '000099' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.font={color:{argb:'FFFFFF'}, bold: false,name: 'Calibri'}
    })
    let altIdx=0;
    data.forEach((element) => {
      let eachRow = [];
      headersArray.forEach((headers) => {
        eachRow.push(element[headers])   
      })
    
      if (element.isDeleted === "Y") {
        let deletedRow = worksheet.addRow(eachRow);
        deletedRow.eachCell((cell, number) => {
          cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, strike: true };
        })
      } else {
        worksheet.addRow(eachRow);
      }
    })
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 25;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 20;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 20;
    worksheet.getColumn(17).width = 15;
    worksheet.getColumn(18).width = 20;
    worksheet.getColumn(19).width = 20;
    worksheet.getColumn(20).width = 20;
    
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, excelFileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    })
  }

}
