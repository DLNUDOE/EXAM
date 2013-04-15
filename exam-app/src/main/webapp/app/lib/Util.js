Ext.define("Exam.lib.Util",{
	singleton:true,
	toJsonValueArray:function(arr,keys){
		var rs=[];
		for(var i=0;i<arr.length;i++){
			var item=[];
			for(var j=0;j<keys.length;j++){
				item.push(arr[i][keys[j]]||null);
			}
			rs.push(item);
		}
		return rs;
	}
});