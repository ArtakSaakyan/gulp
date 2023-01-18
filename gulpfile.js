const {src, dest, watch, series} = require('gulp')

// SCSS
const sass = require('gulp-sass')(require('sass'))
const groupMediaQueries = require('gulp-group-css-media-queries')
const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')

// JS
const fileInclude = require('gulp-file-include')
const uglify = require('gulp-uglify-es').default

const clean = require('gulp-clean')
const rename = require('gulp-rename')
const sourceMaps = require('gulp-sourcemaps')

const pathSrc = './src/'
const pathDest = './assets/'

const path = {
  src: {
    css: pathSrc + 'scss/main.scss',
    js: pathSrc + 'js/main.js',
  },

  build: {
    css: pathDest + 'css',
    js: pathDest + 'js',
  },

  watch: {
    css: pathSrc + 'scss/**/*.+(sass|scss)',
    js: pathSrc + 'js/**/*.js',
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

function clear() {
  return src(pathDest, {allowEmpty: true})
    .pipe(clean())
}

function startWatch() {
  watch(path.watch.css, styles)
  watch(path.watch.js, scripts)
}

function watchStyles() {
  watch(path.watch.css, styles)
}

function watchScripts() {
  watch(path.watch.js, scripts)
}

exports.styles = styles
exports.scripts = scripts
exports.clear = clear
exports.watchStyles = watchStyles
exports.watchScripts = watchScripts

exports.build = series(clear, styles, scripts)
exports.default = startWatch