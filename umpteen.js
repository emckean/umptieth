//here's the written-out numbers
var oneToNineteen = [' ', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
    tens = [' ', 'ten', 'twenty-', 'thirty-', 'forty-', 'fifty-', 'sixty-', 'seventy-', 'eighty-', 'ninety-'],
    ones = [' ', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
    powers = ['', 'hundred', ' thousand,', ' million,', ' billion,', ' trillion,', ' quadrillion,', ' quintillion,', ' sextillion,'];

// here's the little functions that pull from the arrays of numbers
var underTwenty = function underTwenty(number) {
    return oneToNineteen[number];
}
var underHundred = function underHundred(number) {
    return tens[number];
}
var singleDigit = function singleDigit(number) {
    return ones[number];
}   
 
 /**
  * Object with functions that clean the number of non-digits and decimals
  * could totally do this with standalone functions, just wanted to try this syntax
  * @param  {Number} number 
  */
var umpteenNumber = function umpteenNumber(number) {
    return {
        myNumber: number,
        onlyDigits:  function(myNumber){  
            if (typeof myNumber === 'string') {
                var exp = /[^\d]/ig;
                myNumber = myNumber.replace(exp,'');
            }
            if (myNumber !== '') {
                return myNumber;
            } else {
                return new Error('Sorry, please enter at least one digit.');
            }

        },
        noDecimals: function (myNumber){
            if (Math.floor(myNumber) === 0) { 
                return new Error('Sorry, number too small.');
            } else {
                myNumber = Math.floor(myNumber);
                return myNumber;
            }
        },
        //HEY DELIMITERS HERE
        noDecimalsString: function (myNumber){
            myNumber = myNumber.split('.', 1);
            if (myNumber[0] !== '') {
                return myNumber[0];
            } else {
                return new Error('Sorry, number too small.');
            }
            
        }
    }
}

/**
 * Does the checking fof non-digits and too-big numbers
 * @param  {Number|String} input
 */
var checkTypeAndLength = function checkTypeAndLength(input) {
    if (typeof input == 'number') {
        if(input >= 9007199254740992) {
            return new Error('Sorry, number too big. Blame Javascript!');   
        }        
        return umpteenNumber().noDecimals(input).toString;
    }
    else if(typeof input == 'string') {
        var tempNum = umpteenNumber().noDecimalsString(input);

        if (tempNum instanceof Error) {
            return tempNum;
        } else if (umpteenNumber().onlyDigits(tempNum).length > 16) {
            return new Error('Sorry, I can\'t count that high!')
        } else {
            return umpteenNumber().onlyDigits(tempNum);
        }
    }
}
    
/**
 * Turn number into array
 * @param  {Number|String} input
 * @return {Array}
 */
var arrayify = function arrayify(input) {
    var stringNum;
    if (typeof input == 'string'){
        stringNum = input;
    }
    else {
        stringNum = input.toString();
    }
    
    var arrayOfNums = stringNum.split('');
    var length = arrayOfNums.length;
    
    for(var i = 0; i < length; i++){
        arrayOfNums[i] = +arrayOfNums[i];
    }

    return arrayOfNums;
}

/**
 * Creates an array of words from number input
 * @param  {Number} number
 * @return {Array}
 */
var spellItOut = function spellItOut(number) {
    //let's make some variables
    var spelledNums = [];
   //what we return
    var spelledArray = [];
    //temporary array to count backwards by threes
    var tempNums = [];
    //create an array from the number string
    var arrayOfNums = arrayify(number);
    console.log(arrayOfNums);
    //get the length
    var myLength = arrayOfNums.length;
    // make an array of arrays, counting from the end of the number = 123,456 = [[4,5,6], [1,2,3]]
    while (myLength > 0) {
        tempNums.push(arrayOfNums.splice(-3, 3));
        myLength = (myLength - 3);
    }
    var tempNumlength = tempNums.length;  
    //okay let's look at each chunk one by one    
    for(var i = 0; i < tempNumlength; i++) {
        //reverse it, because that way you know the relevant teen digit is always array[1]
        var miniArray = tempNums[i].reverse();
        //check if the middle digit is a 1, in which case it's a 'teen' number
        if ((miniArray[1] === 1)) {
                var teenNum = (miniArray[1]).toString() + (miniArray[0]).toString();
                if (i === 0) {
                    spelledNums.push(underTwenty(+teenNum));
                } else {
                    spelledNums.push(underTwenty(+teenNum) + powers[i+1]);
                }    
                //push an empty element for every place
                 spelledNums.push(' ');
                 //now push the hundreds digit, if it's not undefined or 0
                 if (miniArray[2]) {
                     spelledNums.push(singleDigit(miniArray[2]) + ' hundred and');
                 }
                 else {
                 spelledNums.push(' ');
             }
        }
        // if it's not a 1 then
        else { 
            if (miniArray[0] >= 0){
                if (i === 0) {
                    spelledNums.push(underTwenty(miniArray[0]));
                } else {
                    spelledNums.push(underTwenty(miniArray[0]) + powers[i+1]);
                }
            }
            if ((miniArray[1]) !== undefined){
                spelledNums.push(underHundred(miniArray[1]));
            } 
            else {
                spelledNums.push(' ');
            } 
            if (miniArray[2]){
                spelledNums.push(singleDigit(miniArray[2]) + ' hundred and');       
            }
            else {
                spelledNums.push(' ');
            }
        }
    }
    //put things back in the right order
    spelledArray = spelledNums.reverse();
    return(spelledArray);

}

/**
 * Check if an element is not empty
 * @param  {String}  element
 * @return {Boolean}
 */
var isNotEmpty = function isNotEmpty(element) {
  return element !== ' ';
}

/**
 * Take the spellItOut array and clean up extraneous elements
 * @param  {Array} myNumberArray
 * @return {String}
 */
var phrasify = function phrasify(myNumberArray) {    
    //make sure it's not empty
    myNumberArray = myNumberArray.filter(isNotEmpty);
    // turn it into one string
    myNumberArray = myNumberArray.join(' ');
    //take out spaces
    myNumberArray = myNumberArray.replace(/  /, ' ');
    //clean up hyphens
    myNumberArray = myNumberArray.replace(/- /gi, '-');
    //remove unnecessary terminal hyphens
    myNumberArray = myNumberArray.replace(/- /gi, ' ');
    //take out unnecessary ands
    myNumberArray = myNumberArray.replace(/and$/, '');
    // returning new variable just in case I think of anything else to clean
    
    return myNumberArray;
}

/**
 * Zero as special case
 * @param  {Numer} number 
 * @return {Array|Number}
 */
var checkZero = function checkZero(number) {
    var newNumber = parseInt(number, 10);
    
    if (newNumber === 0) {
        //returning array here 
        return ['zero']; 
    }
    else {
        //returning the original number 
        //remember that parseInt won't work nicely on numbers >9007199254740992, so return original number here
        return number;
    }
}

/**
 * Check for negative numbers
 * @param  {Number} number 
 * @return {String}
 */
var checkNegative = function checkNegative(number) {
    var negExpr = /^-/;
    if (negExpr.test(number)) {
        //returning array here 
        return 'negative '; 
    }
    else {
        return '';
    }
}

var finalFunction = function finalFunction(number) {
    //clean input
    var cleanNumber = checkTypeAndLength(number);
    if (cleanNumber instanceof Error) {
        return (cleanNumber);
    }
    //check for negative case
    var negative = checkNegative(number);
    //check for zero special case
    if (checkZero(cleanNumber) == 'zero') {
        return 'zero';
    } else {
        //get the non-zero output of cleanNumber
        var noZeros = checkZero(cleanNumber);
        console.log(noZeros);
        //get the array of number words
        var wordArray = spellItOut(noZeros);
        console.log(wordArray);
        //make it into a pretty phrase
        var phrasedResult = phrasify(wordArray);
        // add the output of the negative check above
        var finalOutput = negative + phrasedResult;
        //return it
        return finalOutput;
    }
    
}

if (typeof module !== 'undefined') {
    module.exports = {
        umpteenNumber: umpteenNumber,
        arrayify: arrayify,
        checkZero: checkZero,
        checkNegative: checkNegative,
        underTwenty: underTwenty,
        checkTypeAndLength: checkTypeAndLength,
        singleDigit: singleDigit,
        underHundred: underHundred,
        spellItOut: spellItOut,
        phrasify: phrasify,
        finalFunction: finalFunction
    }
}

