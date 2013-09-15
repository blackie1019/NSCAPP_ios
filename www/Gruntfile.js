module.exports = function(grunt) {

  //配置参数
  grunt.initConfig({
	pkg:grunt.file.readJSON('package.json'),
	concat: {
		basic_and_extras: {
		  files: {
		    'js/js.min/ios.min.js': [
	                 "js/ios/cordova-2.5.0.js",
	                 "js/ios/flurryPlugin.js"
	             ],
		    'js/js.min/android.min.js': [
	                 "js/android/cordova-2.7.0.js",
	                 "js/android/flurryPlugin.js"
	             ],
	        'js/js.min/nsc.min.js':[
	                 "js/app.js","js/setting.js","js/loading.js","js/location.js","js/data.js","js/map.js","js/menu.js",
	                 "js/pnpolygon.js"
	             ],
 	        'js/js.min/mobiscroll.2.4.3.min.js':[
				"js/mobiscroll.core.js",
				"js/mobiscroll.select.js",
				"js/mobiscroll.custom.js",
	        ],
	        'js/js.min/mobiscroll.2.5.0.min.js':[
				"js/mobiscroll.core-2.5.0..js",
				"js/mobiscroll.ios-2.5.0.js",
				"js/mobiscroll.datetime-2.5.0.js",
				"js/mobiscroll.select-2.5.0.js",
				"js/mobiscroll.custom-2.5.0.js"
	        ],
	        'js/js.min/core.min.js':[
				"js/jquery-1.8.2.min.js",
				"js/js.min/json2.min.js",
				"js/jquery.mobile-1.3.0.min.js",
				"js/jquery.hammer.min.js",
				"js/smoke.js"
	        ]
		  }
		}
	},
	uglify:{

	},
    cssmin: {
         options: {
             keepSpecialComments: 0
         },
         compress: {
             files: {
                 'css/nsc.min.css': [
                     "css/index.css",
                     "css/jquery.mobile-NSC-1.3.0.css",
                     "css/menu.css",
                     "css/mobiscroll.custom-2.4.3.min",
                   	 "css/mobiscroll.custom-2.5.0.min",
                   	 "css/smoke.min.css",
                     "css/smoke.theme.100s.min.css"
                 ]
             }
         }
     }
  });

  // Load the plugin that provides task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // Default task(s).
   grunt.registerTask('default', ['concat','cssmin']);
  // grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);

};