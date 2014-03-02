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

// read cmd line
var rules = [
  {'id': '-p', 'name': 'path', 'default': '.' },
  {'id': '-e', 'name': 'extensions', 'type': 'string'},
  {'id': '--hidden', 'name': 'searchHidden'},
  {'id': '--nocase', 'name': 'caseInsensitive'},
];
jargvy.define(rules);
var options = jargvy.extract();
var query = process.argv[2];

// parse args
var arrRaw = options['extensions'].split(',');
var extensions = [];
for(var i=0; i<arrRaw.length; i++) {
  if (arrRaw[i].trim().length > 0) {
    extensions.push(arrRaw[i].trim());
  }
}

grepper.search(
  [query],
  options['path'], 
  extensions,
  options['caseInsensitive'],
  options['searchHidden']);
