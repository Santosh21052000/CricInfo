const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const request = require("request");
const cheerio = require("cheerio");
const fs=require('fs');
const path=require('path');

const iplpath=path.join(__dirname,"ipl");
dircreater(iplpath);

const allmatchobject = require('./allmatches');

//for home page
request(url, cb);
function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        extractlink(html);
    }
}

function extractlink(html) {
    let $ = cheerio.load(html);
    //attribute ke help se humlog link la sakte hai
    let a = $("a[data-hover='View All Results']");
    let link = a.attr("href");
    let fulllink = "https://www.espncricinfo.com" + link;
    //    console.log(fulllink);
    allmatchobject.getallmatches(fulllink);
    
}

function dircreater(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath);
    }
}

