const gulp = require('gulp');
const sass = require('gulp-sass');
const chug = require('gulp-chug');
const del = require('del')
const sourcemaps = require('gulp-sourcemaps');
const runsequence = require('run-sequence')
const base64 = require('gulp-base64')
const nodemon = require('gulp-nodemon')

const elementsDir = 'node_modules/dvla-internal-frontend-toolkit/';

gulp.task('run-dvla-gulp', () => {
    return gulp.src(`${elementsDir}gulpfile.js`)
        .pipe(chug())
});

// gulp.task('copy-styles', () => {
//     return gulp.src(`${elementsDir}vendor/assets/stylesheets/*.*`)
//         .pipe(gulp.dest('app/assets/stylesheets/'))
// })

gulp.task('copy-tick-of-truth', () => {
    return gulp.src('node_modules/tick-of-truth/tick-of-truth.js')
    .pipe(gulp.dest('public/javascripts/'));
})

gulp.task('copy-member', () => {
    return gulp.src('node_modules/member.js/member.js')
    .pipe(gulp.dest('public/javascripts/'));
})

gulp.task('clean', () => {
    return del('public');
})

gulp.task('default', () => {
    runsequence('run-dvla-gulp', ['copy-styles']);
});

gulp.task('develop', cb => {
    runsequence('build', 'watch', 'server');
})

gulp.task('watch', ['watch:styles', 'watch:scripts', 'watch:images'])

gulp.task('watch:styles', () => {
    return gulp.watch('app/assets/stylesheets/**/*.scss', ['styles'])
})

gulp.task('watch:scripts', () => {
    return gulp.watch('app/assets/javascripts/**/*.js', ['scripts'])
})

gulp.task('watch:images', () => {
    return gulp.watch('app/assets/images/**/*', ['images'])
})

gulp.task('styles', () => {
    return gulp.src('app/assets/stylesheets/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [`${elementsDir}app/assets/stylesheets`]
        }).on('error', sass.logError))
        .pipe(gulp.dest('public/stylesheets/'))
})

gulp.task('scripts', () => {
    return gulp.src('app/assets/javascripts/**/*.js')
        .pipe(gulp.dest('public/javascripts/'))
})

gulp.task('images', () => {
    return gulp.src(['app/assets/images/**/*', `${elementsDir}app/assets/images/**/*`])
        .pipe(gulp.dest('public/images/'))
})

gulp.task('fonts', () => {
    return gulp.src(`${elementsDir}app/assets/fonts/**/*`)
        .pipe(gulp.dest('public/fonts/'))
})

gulp.task('build', cb => {
    runsequence('clean', ['copy-member', 'copy-tick-of-truth', 'styles', 'images', 'fonts', 'scripts'], cb)
})

gulp.task('server', () => {
    nodemon({
        watch: ['.env', '**/*.js', '**/*.json'],
        script: 'app.js',
        ignore: [
            'public/*',
            'node_modules/*'
        ]
    })
})