/*
 * jgrep
 * https://github.com/mustafa/jgrep
 *
 * Copyright (c) 2014 Mustafa Rizvi
 * Licensed under the MIT license.
 */
'use strict';

var packageJson = require('../package.json');

function showVersionInfo() {
  console.log(packageJson.version);
}

function showHelp() {
  console.log("JGrep: JavaScript grep (v" + packageJson.version + ")\n");
  console.log("Usage\n jgrep <queries> [options]");
  console.log(" queries: single term or a file with query terms separated by newlines");
  console.log();
  console.log("Options");
  console.log(" -p <folder path>: folder to start (eg: '/Users/foo')");
  console.log(" -e <comma-separated list>: filter by extensions (eg: 'js,.csv')");
  console.log(" --nocase : ignore case");
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
  for (var queryTermMatch in matches) {
    console.log("\n" + queryTermMatch + "\n----------");
    var queryMatches = matches[queryTermMatch];
    for (var j=0; j<queryMatches.length; j++) {
      console.log(queryMatches[j].fileName + 
          ", " +
          queryMatches[j].lineNum + 
          ": " + 
          queryMatches[j].text);
    }
  }

  if (noMatches.length > 0) {
    console.log("\nNO MATCHES\n==========");
    for (var k=0; k<noMatches.length; k++) {
      console.log(noMatches[k]);
    }
  }

  console.log("\n");
}

// exports
exports.help = showHelp;
exports.version = showVersionInfo;
exports.prettyPrint = prettyPrint;
