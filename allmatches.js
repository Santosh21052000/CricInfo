const request =require("request");
const cheerio=require("cheerio");

const scorecardobj=require('./scorecard');


//for all matches page

function getallmatcheslink(url){
    request(url,function (err,response,html){
        if(err){
            console.log(err);
        }else{
           extractlinks(html);
        }
    })
}

function extractlinks(html){
    let $= cheerio.load(html);
    let scorecards=$("a[data-hover='Scorecard']");
    for(let i=0;i<scorecards.length;i++){
       let link= $(scorecards[i]).attr('href');
       let fulllink="https://www.espncricinfo.com/"+link;
       console.log(fulllink);
       scorecardobj.ps(fulllink);
    }
}

module.exports={
    getallmatches : getallmatcheslink
}