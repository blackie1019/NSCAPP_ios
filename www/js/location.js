function Loc(){ 
    this.initialize=function(pageid,latElement,lngElement){
        this.currentPage=pageid;
        this.latElement=latElement;
        this.lngElement=lngElement;
    };
    this.clear=function(){
        this.mapElement=null;
        this.marker=null;
        this.currentLat=null;
        this.currentLng=null;
        this.address=null;
    }
    this.getSelf=function(){
        var o=this;
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                function(position){
                    o.currentLat=position.coords.latitude;
                    o.currentLng=position.coords.longitude;
                    $(o.latElement).val(o.currentLat);
                    $(o.lngElement).val(o.currentLng);
                } , 
                function(error){
                    alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
                },
                {timeout:5000}
            );                      
        }else{
           alert('GPRS發生問題無法使用');
        }   
    };
    this.getAddr=function(address){
        var geocoder=new google.maps.Geocoder(),o=this;
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var s=results[0].geometry.location;
                o.addrLat=s.lat();
                o.addrLng=s.lng();              
            } else {
                alert("起始地址有誤");
            }
        });
        geocoder=null;
        delete geocoder;
    };
    this.setAddr=function(addr){
        this.address=addr;
    };
    this.initializeMap=function(mapElement,lat,lng) {
        if(lat!=null&&lng!=null&&lat!=""&&lng!=""){
            this.currentLat=lat;
            this.currentLng=lng;
        }else if(this.currentLat==null&&this.currentLng==null){
            var point=getMapDefaultPoint();
            this.currentLat=point.lat;
            this.currentLng=point.lng;
        }
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        if(mapElement!=null){
            this.mapElement=mapElement;
        }
        this.map = new google.maps.Map(this.mapElement,{
            zoom: 15,
            center: new google.maps.LatLng(this.currentLat,this.currentLng),
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        this.directionsDisplay.setMap(this.map);
        //順序：定位點,地址,GPRS,mapDefaultPoint
        if(lat!=null&&lng!=null&&lat!=""&&lng!="")
        {
            this.setMarker(lat,lng);
        }else{        
            if(this.address!=null&&this.address!=""){
                this.searchPlace(this.address);
            }else{
                this.setMarker(this.currentLat,this.currentLng);
            }        
        }
        console.log(this.currentLat+","+this.currentLng);
    };
    this.setMarker=function(lat,lng){
        this.currentLat=lat;
        this.currentLng=lng;
        this.marker=new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(this.currentLat,this.currentLng),
            draggable:true
        });
        this.address="";
    };
    this.searchPlace=function(address){
        var geocoder=new google.maps.Geocoder(),o=this;
        if(this.marker!=null){
            this.marker.setMap(null);
        }
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                o.address=address;
                o.map.setCenter(results[0].geometry.location);
                o.marker = new google.maps.Marker({
                    map: o.map,
                    position: results[0].geometry.location,
                    draggable:true
                });
            } else {
                  // alert('查無指定地址或地標');
                alert("輸入地址有誤，請先確認地址是否為真實存在之地址");
            }
        });
        geocoder=null;
        delete geocoder;
    };
}

