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
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('default', []);
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('dev', ['open', 'http-server', 'watch']);
  grunt.registerTask('demo', ['dev']);
};
