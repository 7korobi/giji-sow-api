conf = require 'config'
gulp = require 'gulp'
$ = require('gulp-load-plugins')()

pipes = (src, list)->
  o = gulp.src src
  for item in list
    o = o.pipe item
  o

cp = ({ src, dst, pipe = [] })->
  pipes src, [
    $.newer dst
    ...pipe
    gulp.dest dst
  ]

amazon = ({ src, headers, pipe = [], options = {} })->
  giji = $.awspublish.create conf.aws,
    cacheFileName: ".awspublish-giji-assets"

  pipes src, [
    ...pipe
    giji.publish headers, options
    giji.cache()
    $.awspublish.reporter
      states: [
        'create'
        'update'
        'delete'
#        'cache'
#        'skip'
      ]
  ]


gulp.task "default", [], ->
  gulp.watch ["config/**", "api/**"], ["api"]
  gulp.start ["api", "cp", "stylus"], $.shell.task [
    "node server.js"
  ]

ext =
  br:  "static/**/*.{ttf,css}"
  gz:  "static/**/*.{json,js,svg,map}"
  img: 'static/**/*.{jpg,png,ico,woff,zip}'
  nop: 'static/**/*.{html}'

prod_base = ["api", "cp"]

gulp.task "prod", ["prod:br", "prod:gz"], ->

gulp.task "prod:br", prod_base, ->
  dst = "static/"
  pipes ext.br, [
    $.brotli.compress quality: 11
    gulp.dest dst
  ]

gulp.task "prod:gz", prod_base, ->
  dst = "static/"
  pipes ext.gz, [
    $.gzip gzipOptions: level: 9
    gulp.dest dst
  ]

gulp.task "amazon", ["amazon:br", "amazon:gz", "amazon:img"]

gulp.task "amazon:gz", [], ->
  amazon
    src: 'static/**/*.gz'
    headers:
      'Cache-Control': 'max-age=43200, no-transform, public'
      'Content-Encoding': 'gzip'
    pipe: [
      $.rename extname: ""
    ]

gulp.task "amazon:br", [], ->
  amazon
    src: 'static/**/*.br'
    headers:
      'Cache-Control': 'max-age=43200, no-transform, public'
      'Content-Encoding': 'br'
    pipe: [
      $.rename extname: ""
    ]

gulp.task "amazon:img", [], ->
  amazon
    src: ext.img
    headers:
      'Cache-Control': 'max-age=315360000, no-transform, public'
