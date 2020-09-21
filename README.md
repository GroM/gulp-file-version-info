![status](https://secure.travis-ci.org/contra/gulp-concat.svg?branch=master)

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-file-version-info`

## Information

<table>
<tr>
<td>Package</td><td>gulp-file-version-info</td>
</tr>
<tr>
<td>Description</td>
<td>Generate file with hashes of files content</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>

## Usage

```js
var concat = require('gulp-file-version-info');

gulp.task('scripts', function() {
  return gulp.src('./lib/*.js')
    .pipe(concat('versioning.php'))
    .pipe(gulp.dest('./dist/'));
});
```

This will generate versioning information base on hash value (md5) of content for files. It generates file (currently php) which can be uses as for example information for assigning versioning param to url. It will take the base directory from the first file that passes through it.

Files will be concatenated in the order that they are specified in the `gulp.src` function. For example, to concat `./lib/file3.js`, `./lib/file1.js` and `./lib/file2.js` in that order, the following code will create a task to do that:

```js
var concat = require('gulp-file-version-info');

gulp.task('scripts', function() {
  return gulp.src(['./lib/file3.js', './lib/file1.js', './lib/file2.js'])
    .pipe(concat('versioning.php'))
    .pipe(gulp.dest('./dist/'));
});
```

To change the newLine simply pass an object as the second argument to concat with newLine being whatever (`\r\n` if you want to support any OS to look at it)

For instance:

```js
.pipe(concat('versioning.php', {newLine: ';'}))
```

To specify `cwd`, `path` and other [vinyl](https://github.com/wearefractal/vinyl) properties, gulp-file-version-info accepts `Object` as first argument:

```js
var concat = require('gulp-file-version-info');

gulp.task('scripts', function() {
  return gulp.src(['./lib/file3.js', './lib/file1.js', './lib/file2.js'])
    .pipe(concat({ path: 'versioning.php', stat: { mode: 0666 }}))
    .pipe(gulp.dest('./dist'));
});
```

This will generate file `./dist/versioning.php`.
