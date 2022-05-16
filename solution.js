var fs = require("fs");
const jsonData = require("./example.in.json");

//build key value dictionary for synonyms
let dictionaryBuilder = (dictArray) => {
  let dictObject = {};
  for (let i = 0; i < dictArray.length; i++) {
    let [word1, word2] = dictArray[i];
    word1 = word1.toLowerCase();
    word2 = word2.toLowerCase();

    if (dictObject[word1] === undefined) {
      dictObject[word1] = [];
    }
    if (dictObject[word2] === undefined) {
      dictObject[word2] = [];
    }
    dictObject[word1].push(word2);
    dictObject[word2].push(word1);
  }

  return dictObject;
};

// recursive function to check synonyms for rule3
let derivedSynonyms = (valArray, word2, checkedWords, synonymsDict) => {
  let result = false;
  for (let i = 0; i < valArray.length; i++) {
    const element = valArray[i];
    if (element === word2) {
      result = true;
      break;
    } else {
      if (!checkedWords[element]) {
        checkedWords[element] = true;
        result = derivedSynonyms(
          synonymsDict[element],
          word2,
          checkedWords,
          synonymsDict
        );
        if (result) {
          break;
        }
      }
    }
  }
  return result;
};
let isSynonyms = (word1, word2, dict) => {
  //   console.log("word1", word1, "word2", word2, "dic", dict);
  var check = "different";
  word1 = word1.toLowerCase();
  word2 = word2.toLowerCase();
  if (word1 === word2) {
    check = "synonyms";
  } else if (dict[word1] && dict[word1].indexOf(word2) !== -1) {
    check = "synonyms";
  } else if (dict[word2] && dict[word2].indexOf(word1) !== -1) {
    check = "synonyms";
  } else {
    //checkWords dict keeps words for which we have already checked for synonyms
    let checkedWords = { [word1]: true };
    let result = dict[word1]
      ? derivedSynonyms(dict[word1], word2, checkedWords, dict)
      : false;
    if (result) {
      check = "synonyms";
    }
  }

  return check;
};

let finalResult = [];
for (let i = 0; i < jsonData["testCases"].length; i++) {
  const testCase = jsonData["testCases"][i];

  // build a synonym object to check words effeciently
  let synonymsDict = dictionaryBuilder(testCase["dictionary"]);

  // check for each query and append result to overall result array
  for (let j = 0; j < testCase["queries"].length; j++) {
    const query = testCase["queries"][j];
    finalResult.push(isSynonyms(...query, synonymsDict));

    // console.log(query, finalResult);
  }
}

// convert array to string with newline
let resultString = finalResult.join("\n");

// write result string to Output txt file
fs.writeFile("Output.txt", resultString, (err) => {
  // In case of a error throw err.
  if (err) throw err;
});
