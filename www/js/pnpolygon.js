function point (lat,lng) {
	this.lat=lat;
	this.lng=lng;
}
function Polygon(){
	this.PolyPoints=[];
	this.clear=function(){
		this.PolyPoints=[];
	}
	this.addPolyPoints=function(newPoint){
		this.PolyPoints.push(newPoint);
	};
	this.addJSONsPolyPoints=function(JSONPointArray){
		for (var index =0;index<JSONPointArray.length; index++) {

			this.PolyPoints.push(new point(JSONPointArray[index].lat,JSONPointArray[index].lng));
		};
	}
	this.isPointIn=function(targetPoint){
			for(var c = false, i_index= -1, l_index = this.PolyPoints.length, j_index = l_index - 1; ++i_index < l_index; j_index = i_index)
				((this.PolyPoints[i_index].lng <= targetPoint.lng && targetPoint.lng < this.PolyPoints[j_index].lng) || (this.PolyPoints[j_index].lng <= targetPoint.lng && targetPoint.lng < this.PolyPoints[i_index].lng))
				&& (targetPoint.lat < (this.PolyPoints[j_index].lat - this.PolyPoints[i_index].lat) * (targetPoint.lng - this.PolyPoints[i_index].lng) / (this.PolyPoints[j_index].lng - this.PolyPoints[i_index].lng) + this.PolyPoints[i_index].lat)
				&& (c = !c);
			return c;
	};
}
