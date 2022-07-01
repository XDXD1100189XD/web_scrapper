const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results";
const path=require('path');

const request=require('request');
const cheerio=require('cheerio');
const scoreCardObj=require('./scorecard');
const fs= require('fs');
request(url,cb);
const filePath=path.join(__dirname,"ipl");
dirCreator(filePath);
function cb(err,request,html){
    if(err){
        console.log(err);
    }
    else{
        //console.log(html);
        extract(html);
    }

}
function extract(html){
    let $=cheerio.load(html);
    //let anchorElem= $('a.ds-block.ds-text-center.ds-uppercase.ds-text-ui-typo-primary.ds-underline-offset-4.hover:ds-underline.hover:ds-decoration-ui-stroke-primary.ds-block');
    //let link=anchorElem.attr('href');
    let anchor=[];
    $('a').each(function(index,element){
        if($(element).text()=="Scorecard")anchor.push(element);

    });
    //anchor.filter()
    //console.log(anchor);
    for(let i=0;i<anchor.length;i++){
        let link=$(anchor[i]).attr('href');
        let fullLink="https://www.espncricinfo.com"+link;
        //console.log(fullLink);
        //scorecard(fullLink);
        scoreCardObj.pb(fullLink)
    }

}

function scoreCard(url){
   request(url,cb)   
}
function dirCreator(filePath){
    if(!fs.existsSync(filePath)){
        fs.mkdirSync(filePath);
    }
}