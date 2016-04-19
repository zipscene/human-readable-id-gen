const { IdGenerator, WordCollection } = require('../lib');
const { expect } = require('chai');
const sinon = require('sinon');

describe('IdGenerator', function() {
	let nouns = new WordCollection([ 'chair', 'desk', 'lamp' ]);
	let adjectives = new WordCollection([ 'good', 'bad', 'ugly' ]);
	let names = new WordCollection([ 'Tom', 'Dick', 'Harry' ]);
	let sandbox;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function() {
		sandbox.restore();
	});

	describe('constructor', function() {
		it('stores each argument as corresponding property', function() {
			let idGenerator = new IdGenerator(nouns, adjectives, names);

			expect(idGenerator.nouns).to.equal(nouns);
			expect(idGenerator.adjectives).to.equal(adjectives);
			expect(idGenerator.names).to.equal(names);
		});
	});

	describe('.load', function() {
		it('returns new instance with properties loaded from provided paths', function() {
			let nounsPath = 'path/to/nouns/file';
			let adjectivesPath = 'path/to/adjectives/file';
			let namesPath = 'path/to/names/file';
			sandbox.stub(WordCollection, 'load');
			WordCollection.load.withArgs(nounsPath).returns(nouns);
			WordCollection.load.withArgs(adjectivesPath).returns(adjectives);
			WordCollection.load.withArgs(namesPath).returns(names);

			let idGenerator = IdGenerator.load(nounsPath, adjectivesPath, namesPath);

			expect(idGenerator.nouns).to.equal(nouns);
			expect(idGenerator.adjectives).to.equal(adjectives);
			expect(idGenerator.names).to.equal(names);
		});
	});

	describe('#generate', function() {
		it('returns random name, adjective, noun alliteration', function() {
			let idGenerator = new IdGenerator(nouns, adjectives, names);
			sandbox.stub(nouns, 'random').returns('lion');
			sandbox.stub(adjectives, 'randomByLetter').withArgs('l').returns('lengthy');
			sandbox.stub(names, 'randomByLetter').withArgs('l').returns('Leo');

			expect(idGenerator.generate()).to.equal('Leo\'s lengthy lion');
		});
	});
});
