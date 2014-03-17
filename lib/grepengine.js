/*
 * jgrep
 * https://github.com/mustafa/jgrep
 *
 * Copyright (c) 2014 Mustafa Rizvi
 * Licensed under the MIT license.
 */
'use strict';

var dir = require('node-dir');
var fs = require("fs");
var pathHelper = require("path");
var extras = require("./extras.js");

function search(
  queryArg, path, extns, isCaseInsensitive, isNotRecursive,
  ignoredDirs, searchHidden) {
  var queryTerms = getQueryTerms(queryArg);
  dir.files(path, function (err, files) {
    if (err) {
      throw err;
    }

    // get all files to search
    var filesToSearch = filter(
      path, files, extns, isNotRecursive, ignoredDirs, searchHidden);

    // read files one by one
    var matches = {};
    for (var i = 0; i < filesToSearch.length; i++) {
      var fileMatches = searchInFile(queryTerms, filesToSearch[i], isCaseInsensitive);
      for (var queryTerm in fileMatches) {
        if (matches[queryTerm] === undefined) {
          matches[queryTerm] = [];
        }
        matches[queryTerm] = matches[queryTerm].concat(fileMatches[queryTerm]);
      }
    }

    // print results
    extras.prettyPrint(queryTerms, matches, isCaseInsensitive);
  });
}

function filter(path, files, extns, isNotRecursive, ignoredDirs, searchHidden) {
  var filteredFiles = [];
  if (!files || files.length === 0) {
    return filteredFiles;
  }
  for (var i = 0; i < files.length; i++) {
    var filePath = files[i];
    if (isNotRecursive) {
      var absoluteBasePath = pathHelper.resolve(path);
      var absoluteFilePath = pathHelper.resolve(filePath);
      var pathDiff = absoluteFilePath.substring(absoluteBasePath.length + 1);
      if (/[\\\/]/i.test(pathDiff)) {
        continue;
      }
    }
    if (!searchHidden && isInHiddenFolder(filePath)) {
      continue;
    }
    if (!isValidExtension(filePath, extns)) {
      continue;
    }
    if (isIgnoredDir(filePath, ignoredDirs)) {
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
      for (var i = 0; i < queryTerms.length; i++) {
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

function isInHiddenFolder(filePath) {
  if (/(^|\\|\/)\.[_\-0-9a-zA-Z]+(^|\\|\/)/i.test(filePath)) {
    return true;
  }
  return false;
}

function isValidExtension(filePath, extns) {
  if (!extns || extns.length === 0) {
    return true;
  }
  if (!filePath || filePath.lastIndexOf('.') === -1) {
    return false;
  }
  var fileExtn = filePath.substring(filePath.lastIndexOf('.') + 1);
  for (var i = 0; i < extns.length; i++) {
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

function isIgnoredDir(filePath, ignoredDirs) {
  if (!filePath || !ignoredDirs || ignoredDirs.length === 0) {
    return false;
  }
  for (var i = 0; i < ignoredDirs.length; i++) {
    var regex = new RegExp(
      "(^|\\\\|\\/)" + ignoredDirs[i] + "(^|\\\\|\\/)", 'i');
    if (regex.test(filePath)) {
      return true;
    }
  }
  return false;
}

function getQueryTerms(queryArg) {
  var queryTerms = [];

  // read terms from file
  if (fs.existsSync(queryArg)) {
    fs.readFileSync(queryArg)
      .toString()
      .split('\n')
      .forEach(function (line) {
        if (line.trim() !== '') {
          queryTerms.push(line);
        }
      });

    // single term search
  } else {
    if (queryArg.trim() !== '') {
      queryTerms.push(queryArg);
    }
  }
  return queryTerms;
}

// exports
exports.search = search;
