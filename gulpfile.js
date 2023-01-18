const {src, dest, watch, series} = require('gulp')

// SCSS
const sass = require('gulp-sass')(require('sass'))
const groupMediaQueries = require('gulp-group-css-media-queries')
const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')

// JS
const fileInclude = require('gulp-file-include')
const uglify = require('gulp-uglify-es').default

// IMG
const tinify = require('gulp-tinify');

const clean = require('gulp-clean')
const rename = require('gulp-rename')
const sourceMaps = require('gulp-sourcemaps')

const pathSrc = './src/'
const pathDest = './assets/'

const path = {
  src: {
    css: pathSrc + 'scss/main.scss',
    js: pathSrc + 'js/main.js',
    img: pathSrc + 'images/**/*.+(jpg|png|webp|gif)',
  },

  build: {
    css: pathDest + 'css',
    js: pathDest + 'js',
    img: pathDest + 'img',
  },

  watch: {
    css: pathSrc + 'scss/**/*.+(sass|scss)',
    js: pathSrc + 'js/**/*.js',
    img: pathSrc + 'images/**/*.+(jpg|png|webp|gif)',
  }
}

function styles() {
  return src(path.src.css, { allowEmpty: true })
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(groupMediaQueries())
    .pipe(autoprefixer())
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourceMaps.write('./'))
    .pipe(dest(path.build.css))
}

function scripts() {
  return src(path.src.js, { allowEmpty: true })
    .pipe(sourceMaps.init())
    .pipe(fileInclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourceMaps.write('./'))
    .pipe(dest(path.build.js))
}

function images() {
  return src(path.src.img, { allowEmpty: true })
    .pipe(tinify('jw6vTCCMhzVVd9n7t4fHs5TwsjrrPfyS'))
    .pipe(dest(path.build.img))
}

function clear() {
  return src(pathDest, { allowEmpty: true })
    .pipe(clean())
}

function startWatch() {
  watch(path.watch.css, styles)
  watch(path.watch.js, scripts)
  watch(path.watch.img, images)
}

function watchStyles() {
  watch(path.watch.css, styles)
}

function watchScripts() {
  watch(path.watch.js, scripts)
}

function watchImages() {
  watch(path.watch.img, images)
}

exports.styles = styles
exports.scripts = scripts
exports.images = images
exports.clear = clear
exports.watchStyles = watchStyles
exports.watchScripts = watchScripts
exports.watchImages = watchImages

exports.build = series(clear, styles, scripts, images)
exports.default = startWatch