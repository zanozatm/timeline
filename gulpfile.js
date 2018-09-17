'use strict';
const 	gulp    	 = require('gulp'),
		autoprefixer = require('gulp-autoprefixer'),
		sass		 = require('gulp-sass'),
		minifyCss	 = require('gulp-minify-css'),
		gcmq 		 = require('gulp-group-css-media-queries'),
		pug 		 = require('gulp-pug'),
		htmlbeautify = require('gulp-html-beautify'),
		plumber 	 = require('gulp-plumber'),
		notify 		 = require("gulp-notify"),

		browserSync	 = require('browser-sync'),
		reload 		 = browserSync.reload;

const	path 		 = {

		public: {
			html: 'public',
			js	: 'public/js',
			css : 'public/css'		
		},

		src: {
			pug  : "src/**/*.pug", 
			js	 : 'src/js/**/*.js',
			css  : 'src/css/**/*.scss'
		},

		watch: {
			pug  : "src/**/*.pug", 
			js	 : 'src/js/**/*.js',
			css  : 'src/css/**/*.scss'
		}
	};

gulp.task("webserver", function() {
	browserSync({
		server: {
			baseDir: "./public"
		},
		host: 'localhost',
		port: 3000
	});
});

gulp.task('pug:public', function() {
  	gulp.src(path.src.pug)
	  .pipe(plumber({
	          errorHandler: notify.onError()
	   }))
      .pipe(pug({
            pretty: true
        }))
      .pipe(gulp.dest(path.public.html))
      .pipe(htmlbeautify())
      .pipe(browserSync.stream());
});


gulp.task('js:public', function() {
	gulp.src(path.src.js)
	.pipe(rigger())
	.pipe(sourcemap.init())
	.pipe(sourcemap.write())
	.pipe(gulp.dest(path.public.js))
	.pipe(reload({stream: true}));
});

gulp.task('css:public', function() {
	gulp.src(path.src.css)
	.pipe(plumber({
	          errorHandler: notify.onError()
	   }))
	.pipe(sourcemap.init())
	.pipe(sass({
		includePaths: require('node-normalize-scss').includePaths
	}))
	.pipe(autoprefixer(['last 3 versions', '> 1%'], { cascade: true }))
	.pipe(gcmq())
	.pipe(minifyCss())
	.pipe(gulp.dest(path.public.css))
	.pipe(reload({stream: true}));
});

gulp.task('htmlbeautify', function() {
    var options = {
        indentSize: 2,
        unformatted: [
            // https://www.w3.org/TR/html5/dom.html#phrasing-content
             'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite',
            'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'ins', 'kbd', 'keygen', 'map', 'mark', 'math', 'meter', 'noscript',
            'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'small',
             'strong', 'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text',
            'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt'
        ]
    };
	gulp.src(path.src.pug)
	    .pipe(htmlbeautify(options))
	    .pipe(gulp.dest(path.public.html))
});

gulp.task('build', [
	'js:public',
	'css:public',
	'pug:public',
]);

gulp.task('watch', function() {
	watch([path.watch.js], function() {
		gulp.start('js:public');
	});
	watch([path.watch.css], function() {
		gulp.start('css:public');
	});
	watch([path.watch.pug], function() {
		gulp.start('pug:public');
	});

});

gulp.task('default', [
	'webserver',
	'watch',
	'build',	
]);