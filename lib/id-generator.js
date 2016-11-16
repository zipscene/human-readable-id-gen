// Copyright 2016 Zipscene, LLC
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

const WordCollection = require('./word-collection');

/**
 * Class for generating user-readable id strings.
 *
 * @class IdGenerator
 * @constructor
 * @param {WordCollection} nouns - Collection of nouns to use in generated ids.
 * @param {WordCollection} adjectives - Collection of adjectives to use in generated ids.
 * @param {WordCollection} names - Collection of names ot use in generated ids.
 */
class IdGenerator {
	constructor(nouns, adjectives, names) {
		this.nouns = nouns;
		this.adjectives = adjectives;
		this.names = names;
	}

	/**
	 * Creates a generator by loading words from newline-separated text files.
	 *
	 * @method load
	 * @static
	 * @param {String} nounsPath - path to file containing nouns.
	 * @param {String} adjectivesPath - path to file containing adjectives.
	 * @param {String} namesPath - path to file containing names.
	 * @return {IdGenerator} - A new IdGenerator.
	 */
	static load(nounsPath, adjectivesPath, namesPath) {
		return new IdGenerator(
			WordCollection.load(nounsPath),
			WordCollection.load(adjectivesPath),
			WordCollection.load(namesPath)
		);
	}

	/**
	 * Creates and returns an id string.
	 *
	 * @method generate
	 * @return {String} - A randomly-generated human-readable id.
	 */
	generate() {
		let noun = this.nouns.random();
		let adjective = this.adjectives.randomByLetter(noun[0]);
		let name = this.names.randomByLetter(noun[0]);

		return `${name}'s ${adjective} ${noun}`;
	}
}

module.exports = IdGenerator;
