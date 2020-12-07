"use strict";

// Load plugins
const browsersync = require("browser-sync").create();
const del = require("del");
const gulp = require("gulp");
const merge = require("merge-stream");

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./pages"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["./pages/vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // jquery
  var jquery = gulp.src([
      './node_modules/jquery/dist/**/*'
    ])
    .pipe(gulp.dest('./pages/vendor/jquery'));
  // tabler
  var tabler = gulp.src([
      './node_modules/@tabler/core/dist/**/*'
    ])
    .pipe(gulp.dest('./pages/vendor/tabler'));
  return merge(jquery, tabler);
}

// Watch files
function watchFiles() {
  gulp.watch("./**/*.css", browserSyncReload);
  gulp.watch("./**/*.html", browserSyncReload);
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;