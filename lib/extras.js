/*
 * jgrep
 * https://github.com/mustafa/jgrep
 *
 * Copyright (c) 2014 Mustafa Rizvi
 * Licensed under the MIT license.
 */
'use strict';

var packageJson = require('../package.json');

function commaSeparatedToArray(str) {
  str = str? str : '';
  var arrRaw = str.split(',');
  var arr = [];
  for (var i = 0; i < arrRaw.length; i++) {
    if (arrRaw[i].trim().length > 0) {
      arr.push(arrRaw[i].trim());
    }
  }
  return arr;
}

function showVersionInfo() {
  console.log(packageJson.version);
}

function showHelp() {
  console.log("JGrep: JavaScript grep (v" + packageJson.version + ")\n");
  console.log("Usage\n jgrep <queries> [options]");
  console.log(" queries: single term or a file with query terms separated by newlines");
  console.log();
  console.log("Options");
  console.log(" -p <folder path> : folder to start (eg: '/Users/foo')");
  console.log(" -e <comma-separated list> : filter by extensions (eg: 'js,.csv')");
  console.log(" -i <comma-separated list> : ignore these dirs (eg: 'node_modules,logs')");
  console.log(" --nocase : ignore case");
  console.log(" --norecurse : search only in current dir");
  console.log(" --hidden : include hidden folders (.git, .svn)");
  console.log(" --version : check version");
  console.log();
}

function prettyPrint(queryTerms, matches, isCaseInsensitive) {
  if (Object.keys(matches).length === 0) {
    console.log("No matches.");
    return;
  }
  var noMatches = [];
  var i;
  var queryTerm;
  for (i = 0; i < queryTerms.length; i++) {
    queryTerm = queryTerms[i];
    if (isCaseInsensitive) {
      queryTerm = queryTerm.toLowerCase();
    }
    if (matches[queryTerm] === undefined ||
      matches[queryTerm].length === 0) {
      noMatches.push(queryTerm);
    }
  }

  console.log("\nMATCHES\n=======");
  for (queryTerm in matches) {
    console.log("\n" + queryTerm + "\n----------");
    var queryMatches = matches[queryTerm];
    for (i = 0; i < queryMatches.length; i++) {
      console.log(queryMatches[i].fileName +
        ", " +
        queryMatches[i].lineNum +
        ": " +
        queryMatches[i].text);
    }
  }

  if (noMatches.length > 0) {
    console.log("\nNO MATCHES\n==========");
    for (i = 0; i < noMatches.length; i++) {
      console.log(noMatches[i]);
    }
  }

  console.log("\n");
}

// exports
exports.help = showHelp;
exports.version = showVersionInfo;
exports.prettyPrint = prettyPrint;
exports.commaSeparatedToArray = commaSeparatedToArray;
