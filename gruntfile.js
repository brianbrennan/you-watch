module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-beep');
	grunt.loadNpmTasks('grunt-sass');

	grunt.initConfig({
		uglify: {
			my_target: {
				files: {
					'components/script.js': ['components/js/*.js'],
					'app/app.min.js': ['app/main/*.js', 'app/controllers/*.js', 'app/routes/*.js', 'app/services/*.js']
				}, //files
				options: {
					mangle: false //very important to work with angular!
				}
			} //my_target
		}, //uglify
		watch: {
			scripts: {
				files: ['components/js/*.js','app/main/*.js', 'app/controllers/*.js', 'app/routes/*.js', 'app/services/*.js'],
				tasks: ['uglify'],
				options: {
					livereload: 35729,
					spawn: false
				}
			},//scripts
			sass: {
				files: ['components/scss/*.scss'],
				tasks: ['sass'],
				options: {
					livereload: 35729,
					spawn: false
				}
			},//sass
			html: {
				files: ['*.html', 'app/views/*.html'],
				options: {
					livereload: 35729,
					spawn: false
				}
			}//html
		},//watch
		connect:{
			port:8080
		},//connect
		sass: {
			options: {
				style: 'expanded'
				},
				dist: { 
     		 	files: {                         // Dictionary of files
        			'components/styles.css': 'components/scss/style.scss',       // 'destination': 'source'        			
        		}
        	}
		}//sass

	}); //initConfig

	grunt.registerTask('default', ['connect','watch']); 
	

}; //exports