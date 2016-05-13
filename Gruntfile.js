const babel = require('rollup-plugin-babel');

const serverPort = 5000;

module.exports = function (grunt) {

  grunt.initConfig({
    jasmine: {
      pivotal: {
        src: ['tests/eee.*'],
        options: {
          specs: 'tests/*eee.js',
        },
      },
    },
    'http-server': {
      dev: {
        root: './',
        port: serverPort,
        showDir: true,
        autoIndex: true,
        ext: 'html',
        runInBackground: true,
        customPages: {
          '/readme': 'README.md',
        },
      },
    },
    watch: {
      js: {
        files: 'src/**/*.js',
        tasks: [],
        options: {
          livereload: true,
        },
      },
    },
    open: {
      demo: {
        path: `http://localhost:${serverPort}/demo/index.html`,
        app: 'google-chrome',
      },
    },
    rollup: {
      options: {
        banner: '"use strict";\n',
        plugins: function () {
          return [
            babel({
              exclude: './node_modules/**',
              presets: ['es2015-rollup'],
            }),
          ];
        },
      },
      main: {
        dest: 'dist/es6-fl-form.js',
        src: 'src/es6-fl-form.js', // Only one source file is permitted
      },
    },
  });

  grunt.loadNpmTasks('grunt-rollup');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('default', []);
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('dev', ['rollup', 'open', 'http-server', 'watch']);
  grunt.registerTask('demo', ['dev']);
};
