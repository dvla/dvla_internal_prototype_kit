const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del')
const runsequence = require('run-sequence')
const nodemon = require('gulp-nodemon')

const elementsDir = 'node_modules/dvla-internal-frontend-toolkit/';

gulp.task('clean', () => {
    return del('public');
})

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
        .pipe(sass({
            includePaths: [`${elementsDir}app/assets/stylesheets`]
        }).on('error', sass.logError))
        .pipe(gulp.dest('public/stylesheets/'))
})

gulp.task('scripts', () => {
    return gulp.src(['app/assets/javascripts/**/*.js', 'node_modules/tick-of-truth/tick-of-truth.js', 'node_modules/member.js/member.js', 'node_modules/timmy.js/timmy.js'])
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
    runsequence('clean', ['styles', 'images', 'fonts', 'scripts'], cb)
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