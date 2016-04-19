const _ = require('lodash');
const fs = require('fs');

/**
 * Class for performing operations on collections of words.
 *
 * @class WordCollection
 * @constructor
 * @param {String[]} [words = []] - Words to store in the collection
 * @param {Object} [map] - Pre-generated map of letters to words, used internally
 */
class WordCollection {
	constructor(words = [], map) {
		this.words = words;
		this._map = map || mapByLetter(words);
	}

	/**
	 * Loads words from a file.
	 * @method load
	 * @static
	 * @param {String} path - Path to a text file of newline-separated words
	 * @return {WordCollection} - A new WordCollection containing words from the file
	 */
	static load(path) {
		let words = fs.readFileSync(path, { encoding: 'utf8' })
			.split('\n')
			.map((word) => word.trim())
			.filter((word) => !!word);

		return new WordCollection(words);
	}

	/**
	 * Filters words by first letter.
	 * @method byLetter
	 * @param {String} letter - A single-character string
	 * @return {WordCollection} - A copy containing only words beginning with **letter**
	 */
	byLetter(letter) {
		letter = letter.toLowerCase();
		let words = this._map[letter] || [];
		let map = (words.length > 0) ? { [letter]: words } : {};

		return new WordCollection(words, map);
	}

	/**
	 * Gets a random word.
	 * @method random
	 * @return {String|null} - A random word from the collection. Null if the collection is empty.
	 */
	random() {
		return _.sample(this.words) || null;
	}

	/**
	 * Gets a random word beginning with the provided letter.
	 * @method randomByLetter
	 * @param {String} letter - A single-character string.
	 * @return {String|null} - A random word from the collection beginning with **letter**, or
	 *   with any letter if no such words exist in the collection. Null if the collection is empty.
	 */
	randomByLetter(letter) {
		return this.byLetter(letter).random() || this.random();
	}
}

function mapByLetter(words) {
	let map = {};
	words.forEach((word) => {
		let letter = word[0].toLowerCase();
		if (!map[letter]) map[letter] = [];
		map[letter].push(word);
	});

	return map;
}

module.exports = WordCollection;
