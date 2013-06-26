function Photo(){
    this.initValue=false;
    this.sourceCapture="off";
    this.initialize=function(pageid,imageArrayElement){
        this.currentPage=pageid;
        if(!this.initValue){
            this.imageArray=new Array();
            this.imageArrayElement=imageArrayElement;
            this.initValue=true;
        }               
    };
    this.initializeWithHtml_imgs=function(pageid,HTML_imgs,imageArrayElement){
        this.currentPage=pageid;
        this.imageArrayElement=imageArrayElement;
        // this.imageArray=new Array();
        // var toRemove ="data:image/jpeg;base64,",imgSrc,isMain;
        // if(typeof(HTML_imgs) !== "undefined"&&HTML_imgs!=null&&HTML_imgs.length>0){
        //     for (var imgIndex=0;imgIndex< HTML_imgs.length; imgIndex++) {
        //         isMain=$(HTML_imgs[imgIndex]).data("ismain");
        //         imgSrc=$(HTML_imgs[imgIndex]).attr("src");
        //         if(typeof(imgSrc) !== "undefined"){
        //             imgSrc=imgSrc.replace(toRemove,'');
        //         }
        //         this.imageArray.push([imgSrc,isMain=="true"?true:false]);
        //     };
        // }
        // toRemove=null;imgSrc=null;ismain=null;
        // delete toRemove;delete imgSrc;delete isMain;
    }
    this.capturePhoto=function(source,afterfunc) {
        if(navigator.camera){
            var sourceType;
            var o=this;
            if(source==null){
                sourceType=navigator.camera.PictureSourceType.CAMERA;
            }else if(source=="camera"){
                sourceType=navigator.camera.PictureSourceType.CAMERA;
            }else if(source=="album"){
                sourceType=navigator.camera.PictureSourceType.PHOTOLIBRARY;
            }else{
                sourceType=navigator.camera.PictureSourceType.CAMERA;
            }
            // Take picture using device camera and retrieve image as base64-encoded string
            navigator.camera.getPicture(
                function(imageData){                    
                    o.imageArray.push([imageData,false]);
                    o.refreshPicture(o.imageArrayElement);
                    o.sourceCapture="off";
                    afterfunc();
                }, 
                function(error) {
                    // alert(error);//避免取消選圖時彈出視窗，暫時關閉
                    o.sourceCapture="off";
                }, 
                { 
                    quality: 10,
                    correctOrientation: true,//讓圖片方向正確
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType:sourceType
                }
            );
        }else{
            alert("裝置不支援");
        }       
    };     
    this.refreshPicture=function(imageArrayElement){
        this.imageArrayElement=imageArrayElement;
        this.imageArrayElement.html('');
        if(this.imageArray.length>0){
            if(!this.isMainExisted()&&this.imageArray.length>0){
                this.imageArray[0][1]=true;
            }
            for(i in this.imageArray){
                var divElement = document.createElement("DIV");
                divElement.setAttribute("id","picdiv"+i);
                divElement.setAttribute("class","divLBSIMGList");
                var imageElement = document.createElement("IMG");
                var imgSrc=this.imageArray[i][0];
                if(imgSrc.indexOf("http://") !== -1){
                    imageElement.src = imgSrc;
                }else{
                    imageElement.src = "data:image/jpeg;base64,"+imgSrc;
                }
                imageElement.setAttribute("data-isMain",(this.imageArray[i][1]?"1":"0"));   
                divElement.appendChild(imageElement);           
                var ulElement=document.createElement("UL");
                var li1Element=document.createElement("LI");
                li1Element.setAttribute("class",(this.imageArray[i][1]?"enableSet":"disableSet"));
                var li2Element=document.createElement("LI");
                li2Element.setAttribute("class","delete");
                var mainbtn=document.createElement("INPUT");
                mainbtn.setAttribute("type","button");
                mainbtn.setAttribute("value",(this.imageArray[i][1]?"此為主圖":"設為主圖"));
                mainbtn.setAttribute("onclick","photo.setMain("+i+")");
                li1Element.appendChild(mainbtn);
                var deletebtn=document.createElement("INPUT");
                deletebtn.setAttribute("type","button");
                deletebtn.setAttribute("value","刪除此圖");
                deletebtn.setAttribute("id","picbtn"+i);
                deletebtn.setAttribute("onclick","photo.deletePhoto("+i+")");
                li2Element.appendChild(deletebtn);
                ulElement.appendChild(li1Element);
                ulElement.appendChild(li2Element);
                divElement.appendChild(ulElement);
                $(this.imageArrayElement).append(divElement);         
            }  
        }             
    };
    this.deletePhoto=function(id){
        this.imageArray.splice(id,1);
        this.refreshPicture(this.imageArrayElement);
    };
    this.clear=function(){
        this.imageArray=new Array();
        if(typeof(this.imageArrayElement)!=='undefined'){
            this.refreshPicture(this.imageArrayElement);
        }
    }
    this.setMain=function(id){
        for(i in this.imageArray){
            if(i==id){
                this.imageArray[i][1]=true;
            }else{
                this.imageArray[i][1]=false;
            }
        }
        this.refreshPicture(this.imageArrayElement);
    };
    this.isMainExisted=function(){
        for(i in this.imageArray){
            if(this.imageArray[i][1]==true){
                return true;    
            }
        }
        return false;
    };
    this.uploadPicture=function(url,filesArray,afterUpload){
        var o=this;     
        var options=new FileUploadOptions();
        options.fileKey="file";
        options.fileName="pic.jpg";
        options.mimeType="image/jpeg";      
    
        if(o.uploadIndex==null){
            o.ft=new FileTransfer();
            o.ft.onprogress=function(progressEvent){
                if (progressEvent.lengthComputable) {
                
                } else {
                
                }
            };
            
            o.uploadIndex=0;
            options.fileName="pic"+o.uploadIndex+".jpg";
            o.ft.upload(filesArray[o.uploadIndex][0],encodeURI(url),function(){
                o.uploadIndex++;
                console.log("sccessful:"+options.fileName);
                o.uploadPicture(url, filesArray, afterUpload);
            },function(error){
                console.log("An error has occurred: Code = " + error.code);
                console.log("upload error source " + error.source);
                console.log("upload error target " + error.target);
            },options);
        }else{
            if(o.uploadIndex<filesArray.length){
                options.fileName="pic"+o.uploadIndex+".jpg";
                o.ft.upload(filesArray[o.uploadIndex][0],encodeURI(url),function(){
                    o.uploadIndex++;
                    console.log("sccessful:"+options.fileName);
                    o.uploadPicture(url, filesArray, afterUpload);
                },function(error){
                    console.log("An error has occurred: Code = " + error.code);
                    console.log("upload error source " + error.source);
                    console.log("upload error target " + error.target);
                },options);
            }else{
                delete o.uploadIndex;
                delete o.ft;
                afterUpload();
            }
        }
    };
}