//initial setting
var LoadingObject=new Loading();
function Loading(){
 	var  theme = "f";
    var  msgText = LoadingString;
    // var msgText="123";
    var  textVisible =false;
    var  textonly = false;
    var  html ="";
    if(getAppSetting_Data()!=null&&getAppSetting_Data().language=="eng"){
      msgText=LoadingString_eng;
    }
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