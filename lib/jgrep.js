#!/usr/bin/env node
/*
 * jgrep
 * https://github.com/mustafar/jgrep
 *
 * Copyright (c) 2014 Mustafa Rizvi
 * Licensed under the MIT license.
 */
'use strict';

var jargvy = require('jargvy');
var grepper = require("./grepengine.js");
var extras = require("./extras.js");

// read cmd line
var rules = [
  {'id': '-p', 'name': 'path', 'default': '.' },
  {'id': '-e', 'name': 'extensions', 'type': 'string'},
  {'id': '-i', 'name': 'ignoredDirs', 'type': 'string'},
  {'id': '--hidden', 'name': 'searchHidden'},
  {'id': '--nocase', 'name': 'isCaseInsensitive'},
  {'id': '--norecurse', 'name': 'isNotRecursive'},
  {'id': '--help', 'name': 'help'},
  {'id': '--version', 'name': 'version'},
];
jargvy.define(rules);
var options = jargvy.extract();

// Help, yes?
if (options['help'] || process.argv.length <= 2) {
  extras.help();
  return;
}

var query = process.argv[2];



// Version
if (options['version']) {
  extras.version();
  return;
}

// parse args
var arrRaw = options['extensions'].split(',');
var extensions = [];
for(var i=0; i<arrRaw.length; i++) {
  if (arrRaw[i].trim().length > 0) {
    extensions.push(arrRaw[i].trim());
  }
}
var ignoredDirs = extras.commaSeparatedToArray(options['ignoredDirs']);

grepper.search(
  query,
  options['path'],
  extensions,
  options['isCaseInsensitive'],
  options['isNotRecursive'],
  ignoredDirs,
  options['searchHidden']);
