const conf = require('config')
const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const { start, watch, series, parallel } = require('gulp')

const ext = {
  br: 'static/**/*.{ttf,css}',
  gz: 'static/**/*.{json,js,svg,map}',
  img: 'static/**/*.{jpg,png,ico,woff,zip}',
  nop: 'static/**/*.{html}'
}

function cp({ src, dst }) {
  return gulp.src(src)
	.pipe($.newer(dst))
	// ... pipes
	.pipe(gulp.dest(dst))
}

function amazon_pipe(src, { headers, options = {} }) {
  const giji = $.awspublish.create(conf.aws, { cacheFileName: '.awspublish-giji-assets' })

  return src
    .pipe(giji.publish(headers, options))
    .pipe(giji.cache())
    .pipe(
      $.awspublish.reporter({
        states: [
          'create',
          'update',
          'delete'
          //        'cache'
          //        'skip'
        ]
      })
    )
}

exports.default = (done) => {
  watch(['config/**', 'api/**'], parallel(api))
  done()
}
exports.prod = series(prod_br, prod_gz)

function api(done) {
  done()
}

function prod_br(done) {
	return gulp.src(ext.br)
	.pipe($.brotli.compress({ quality: 11 }))
	.pipe(gulp.dest('static/'))
}

function prod_gz(done) {
	return gulp.src(ext.gz)
	.pipe($.gzip({ gzipOptions: { level: 9 } }))
	.pipe(gulp.dest('static/'))
}

exports.amazon = series(amazon_br, amazon_gz, amazon_img)
exports.amazon_gz = amazon_gz

function amazon_gz(done) {
  const src = gulp.src('static/**/*.gz').pipe($.rename({ extname: '' }))
  return amazon_pipe(src, {
    headers: {
      'Cache-Control': 'max-age=43200, no-transform, public',
      'Content-Encoding': 'gzip'
    }
  })
}

function amazon_br(done) {
  const src = gulp.src('static/**/*.br').pipe($.rename({ extname: '' }))

  return amazon_pipe(src, {
    headers: {
      'Cache-Control': 'max-age=43200, no-transform, public',
      'Content-Encoding': 'br'
    }
  })
}

function amazon_img(done) {
  const src = gulp.src(ext.img)

  return amazon_pipe(src, {
    headers: {
      'Cache-Control': 'max-age=315360000, no-transform, public'
    }
  })
}
