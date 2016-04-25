/**
 * Created by smog on 4/24/2016.
 */

module.exports = {
    convertNumberToText: buildGeoString
};

var fs = require('fs');

//var result  = buildGeoString('123456789123456789123456789123456789123456789123456789123456789123');
var result  = buildGeoString('396745');

fs.writeFile('test.txt',result,function(err){
    if(err)
       return console.error(err);

    console.log('Done');
});



function primitiveNumberToText(number){

    switch (number){
        case 0: return 'ნული';
        case 1: return 'ერთი';
        case 2: return 'ორი';
        case 3: return 'სამი';
        case 4: return 'ოთხი';
        case 5: return 'ხუთი';
        case 6: return 'ექვსი';
        case 7: return 'შვიდი';
        case 8: return 'რვა';
        case 9: return 'ცხრა';
        case 10: return 'ათი';
        case 11: return 'თერთმეტი';
        case 12: return 'თორმეტი';
        case 13: return 'ცამეტი';
        case 14: return 'თოთხმეტი';
        case 15: return 'თხუთმეტი';
        case 16: return 'თექვსმეტი';
        case 17: return 'ჩვიდმეტი';
        case 18: return 'თვრამეტი';
        case 19: return 'ცხრამეტი';
        case 20: return 'ოცი';

    }

}

function decryptTwoDigit(number){


    if(number<=20)
        return primitiveNumberToText(number);

    var s = number % 10;
    var t = (number - s)/10;

    var prefix;

    switch(t){
        case 2:
        case 3:{
            prefix = 'ოც';
            break;
        }
        case 4:
        case 5:{
            prefix = 'ორმოც';
            break;
        }
        case 6:
        case 7:{
            prefix = 'სამოც';
            break;
        }
        case 8:
        case 9:{
            prefix = 'ოთხმოც'
            break;
        }

    }

    var k = t%2;

    if(k !== 0 || s !== 0)
        prefix += 'და';

    if(k === 0 && s === 0)
        return prefix += 'ი';

    if(k === 0)
        return prefix + primitiveNumberToText(s);

    return prefix + primitiveNumberToText(s+10);




}

function decryptThirdDigit(number){

    if(number === 1) return 'ას ';

    var prefix = primitiveNumberToText(number);

    if(prefix.substr(-1) === 'ი')
        return prefix.substr(0,prefix.length-1) + 'ას ';

    return prefix + 'ას ';
}

function decryptChunk(number){

    if(number === 0) return '';

    var n_mod = number%100;
    var n_full = (number-n_mod)/100;

    if(n_full === 0) return decryptTwoDigit(n_mod);

    if(n_mod === 0) return decryptThirdDigit(n_full) + 'ი';

    return decryptThirdDigit(n_full) + decryptTwoDigit(n_mod);

}

function generateChunks(number){

    var chunks = [];

    padNumber();

    for(var i = number.length-3; i>=0; i=i-3){

        chunks.push(number.substr(i,3));

    }

    return chunks;

    function padNumber(){

        var delta = 0;

        var rem = number.length % 3;

        if(rem > 0)
            delta = 3 - rem;

        var pad = '0'.repeat(number.length + delta);

        number = (pad + number).slice(-pad.length);



    }

}

function buildGeoString(number){



    if(number.length > 66) throw ('out of range - > limit is 66 chars');

    if(Number(number) === 0) return 'ნული';

    var fullString = '';

    var isNegative = detectNegative();

    var chunks = generateChunks(number);

    for(var i = 0 ; i < chunks.length; i++){
        var currentChunkNumber = Number(chunks[i]);
        var decryptedChunk = decryptChunk(currentChunkNumber);

        if (currentChunkNumber === 0) {fullString = ' ' + fullString;  continue;}

        fullString = decryptedChunk + getSuffixByIndex() + ' ' +  fullString;
    }

    if(Number(chunks[0]) === 0)
        fullString+='ი';

    if(isNegative)
        fullString = 'მინუს ' + fullString;

    return fullString;

    function getSuffixByIndex(){
        switch(i){
            case 1: return ' ათას';
            case 2: return ' მილიონ';
            case 3: return ' მილიარდ';
            case 4: return ' ტრილიონ';
            case 5: return ' კვადტრილიონ';
            case 6: return ' კვინტილიონ';
            case 7: return ' სექსტილიონ';
            case 8: return ' სეპტილიონ';
            case 9: return ' ოქტილიონ';
            case 10: return ' ნონილიონ';
            case 11: return ' დეცილიონ';
            case 12: return ' უნდეცილიონ';
            case 13: return ' დეოდეცილიონ';
            case 14: return ' ტრედეცილიონ';
            case 15: return ' კვატტუოპდეცილიონ';
            case 16: return ' კვინდეცილიონ';
            case 17: return ' სედეცილიონ';
            case 18: return ' სეპტდეცილიონ';
            case 19: return ' დუოდევიგინტილიონ';
            case 20: return ' უნდევიგინტილიონ';
            case 21: return ' ვიგინტილიონ';

            default:return '';
        }
    }

    function detectNegative(){

        if(number[0] === '-'){
            number = number.substr(1,number.length-1);
            return true;
        }

        return false;


    }
}
