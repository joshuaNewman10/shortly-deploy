//1) wrapper function
module.exports = function(grunt) {
  //2) config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: 'public/client/*.js',
        dest: 'public/client/application.min.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        mangle: {
          except: ['jQuery', 'Backbone']
        },
        compress: true
      },
      target: {
        files:
         {
          'public/client/application.min.js': ['public/client/application.min.js']
        }
      }
    },

    jshint: {
      files: [
        'server.js',
        'public/client/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/styles-min.min.css': 'public/style.css'
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    }

    // buildcontrol: {
    //   options: {
    //     dir: './',
    //     commit: true,
    //     push: true,
    //     message: 'new build from commit on branch'
    //   },
    //   production: {
    //     options: {
    //       remote: 'azure',
    //       branch: 'master'
    //     }
    //   }
    // }
  });

  //3) load tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-build-control');

 ///4) register custom task
  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////


  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['cssmin', 'concat', 'uglify']);

  grunt.registerTask('deploy',function(n) {
    if(grunt.option('prod')) {
      //   console.log("flag3")
      // grunt.task.run([]);
      // grunt.task.run(['concat']);
      // grunt.task.run(['buildControl:production']);
    } else {
      grunt.task.run(['cssmin']);
      grunt.task.run(['concat']);
      grunt.task.run(['uglify']);
      grunt.task.run(['mochaTest']);
      grunt.task.run(['nodemon']);
    }
  });

//  grunt.registerTask('deploy',['jshint', 'cssmin','concat','uglify', 'mochaTest']);


};
