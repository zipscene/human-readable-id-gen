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
