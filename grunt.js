/*global config:true, task:true*/
module.exports = function(grunt) {

grunt.initConfig({
	pkg: '<json:package.json>',
	meta: {
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("m/d/yyyy") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
	},
	concat: {
		'src/jQuery plugins/existence.js': ['<banner>', '<file_strip_banner:existence.js>'],
        'src/jQuery plugins/serializeobject.js': ['<banner>', '<file_strip_banner:serializeobject.js>'],
        'src/jQuery plugins/urlparam.js': ['<banner>', '<file_strip_banner:urlparam.js>']
	},
	min: {
        'src/jQuery plugins/existence.min.js': ['<banner>', 'src/jQuery plugins/existence.js>'],
        'src/jQuery plugins/serializeobject.min.js': ['<banner>', 'src/jQuery plugins/serializeobject.js>'],
        'src/jQuery plugins/urlparam.min.js': ['<banner>', 'src/jQuery plugins/urlparam.js>']
	},
	zip: {
		dist: {
			src: [
				'src/jQuery plugins/*.js',
				'README.md',
				'grunt.js',
				'package.json',
				'test/**/*.*'
			],
			dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
		}
	},
	qunit: {
		files: ['test/index.html']
	},
	lint: {
		files: [
			'src/jQuery plugins/*.js'
		]
	},
	jshint: {
		options: {
			curly: true,
			eqeqeq: true,
			immed: true,
			latedef: true,
			newcap: true,
			noarg: true,
			sub: true,
			undef: true,
			eqnull: true,
			browser: true
		},
		globals: {
			jQuery: true,
			$: true,
			console: true
		}
	}
});

grunt.registerMultiTask('zip', 'Create a zip file for release', function() {
	var files = grunt.file.expand(this.file.src);
	// grunt.log.writeln(require('util').inspect(files));
	grunt.log.writeln("Creating zip file " + this.file.dest);

	var done = this.async();

	var zipstream = require('zipstream');
	var fs = require('fs');

	var out = fs.createWriteStream(this.file.dest);
	var zip = zipstream.createZip({ level: 1 });

	zip.pipe(out);

	function addFile() {
		if (!files.length) {
			zip.finalize(function(written) {
				grunt.log.writeln(written + ' total bytes written');
				done();
			});
			return;
		}
		var file = files.shift();
		grunt.log.verbose.writeln('Zipping ' + file);
		zip.addFile(fs.createReadStream(file), { name: file }, addFile);
	}
	addFile();
});

grunt.registerTask('default', 'lint qunit');
grunt.registerTask('release', 'default concat min zip');

};