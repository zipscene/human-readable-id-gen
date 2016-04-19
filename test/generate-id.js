const { generateId } = require('../lib');
const mlog = require('mocha-logger');

describe('generateId', function() {
	it('generates human-readable ids from default word files', function() {
		const count = 5;
		for (let i = 0; i < count; i += 1) {
			mlog.log(generateId());
		}
	});
});
