# zs-id-generator

Library for generating human-readable id strings.

## Basic Usage

```javascript
const { generateId } = require('zs-id-generator');

console.log(generateId());
// ex. Regina's required request

console.log(generateId());
// ex. Garrett's graceful giraffe
```

## Custom Generators

The `generateId` function randomly pulls words from a default collection of nouns, adjectives, and names. To pull from a different set of words, you must use the `IdGenerator` class and its `#generate` method.


### Using words in memory

Use the `IdGenerator` constructor with instances of `WordCollection`.

```javascript
const { IdGenerator, WordCollection } = require('zs-id-generator');

let nouns = new WordCollection(['chair', 'tie', 'lamp']);
let adjectives = new WordCollection(['good', 'bad', 'ugly']);
let names = new WordCollection(['Tom', 'Dick', 'Harry']);

let idGenerator = new IdGenerator(nouns, adjectives, names);

console.log(idGenerator.generate());
// ex. Tom's ugly tie
```

Note that alliteration is not guaranteed if, for any word in the nouns collection, there isn't a word beginning with the same letter in both the adjectives and names collections, as above (`adjectives` has no words beginning with 't').

### Loading from files

Use `IdGenerator.load` to load words from text files. These files should contain words separated by newlines.

```javascript
const { IdGenerator } = require('zs-id-generator');

let idGenerator = IdGenerator.load(
	'path/to/nouns.txt',
	'path/to/adjectives.txt',
	'path/to/names.txt'
);

console.log(idGenerator.generate());
// ex. Leanna's logical laundry
```

Individual `WordCollection` instances can also be loaded from files:

```javascript
const { IdGenerator, WordCollection } = require('zs-id-generator');

let nouns = WordCollection.load('path/to/nouns.txt');
let adjectives = new WordCollection(['good', 'bad', 'ugly']);
let names = new WordCollection(['Tom', 'Dick', 'Harry']);

let idGenerator = new IdGenerator(nouns, adjectives, names);

console.log(idGenerator.generate());
// ex. Harry's bad hair
```
