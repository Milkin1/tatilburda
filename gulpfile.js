// =========================Add plugins=========================
const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');
const browserSync = require('browser-sync').create(),
    gulp = require('gulp'),
    uglify = require('gulp-uglify-es').default,
    scss = require('gulp-sass')(require('sass')),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    fileinclude = require('gulp-file-include'),
    // const imagemin = require('gulp-imagemin');
    del = require('del'),
    sprite = require('gulp-svg-sprite'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter'),
    fs = require('fs');




const project_folder = require("path").basename(__dirname);
const src_folder = "#src";
const path = {
    build: {
        html: project_folder + "/",
        js: project_folder + "/js/",
        css: project_folder + "/css/",
        images: project_folder + "/img/",
        fonts: project_folder + "/fonts/"
    },
    src: {
        //favicon: src_folder + "/img/favicon.{jpg,png,svg,gif,ico,webp}",
        html: [src_folder + "/*.html", "!" + src_folder + "/$*.html"],
        // ==============================files that have to be ignore==================================
        js_ignore: [src_folder + "/js/swiper-bundle.min.js"],
        css_ignore: [src_folder + "/scss/swiper-bundle.min.css"],
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        js: src_folder + "/js/main.js",
        css: [src_folder + "/scss/$style.scss"],
        images: [src_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", "!**/favicon.*"],
        fonts: src_folder + "/fonts/*.ttf"
    },
    watch: {
        html: src_folder + "/**/*.html",
        js: src_folder + "/**/*.js",
        css: src_folder + "/scss/**/*.scss",
        images: src_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: src_folder + "/fonts/*.ttf"
    },
    clean: "./" + project_folder + "/"
};



// ========================Creat function for plugins=========================
function html() {
    return src(path.src.html)
        .pipe(plumber())
        .pipe(fileinclude())
        // .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream());
}

function css() {
    return src(path.src.css)
        .pipe(plumber({
            errorHandler: notify.onError({
                message: "Error: <%= error.message %>",
                title: "Scss error"
            })
        }))
        .pipe(
            scss({
                outputStyle: 'compressed'
            }).on('error', scss.logError)
        )
        .pipe(group_media())
        .pipe(autoprefixer({
            grid: true,
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        }))
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream());
}

function css_ignore() {
    return src(path.src.css_ignore, {
            allowEmpty: true
        })
        .pipe(dest(path.build.css))
}

function scripts() {
    return src(path.src.js)
        .pipe(plumber({
            errorHandler: notify.onError({
                message: "Error: <%= error.message %>",
                title: "JavaScript error"
            })
        }))
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(uglify( /* options */ ))
        .pipe(
            rename({
                // suffix: ".min",
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream());
}

function js_ignore() {
    return src(path.src.js_ignore)
        .pipe(dest(path.build.js))
}

function images() {
    return src(path.src.images)
        // .pipe(
        //     webp({
        //         quality: 75
        //     })
        // )
        .pipe(dest(path.build.images))
        .pipe(src(path.src.images))
        // .pipe(
        //     imagemin({
        //         progressive: true,
        //         svgoPlugins: [{
        //             removeViewBox: false
        //         }],
        //         interlaced: true,
        //         optimizationLevel: 3 // 0 to 7
        //     })
        // )
        .pipe(dest(path.build.images))
        .pipe(browserSync.stream());
}

gulp.task('sprite', function () {
    return src(src_folder + '/iconsprite/*.svg')
        .pipe(sprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg", //sprite file name
                    example: true
                }
            },
        }))
        .pipe(dest(path.build.images));
})

function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.stream());
}

function otf() {
    return src(src_folder + '/fonts/*.otf')
        .pipe(plumber())
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(src_folder + '/fonts/'));
}

function fontstyle() {
    let file_content = fs.readFileSync(src_folder + '/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(src_folder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(src_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}

function cb() {}

function clean() {
    return del(path.clean);
}

function watchFiles() {
    watch([path.watch.html], html);
    watch([path.watch.css], css);
    watch([path.watch.js], scripts);
    watch([path.watch.images], images);
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false,
        injectChanges: false,
        //if don't have internet. will open on localhost.
        online: true
    })
}

const build = series(clean, otf, parallel(html, css, css_ignore, scripts, js_ignore, images), fonts, fontstyle);



//=================================export to gulp.task========================
exports.html = html;
exports.css = css;
exports.css_ignore = css_ignore;
exports.scripts = scripts;
exports.js_ignore = js_ignore;
exports.images = images;
exports.fonts = fonts;
exports.otf = otf;
exports.fontstyle = fontstyle;
exports.browsersync = browsersync;
exports.build = build;
exports.default = parallel(browsersync, watchFiles, build);



// JS-функция определения поддержки WebP
// =================================================================================================================================
// function testWebP(callback) {

//     var webP = new Image();
//     webP.onload = webP.onerror = function () {
//         callback(webP.height == 2);
//     };
//     webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
// }

// testWebP(function (support) {

//     if (support == true) {
//         document.querySelector('body').classList.add('webp');
//     } else {
//         document.querySelector('body').classList.add('no-webp');
//     }
// });