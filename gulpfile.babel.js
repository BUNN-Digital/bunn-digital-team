import gulp from 'gulp'
import babelify from 'babelify'
import browserify from 'browserify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import childProcess from 'child_process'
import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import cleanCSS from 'gulp-clean-css'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import debug from 'gulp-debug'

/* === CONFIG === */
const paths = {

  designSystem: './node_modules/bunn-design-system/'

}

/**
 * Errors function
 */
const onError = (err) => {
  notify.onError({
    title: 'Gulp Error - Compile Failed',
    message: 'Error: <%= error.message %>'
  })(err)

  this.emit('end')
}

/* === CSS === */

export const compileCss = () => {
  return gulp.src('./css/main.css')
    .pipe(postcss())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist/css/'))
}

/* === DESIGN SYSTEM JS === */

export const copyDesignSystemJs = () => {
  return gulp.src(paths.designSystem + 'design-system/js/bunn-design-system.min.js')
    .pipe(gulp.dest('./dist/js/'))
}

/* === WATCH === */

const watch = (done) => {
  gulp.watch(paths.designSystem.src + './css/*.css', compileCss)
  gulp.watch(paths.designSystem.src + './js/**/*.js', copyDesignSystemJs)
  done()
}

/* === ELEVENTY === */

const eleventy = () => {
  const command = 'eleventy --config=eleventy.config.js --serve'

  return childProcess.spawn(command, {
    stdio: 'inherit',
    shell: true
  })
}

/* === TASKS === */

export const build = gulp.parallel(copyDesignSystemJs, compileCss)
export const dev = gulp.series(build, watch, eleventy)

export default build
