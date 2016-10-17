const babel = require('rollup-plugin-babel');

const serverPort = 5000;

module.exports = function (grunt) {

  grunt.initConfig({
    jasmine: {
      pivotal: {
        options: {
          polyfills: ['tests/helpers/promise-polyfill.js'],
          specs: 'tests/build/FlForm_Specs.js'
        }
      }
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
          '/readme': 'README.md'
        }
      }
    },
    watch: {
      js: {
        files: 'src/**/*.js',
        tasks: ['rollup'],
        options: {
          livereload: true
        }
      }
    },
    open: {
      demo: {
        path: `http://localhost:${serverPort}/demo/index.html`,
        app: 'google-chrome'
      }
    },
    rollup: {
      options: {
        banner: '"use strict";\n',
        plugins: () => {
          return [
            babel({
              // Function names leak to the global namespace. To avoid that,
              // let's just put everything within an immediate function, this way variables
              // are all beautifully namespaced.
              banner: '(function () {',
              footer: '}());',
              exclude: './node_modules/**',
              presets: ['es2015-rollup']
            })
          ];
        }
      },
      main: {
        src: 'src/controller.js', // Only one source file is permitted
        dest: 'dist/fl-form.js'
      },
      tests: {
        src: 'tests/src/FlForm_Specs.js', // Only one source file is permitted
        dest: 'tests/build/FlForm_Specs.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-rollup');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('default', []);
  grunt.registerTask('test', ['rollup', 'jasmine']);
  grunt.registerTask('dev', ['rollup', 'open', 'http-server', 'watch']);
  grunt.registerTask('demo', ['dev']);
};
