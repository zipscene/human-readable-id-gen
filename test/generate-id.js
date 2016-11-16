// Copyright 2016 Zipscene, LLC
// Licensed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0

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
