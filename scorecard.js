// const url="https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const request =require("request");
const cheerio=require("cheerio");
const path=require('path');
const fs=require('fs');
const xlsx=require('xlsx');

function processscorecard(url){
    request(url,cb);
}
// data format
//ipl
   //team
    //    player
        //   name runs ball four six sr opponent venue date result

//for home page

function cb(err,response,html){
     if(err){
         console.log(err);
     }else{
        extractmatchdetail(html);
     }
}

function extractmatchdetail(html){
    // result= .event .status-text
    // venue date= .header-info .description
    let $=cheerio.load(html);
    let description=$('.header-info .description');
    let result=$('.event .status-text');
    // console.log(description.text());
    // console.log(result.text());
    let arrstr=description.text().split(",");
    let venue=arrstr[1].trim();
    let date=arrstr[2].trim();
    let won=result.text();

    let innings=$('.card.content-block.match-scorecard-table>.Collapsible');
    // let htmlstr="";
    for(let i=0;i<innings.length;i++){
        // htmlstr= $(innings[i]).html();
        let teamname= $(innings[i]).find('h5').text();
        teamname=teamname.split('INNINGS')[0].trim();
        
        let opponentindex= i==0 ? 1 : 0;
        let opponentname= $(innings[opponentindex]).find('h5').text();
        opponentname=opponentname.split('INNINGS')[0].trim();
        console.log(`${venue} | ${date} | ${teamname} VS ${opponentname} | ${won}`);
        let cinning =  $(innings[i]);
        let allrows=cinning.find('.table.batsman tbody tr');
        for(let j=0;j<allrows.length;j++){
            let allcols = $(allrows[j]).find('td');
            let isworthy =$(allcols[0]).hasClass('batsman-cell');
            if(isworthy==true){
              let pname= $(allcols[0]).text().trim();
              let prun= $(allcols[2]).text().trim();
              let pball= $(allcols[3]).text().trim();
              let pfour= $(allcols[5]).text().trim();
              let psix= $(allcols[6]).text().trim();
              let pstrikerate= $(allcols[7]).text().trim();
              console.log(`${pname} | ${prun} | ${pball} | ${pfour} | ${psix} | ${pstrikerate}` );
              processplayer(teamname,pname,prun,pball,pfour,psix,pstrikerate,venue,date,opponentname,won);
            }
        }
    }
    // console.log(htmlstr);
}

function processplayer(teamname,pname,prun,pball,pfour,psix,pstrikerate,venue,date,opponentname,won){
   let teampath=path.join(__dirname,"ipl",teamname);
   dircreater(teampath);
   let filepath=path.join(teampath,pname+".xlsx");
   let content=excelReader(filepath,pname);
   let playerobj={
    //    "teamname":teamname
        teamname,//for same name key value pair
        pname,
        prun,
        pball,
        pfour,
        psix,
        pstrikerate,
        venue,
        date,
        opponentname,
        won
   }
   content.push(playerobj);
   excelWriter(filepath,content,pname);
}

function dircreater(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath);
    }
}

function excelWriter(filePath, json, sheetName) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}
// // json data -> excel format convert
// // -> newwb , ws , sheet name
// // filePath
// read 
//  workbook get
function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports={
    ps:processscorecard
}