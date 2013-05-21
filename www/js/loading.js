//initial setting
var LoadingObject=new Loading();
function Loading(){
 	var  theme = "f";
    var  msgText = LoadingString;
    var  textVisible ="true";
    var  textonly = "false";
    var  html ="";
	this.show=function() {
	  $.mobile.loading( 'show', {
          text: msgText,
          textVisible: textVisible,
          theme: theme,
          textonly: textonly,
          html: html
      });
	}
	this.hide=function() {
	  $.mobile.loading( 'hide' );
	}
}