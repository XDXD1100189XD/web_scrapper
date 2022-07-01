//const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
const path=require('path');
const fs=require('fs');
const request=require('request');
const cheerio=require('cheerio');
const xlsx=require('xlsx');
//const { arrayBuffer } = require('stream/consumers');
function processScoreCards(url){
    request(url,cb);
}


function cb(err,request,html){
    if(err){
        console.log(err);
    }
    else{
        //console.log(html);
        extract2(html);
    }

}
function extract2(html){
    let $=cheerio.load(html);
    let elements=$('.ds-text-tight-m');
    let venue=$(elements[1]).text();
    let info=venue.split(",");
    let location=info[1];
    let time=info[2]+","+info[3];
    let result=$('.ds-text-tight-m.ds-truncate span').text();
   // console.log(result);
    let innings=$('.ds-grow .ds-py-3 span.ds-text-tight-s.ds-font-bold');
    innings.splice(2);
    let teams=[];
    for(let i=0;i<innings.length;i++){
        let txt=$(innings[i]).text();
        let n=txt.length;
        txt=txt.substr(0,n-8);
        teams.push(txt);
        //console.log(txt);

    }
    let table=$('.ReactCollapse--content table');
    //console.log(table.length);
    let players1=[];
    let runs1=[];
    let strikerate1=[];
    let sixes1=[];
    let fours1=[];
    let balls1=[];
    let batting=$(table[0]).find('tbody tr');
    //console.log(batting.length);
    
    let playername=$(batting).find('td span.ds-leading-none');
    //let no_runs=$(batting).find('td strong');
    let pp=$(batting).find('td.ds-min-w-max.ds-text-right');

    //console.log(pp);
    //let players1=[];
    for(let i=0;i<playername.length;i++){
        let st=$(playername[i]).text();
        players1.push(st);
        for(let j=0;j<6;j++){
            if(i*6>=pp.length){
                break;
               }
           let temp=$(pp[i*6+j]).text();
           if(j==0 && temp!="")runs1.push(temp);
           if(j==1 && temp!="")balls1.push(temp);
           if(j==3 && temp!="")fours1.push(temp);
           if(j==4 && temp!="")sixes1.push(temp);
           if(j==5 && temp!="")strikerate1.push(temp);
        }
    }
    if(runs1.length<11){
        for(let i=runs1.length;i<11;i++){
            runs1.push('0');
            balls1.push('0');
            fours1.push('0');
            sixes1.push('0');
            strikerate1.push('0.00');

        }
    }
    //console.log(strikerate1);
    let batting2=$(table[2]).find('tbody tr');
    //console.log(batting2.length);    
    let players2=[];
    let runs2=[];
    let strikerate2=[];
    let sixes2=[];
    let fours2=[];
    let balls2=[];
    let playername2=$(batting2).find('td span.ds-leading-none');
    //let no_runs=$(batting).find('td strong');
    let pp2=$(batting2).find('td.ds-min-w-max.ds-text-right');
    for(let i=0;i<playername2.length;i++){
        let st=$(playername2[i]).text();
        players2.push(st);
        for(let j=0;j<6;j++){
           if(i*6>=pp2.length){
            break;
           } 
           let temp=$(pp2[i*6+j]).text();
           if(j==0 && temp!="")runs2.push(temp);
           if(j==1 && temp!="")balls2.push(temp);
           if(j==3 && temp!="")fours2.push(temp);
           if(j==4 && temp!="")sixes2.push(temp);
           if(j==5 && temp!="")strikerate2.push(temp);
        }
    }
    if(runs2.length<11){
        for(let i=runs2.length;i<11;i++){
            runs2.push('0');
            balls2.push('0');
            fours2.push('0');
            sixes2.push('0');
            strikerate2.push('0.00');

        }
    }
    //console.log(sixes2);
    for(let i=0;i<11;i++){
        processPlayers(teams[0],players1[i],runs1[i],balls1[i],fours1[i],sixes1[i],strikerate1[i],teams[1],location,time,result);
        processPlayers(teams[1],players2[i],runs2[i],balls2[i],fours2[i],sixes2[i],strikerate2[i],teams[0],location,time,result);

    }

}
function processPlayers(teamName,playerName,runs,balls,fours,sixes,sr,opponent,location,time,result){
   let teamPath=path.join(__dirname,'ipl',teamName);
   dirCreator(teamPath);
   let filePath =path.join(teamPath,playerName + ".xlsx");
   let content= excelReader(filePath,playerName);
   let playerObj={
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    sr,
    opponent,
    location,
    time,
    result
   };
   content.push(playerObj);
   excelWriter(filePath,content,playerName);
}
function dirCreator(filePath){
    if(!fs.existsSync(filePath)){
        fs.mkdirSync(filePath);
    }
}
function excelReader(filePath, sheetName){
    if(fs.existsSync(filePath)==false){
        return [];
    }
    let wb=xlsx.readFile(filePath);
    let excelData=wb.Sheets[sheetName];
    let ans=xlsx.utils.sheet_to_json(excelData);
    return ans;
}
function excelWriter(filePath,json,sheetName){
    let newWb= xlsx.utils.book_new();
    let newWs=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWb,newWs,sheetName);
    xlsx.writeFile(newWb,filePath);

}
module.exports={
    pb: processScoreCards
}