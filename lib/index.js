// Copyright 2016 Zipscene, LLC
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

const WordCollection = require('./word-collection');
const IdGenerator = require('./id-generator');
const defaultIdGenerator = IdGenerator.load(
	__dirname + '/words/nouns.txt',
	__dirname + '/words/adjectives.txt',
	__dirname + '/words/names.txt'
);

function generateId() {
	return defaultIdGenerator.generate();
}

module.exports = {
	WordCollection,
	IdGenerator,
	generateId
};
