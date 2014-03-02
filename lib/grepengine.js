/*
 * jgrep
 * https://github.com/mustafa/jgrep
 *
 * Copyright (c) 2014 Mustafa Rizvi
 * Licensed under the MIT license.
 */
'use strict';

var dir = require('node-dir');
var fs  = require("fs");

function search(queryTerms, path, extns, isCaseInsensitive, searchHidden) {
  dir.files(path, function(err, files) {
    if (err) {
      throw err;
    }

    // get all files to search
    var filesToSearch = filter(files, extns, searchHidden);

    // read files one by one
    var matches = {};
    for (var i=0; i<filesToSearch.length; i++) {
      var fileMatches = searchInFile(queryTerms, filesToSearch[i], isCaseInsensitive);
      for (var queryTerm in fileMatches) {
        if (matches[queryTerm] === undefined) {
          matches[queryTerm] = [];
        }
        matches[queryTerm] = matches[queryTerm].concat(fileMatches[queryTerm]);
      }
    }

    // print results
    prettyPrint(queryTerms, matches, isCaseInsensitive);
  });
}

function filter(files, extns, searchHidden) {
  var filteredFiles = [];
  if (!files || files.length === 0) {
    return filteredFiles;
  }
  for (var i=0; i<files.length; i++) {
    var filePath = files[i];
    if (!searchHidden && isInHiddenFolder(filePath)) {
      continue;
    }
    if (!isValidExtension(filePath, extns)) {
      continue;
    }
    filteredFiles.push(filePath);
  }
  return filteredFiles;
}

function searchInFile(queryTerms, filePath, isCaseInsensitive) {
  var matches = {};
  fs.readFileSync(filePath)
    .toString()
    .split('\n')
    .forEach(function (line, lineNum) { 
    for(var i=0; i<queryTerms.length; i++) {
      var queryTerm = queryTerms[i];
      var lineToSearch = line;
      if (isCaseInsensitive) {
        queryTerm = queryTerm.toLowerCase();
        lineToSearch = lineToSearch.toLowerCase();
      }
      if (lineToSearch.indexOf(queryTerm) !== -1) {
        if (matches[queryTerm] === undefined) {
          matches[queryTerm] = [];
        }
        matches[queryTerm].push({
          'fileName': filePath,
          'lineNum': lineNum,
          'text': line
        });
      }
    }
  });
  return matches;
}

function prettyPrint(queryTerms, matches, isCaseInsensitive) {
  if (Object.keys(matches).length === 0) {
    console.log("No matches.");
    return;
  }
  var noMatches = [];
  for (var i=0; i<queryTerms.length; i++) {
    var queryTerm = queryTerms[i];
    if (isCaseInsensitive) {
      queryTerm = queryTerm.toLowerCase();
    }
    if (matches[queryTerm] === undefined ||
        matches[queryTerm].length === 0) {
      noMatches.push(queryTerm);
    }
  }

  console.log("\nMATCHES\n=======");
  for (var queryTerm in matches) {
    console.log("\n" + queryTerm + "\n----------");
    var queryMatches = matches[queryTerm];
    for (var i=0; i<queryMatches.length; i++) {
      console.log(queryMatches[i].fileName + 
          ", " +
          queryMatches[i].lineNum + 
          ": " + 
          queryMatches[i].text);
    }
  }

  if (noMatches.length > 0) {
    console.log("\nNO MATCHES\n==========");
    for (var i=0; i<noMatches.length; i++) {
      console.log(noMatches[i]);
    }
  }

  console.log("\n");
}

function isInHiddenFolder(filePath) {
  if (/[\\\/]\.[0-9a-zA-Z]+[\\\/]/i.test(filePath)) {
    return true;
  }
  return false;
}

function isValidExtension(filePath, extns) {
    if (!extns || extns.length === 0) {
        return true;
    }
    if(!filePath || filePath.lastIndexOf('.') === -1) {
        return false;
    }
    var fileExtn = filePath.substring(filePath.lastIndexOf('.') + 1);
    for (var i=0; i<extns.length; i++) {
        var checkExtn = extns[i];
        if (checkExtn.charAt(0) === '.') {
            checkExtn = checkExtn.substring(1);
        }
        if (fileExtn === checkExtn) {
            return true;
        }
    }
    return false;
}

// exports
exports.search = search;
