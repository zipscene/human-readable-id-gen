const { WordCollection } = require('../lib');
const { expect } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const fs = require('fs');
const rimraf = require('rimraf');

describe('WordCollection', function() {
	describe('constructor', function() {
		it('stores words argument as words property', function() {
			let words = [ 'some', 'words' ];

			let wordCollection = new WordCollection(words);

			expect(wordCollection.words).to.equal(words);
		});

		it('defaults to empty words property', function() {
			let wordCollection = new WordCollection();

			expect(wordCollection.words).to.deep.equal([]);
		});
	});

	describe('.load', function() {
		const tmpDir = __dirname + '/tmp/';
		const path = tmpDir + '/words.txt';

		beforeEach(function() {
			fs.mkdirSync(tmpDir);
		});

		afterEach(function() {
			rimraf.sync(tmpDir);
		});

		it('synchronously reads file at provided path and splits it on newlines', function() {
			fs.writeFileSync(path, 'words\nfrom\nfile');

			expect(WordCollection.load(path).words).to.deep.equal([ 'words', 'from', 'file' ]);
		});

		it('trims whitespace around words', function() {
			fs.writeFileSync(path, '  words \n\tfrom\n\t\tfile ');

			expect(WordCollection.load(path).words).to.deep.equal([ 'words', 'from', 'file' ]);
		});

		it('filters out empty words', function() {
			fs.writeFileSync(path, 'words\n\nfrom\n \nfile\n\t');

			expect(WordCollection.load(path).words).to.deep.equal([ 'words', 'from', 'file' ]);
		});
	});

	describe('#byLetter', function() {
		let wordCollection;

		beforeEach(function() {
			wordCollection = new WordCollection([ 'apple', 'Aardvark', 'bear', 'box' ]);
		});

		it('returns a copy filtered by the provided first letter, ignoring case', function() {
			expect(wordCollection.byLetter('a').words).to.deep.equal([ 'apple', 'Aardvark' ]);
			expect(wordCollection.byLetter('B').words).to.deep.equal([ 'bear', 'box' ]);
			expect(wordCollection.byLetter('c').words).to.deep.equal([]);
		});

		it('handles chains correctly', function() {
			let filtered = wordCollection.byLetter('a');

			expect(filtered.byLetter('a').words).to.deep.equal([ 'apple', 'Aardvark' ]);
			expect(filtered.byLetter('b').words).to.deep.equal([]);
		});
	});

	describe('#random', function() {
		let wordCollection;

		beforeEach(function() {
			wordCollection = new WordCollection([ 'some', 'words' ]);
			sinon.stub(_, 'sample');
		});

		afterEach(function() {
			_.sample.restore();
		});

		it('calls _.sample with words property and returns result', function() {
			let expected = 'expected';
			_.sample.withArgs(wordCollection.words).returns(expected);

			expect(wordCollection.random()).to.equal(expected);
		});

		it('returns null if _.sample returns undefined', function() {
			expect(wordCollection.random()).to.be.null;
		});
	});

	describe('#randomByLetter', function() {
		let letter = 'a';
		let expected = 'expected';
		let allWords, wordsByLetter;

		beforeEach(function() {
			allWords = new WordCollection([]);
			wordsByLetter = new WordCollection([]);

			sinon.stub(allWords, 'byLetter').withArgs(letter).returns(wordsByLetter);
		});

		it('calls #byLetter followed by #random, returning the result', function() {
			sinon.stub(wordsByLetter, 'random').returns(expected);

			expect(allWords.randomByLetter(letter)).to.equal(expected);
		});

		it('returns random from all words if by-letter random returns null', function() {
			sinon.stub(wordsByLetter, 'random').returns(null);
			sinon.stub(allWords, 'random').returns(expected);

			expect(allWords.randomByLetter(letter)).to.equal(expected);
		});
	});
});
