'use strict';

const through = require('through2');
const path = require('path');
const File = require('vinyl');
const Concat = require('concat-with-sourcemaps');
const hasha = require('hasha');


// file can be a vinyl file object or a string
// when a string it will construct a new one
module.exports = function(file, opt) {
	if (!file)
	{
		throw new Error('gulp-file-version-info: Missing file option');
	}
	opt = opt || {};

	var isUsingSourceMaps = false;
	var latestFile;
	var latestMod;
	var fileName;
	var concat;

	if (typeof file === 'string')
	{
		fileName = file;
	}
	else if (typeof file.path === 'string')
	{
		fileName = path.basename(file.path);
	}
	else
	{
		throw new Error('gulp-file-version-info: Missing path in file options');
	}

	function bufferContents(file, enc, cb)
	{
		// ignore empty files
		if (file.isNull())
		{
			cb();
			return;
		}

		// we don't do streams (yet)
		if (file.isStream())
		{
			this.emit('error', new Error('gulp-file-version-info: Streaming not supported'));
			cb();
			return;
		}

		// set latest file if not already set,
		// or if the current file was modified more recently.
		if (!latestMod || file.stat && file.stat.mtime > latestMod)
		{
			latestFile = file;
			latestMod = file.stat && file.stat.mtime;
		}

		// construct concat instance
		if (!concat)
		{
			concat = new Concat(isUsingSourceMaps, fileName, opt.newLine);
			concat.add(null, `<?php\n//gulp-file-version-info : ${new Date}\nreturn array(`);
		}

		// add file to concat instance
		let contentHash = hasha(file.contents, {algorithm: 'md5'})
		let line = `\n\t'${file.relative}' => '${contentHash}',`;
		// console.log([file.base, file.relative, file.cwd]);
		concat.add(file.relative, line);
		cb();
	}

	function endStream(cb)
	{
		// no files passed in, no file goes out
		if (!latestFile || !concat)
		{
			cb();
			return;
		}

		var joinedFile;

		// if file opt was a file path
		// clone everything from the latest file
		if (typeof file === 'string')
		{
			joinedFile = latestFile.clone({contents: false});
			joinedFile.path = path.join(latestFile.base, file);
		}
		else
		{
			joinedFile = new File(file);
		}
		concat.add(null, '\n);\n');

		joinedFile.contents = concat.content;

		this.push(joinedFile);
		cb();
	}

	return through.obj(bufferContents, endStream);
};
