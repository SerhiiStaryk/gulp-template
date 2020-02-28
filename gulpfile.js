/*-----------------------------------styles------------------------------------------*/
const gulp = require('gulp');
/*npm install node-sass gulp-sass --save-dev*/
const sass = require('gulp-sass');
/*npm install --save-dev gulp-autoprefixer*/
const autoprefixer = require('gulp-autoprefixer');
/*npm install gulp-cssnano --save-dev*/
const cssnano = require('gulp-cssnano');
/*npm i gulp-rename --save-dev*/
const rename = require('gulp-rename');

/*-------------------------------------scripts------------------------------------------- */
/*npm install --save-dev gulp-concat*/
const concat = require('gulp-concat');
/*npm install --save-dev gulp-uglify-es*/
const uglify = require('gulp-uglify-es').default;

/*----------------------------------------image-------------------------------------------*/
/*npm install --save-dev gulp-image*/
const image = require('gulp-image');

/*----------------------------------------server------------------------------------------*/
/*npm install browser-sync gulp --save-dev*/
const browser = require('browser-sync').create();

/*--------------------------------------paths object-----------------------------------------*/
const paths = {
    html: {
        src: 'app/**/*.html',
        dest: 'build/'
    },

    styles: {
        src: 'app/styles/**/*.scss',
        dest: 'build/css'
    },

    scripts: {
        src: 'app/js/**/*.js',
        dest: 'build/scrits'
    },

    images: {
        src: 'app/img/**/*.*',
        dest: 'build/images'
    }
}
/*----------------------------functions--------------------------------------*/
function browserSync(done) {
    browser.init({
        server: {
            baseDir: './build',
            port: 3000
        }
    });
    done();
}

function browserSyncReload(done){
    browser.reload();
    done();
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browser.stream())
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browser.stream())
}

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browser.stream())
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(image())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browser.stream())
}

function watch() {
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
    gulp.watch('app/*.html', gulp.series(browserSyncReload));
}

const build = gulp.parallel(html, styles, scripts, images)

gulp.task('build', build);

gulp.task('default', gulp.parallel(watch, build, browserSync))