  $(function () 
  {
  	//LBS
	$('#mobiScroll_LBS_ParkBase').mobiscroll().select({		
		theme: 'ios',
		label:'Name',
		inputClass:'i-txt',
		display: 'bottom',
		mode: 'scroller',
		setText: '確定',
		cancelText: '取消',
        group: true,
        label: '基地',
        groupLabel: '園區'
	});  
	$('#mobiScroll_LBS_classify').mobiscroll().select({
		theme: 'ios',
		label:'Name',
		inputClass:'i-txt',
		display: 'bottom',
		mode: 'scroller',
		setText: '確定',
		cancelText: '取消',
    	group: true,
        label: '次分類',
        groupLabel: '大分類'
	});   
});