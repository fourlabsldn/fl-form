module.exports = function (grunt) {

  grunt.initConfig({
    jasmine: {
      pivotal: {
        src: ['tests/eee.*'],
        options: {
          specs: 'tests/*eee.js',
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', []);
  grunt.registerTask('test', ['jasmine']);

};
