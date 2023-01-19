const {src, dest, watch, series} = require('gulp')
const browserSync = require('browser-sync').create()

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

// FONTS
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')

const clean = require('gulp-clean')
const rename = require('gulp-rename')
const sourceMaps = require('gulp-sourcemaps')

const pathSrc = './src/'
const pathDest = './assets/'

const path = {
  src: {
    html:  pathSrc + '**/*.html',
    css:   pathSrc + 'scss/main.scss',
    js:    pathSrc + 'js/main.js',
    img:   pathSrc + 'images/**/*.+(jpg|png|webp|gif)',
    fonts: pathSrc + 'fonts/*.+(ttf|otf)',
  },

  build: {
    html: './',
    css:   pathDest + 'css',
    js:    pathDest + 'js',
    img:   pathDest + 'img',
    fonts: pathDest + 'fonts',
  },

  watch: {
    html:  pathSrc + '**/*.html',
    css:   pathSrc + 'scss/**/*.+(sass|scss)',
    js:    pathSrc + 'js/**/*.js',
    img:   pathSrc + 'images/**/*.+(jpg|png|webp|gif)',
    fonts: pathSrc + 'fonts/*.+(ttf|otf)',
  }
}

function html() {
  return src(path.src.html)
    .pipe(fileInclude())
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream())
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
    .pipe(browserSync.stream())
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
    .pipe(browserSync.stream())
}

function images() {
  return src(path.src.img, { allowEmpty: true })
    .pipe(tinify('jw6vTCCMhzVVd9n7t4fHs5TwsjrrPfyS'))
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream())
}

function fontsWoff() {
  return src(path.src.fonts, { allowEmpty: true })
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
    .pipe(browserSync.stream())
}

function fontsWoff2() {
  return src(path.src.fonts, { allowEmpty: true })
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
    .pipe(browserSync.stream())
}

function clear() {
  return src([pathDest, '*.html'], { allowEmpty: true })
    .pipe(clean())
}

function startWatch() {
  watch(path.watch.html, html)
  watch(path.watch.css, styles)
  watch(path.watch.js, scripts)
  watch(path.watch.img, images)
  watch(path.watch.fonts, fontsWoff)
  watch(path.watch.fonts, fontsWoff2)
}

function watchHtml() {
  watch(path.watch.html, html)
}

function watchStyles() {
  watch(path.watch.css, styles)
}

function watchScripts() {
  watch(path.watch.js, scripts)
}

function live() {
  browserSync.init({
    server: {
      baseDir: './',
    },
    notify: false,
  })
  startWatch()
}

exports.live = live
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.images = images
exports.fonts = series(fontsWoff, fontsWoff2)
exports.clear = clear
exports.watchHtml = watchHtml
exports.watchStyles = watchStyles
exports.watchScripts = watchScripts

exports.build = series(clear, html, styles, scripts, images, fontsWoff, fontsWoff2)
exports.default = startWatch