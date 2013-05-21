(function(obj){

	var uiExtend = function(type, item){
		var _ITEM = item,
			_TYPE = type,
			uiCommons = {
				
				attr: function(attrName, obj){
					if(arguments.length === 1){
						return _ITEM.getContext().attr(attrName);	
					}
					var i,
	       				subArray = _ITEM.subscribers(attrName),
	       				subArraySize = subArray.length;
	       			if(typeof obj === "function"){
	       				obj({ 
	       					success: function(value){
	       						console.log("Set " + attrName + ": " + value);
	       						_ITEM.getContext().attr(attrName, value);
	       						if(typeof _ITEM.refresh !== "undefined"){
	       							console.log('Item Refresh!!');
	       							_ITEM.refresh();
	       						}
	       						for(i=0;i<subArraySize;i++){
	       							subArray[i].handler(value);
	       							if(subArray[i].type === 'once'){
	       								subArray.splice(i,1);
	       							}
	       						}
	       					} 
	       				});
	       				return;
	       			}
	       			console.log("Set " + attrName + ": " + obj);
	       			_ITEM.getContext().attr(attrName, obj);
	       			if(typeof _ITEM.refresh !== "undefined"){
	       				console.log('Item Refresh!!');
	       				_ITEM.refresh();
	       			}
	       			for(i=0;i<subArraySize;i++){
	       				subArray[i].handler(obj);
	       				if(subArray[i].type === 'once'){
	       					subArray.splice(i,1);
	       				}
	       			}  
				},
				
				text: function(obj){
					if(arguments.length === 0){
						return _ITEM.getContext().text();
					}
	       			if(typeof obj === "function"){
	       				obj({ 
	       					success: function(value){
	       						console.log("Set Label: " + value);
	       						_ITEM.getContext().text(value);
	       					} 
	       				});
	       				return;
	       			}
	       			console.log("Set Label : " + obj);
	       			_ITEM.getContext().text(obj);
				},
				
				label: function(obj){
					if(arguments.length === 0){
						return $('label[for="' + _ITEM.getRealID() + '"]').text();
					}
	       			if(typeof obj === "function"){
	       				obj({ 
	       					success: function(value){
	       						console.log("Set Label: " + value);
	       						$('label[for="' + _ITEM.getRealID() + '"]').text(value);
	       					} 
	       				});
	       				return;
	       			}
	       			console.log("Set Label : " + obj);
	       			$('label[for="' + _ITEM.getRealID() + '"]').text(obj);
				}
			},
			uiContexts = {
				text: function(){
					_ITEM.registerProperty({
						name: 'value',
						getter: function(){
							return uiCommons.attr('value');
						},
						setter: function(obj){
							uiCommons.attr('value', obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'label',
						getter: function(){
							return uiCommons.label();
						},
						setter: function(obj){
							uiCommons.label(obj);
						}
					});
					
					return this;
				},
				
				textarea: function(){
					_ITEM.registerProperty({
						name: 'label',
						getter: function(){
							return uiCommons.label();
						},
						setter: function(obj){
							uiCommons.label(obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'text',
						getter: function(){
							return uiCommons.text();
						},
						setter: function(obj){
							uiCommons.text(obj);
						}
					});
					
					return this;
				},
				
				toggle: function(){
					_ITEM.registerProperty({
						name: 'label',
						getter: function(){
							return uiCommons.label();
						},
						setter: function(obj){
							uiCommons.label(obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'off-display',
						getter: function(){
							return _ITEM.getContext().children('option[value="0"]').text();
						},
						setter: function(obj){
							_ITEM.getContext().children('option[value="0"]').text(obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'on-display',
						getter: function(){
							return _ITEM.getContext().children('option[value="1"]').text();
						},
						setter: function(obj){
							_ITEM.getContext().children('option[value="1"]').text(obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'value',
						getter: function(){
							return _ITEM.getContext().val();
						},
						setter: function(obj){
							_ITEM.getContext().val(obj);
						}
					});
					
					return this
				}, 
				
				password: function(){
					_ITEM.registerProperty({
						name: 'value',
						getter: function(){
							return uiCommons.attr('value');
						},
						setter: function(obj){
							uiCommons.attr('value', obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'label',
						getter: function(){
							return uiCommons.label();
						},
						setter: function(obj){
							uiCommons.label(obj);
						}
					});
					
					return this;
				},
				
				search: function(){
					_ITEM.registerProperty({
						name: 'value',
						getter: function(){
							return uiCommons.attr('value');
						},
						setter: function(obj){
							uiCommons.attr('value', obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'label',
						getter: function(){
							return uiCommons.label();
						},
						setter: function(obj){
							uiCommons.label(obj);
						}
					});
					
					return this;
				},
				
				slider: function(){
					_ITEM.registerProperty({
						name: 'label',
						getter: function(){
							return uiCommons.label();
						},
						setter: function(obj){
							uiCommons.label(obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'value',
						getter: function(){
							return uiCommons.attr('value');
						},
						setter: function(obj){
							uiCommons.attr('value', obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'step',
						getter: function(){
							return uiCommons.attr('step');
						},
						setter: function(obj){
							uiCommons.attr('step', obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'min',
						getter: function(){
							return uiCommons.attr('min');
						},
						setter: function(obj){
							uiCommons.attr('min', obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'max',
						getter: function(){
							return uiCommons.attr('max');
						},
						setter: function(obj){
							uiCommons.attr('max', obj);
						}
					});
					
					this.refresh = function(){
						_ITEM.getContext().slider('refresh');
					};
					
					return this;
				},
				
				image: function(){
					_ITEM.registerProperty({
						name: 'src',
						getter: function(){
							return uiCommons.attr('src');
						},
						setter: function(obj){
							uiCommons.attr('src', obj);
						}
					});
					
					return this;
				},
				
				submit: function(){
					_ITEM.registerProperty({
						name: 'display',
						getter: function(){
							return uiCommons.text();
						},
						setter: function(obj){
							uiCommons.text(obj);
						}
					});
					
					return this;
				},
				
				button: function(){
					_ITEM.registerProperty({
						name: 'display',
						getter: function(){
							return uiCommons.text();
						},
						setter: function(obj){
							uiCommons.text(obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'icon',
						getter: function(){
							return uiCommons.attr('data-icon');
						},
						setter: function(obj){
							uiCommons.attr('data-icon', obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'iconpos',
						getter: function(){
							return uiCommons.attr('data-iconpos');
						},
						setter: function(obj){
							uiCommons.attr('data-iconpos', obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'link',
						getter: function(){
							return uiCommons.attr('href');
						},
						setter: function(obj){
							uiCommons.attr('href', obj);
						}
					});
					
					return this;
				},
				
				select: function(){
					_ITEM.registerProperty({
						name: 'label',
						getter: function(){
							return uiCommons.label();
						},
						setter: function(obj){
							uiCommons.label(obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'selectedValue',
						getter: function(){
							return _ITEM.getContext().val();
						},
						setter: function(obj){
							var oriValue = _ITEM.getContext().val();
			       			_ITEM.getContext().val(obj);
			       			if(oriValue !== obj){
			       				_ITEM.getContext().trigger('change');
			       			}
						}
					});
					
					this.refresh = function(){
						_ITEM.getContext().selectmenu('refresh');
					};
					
					this.getItems = function(){
						return _ITEM.getContext().children('option');
					};
					
					return this;
				},
				
				radio: function(){
					_ITEM.registerProperty({
						name: 'label',
						getter: function(){
							return _ITEM.getContext().children('legend').text();
						},
						setter: function(obj){
							_ITEM.getContext().children('legend').text(obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'checkedValue',
						getter: function(){
							return $('input[name="' + _ITEM.getRealID() + '"]:checked').val();
						},
						setter: function(obj){
							var checkItem = $('input[name="' + _ITEM.getRealID() + '"][value="' + obj + '"]'); 
							checkItem.attr('checked',true);
							$('input[name="' + _ITEM.getRealID() + '"]').each(function(){
								var label = $('label[for="' + $(this).attr('id') + '"]').removeClass('ui-btn-active');
							});
							$('label[for="' + checkItem.attr('id') + '"]').addClass('ui-btn-active');
						}
					});
				
					this.refresh = function(){
						_ITEM.getContext().trigger("create");
					};
					
					this.getItems = function(){
						return _ITEM.getContext().children('input[type="radio"]');
					};
					
					this.getSelectedItem = function(){
						return $('input[name="' + _ITEM.getRealID() + '"]:checked');
					};
					
					return this;
				},
				
				checkbox: function(){
					_ITEM.registerProperty({
						name: 'label',
						getter: function(){
							return _ITEM.getContext().children('legend').text();
						},
						setter: function(obj){
							_ITEM.getContext().children('legend').text(obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'checkedValue',
						getter: function(){
							var i,
								result = [];
							$('input[type="checkbox"][name="' + _ITEM.getRealID() + '"]:checked').each(function(){
								result.push($(this).val());
							});
							return result;
						},
						setter: function(obj){
							var item = $('input[type="checkbox"][value="' + obj + '"]');
							item.attr('checked',true);
							$('label[for="' + item.attr('id') + '"]').removeClass('ui-checkbox-off');
							$('label[for="' + item.attr('id') + '"]').addClass('ui-checkbox-on');
							$('label[for="' + item.attr('id') + '"] .ui-btn-inner .ui-icon').removeClass('ui-icon-checkbox-off');
							$('label[for="' + item.attr('id') + '"] .ui-btn-inner .ui-icon').addClass('ui-icon-checkbox-on');
						}
					});
				
					this.refresh = function(){
						var pageid = _ITEM.getRealID().substring(0, _ITEM.getRealID().indexOf('_'));
						HYWEBAPP.page(pageid).getContext().trigger("create");
					};
					
					this.clear = function(){
						$('input[type="checkbox"][name="' + _ITEM.getRealID() + '"]').each(function(){
							$(this).attr('checked', false);
							$('label[for="' + $(this).attr('id') + '"]').removeClass('ui-checkbox-on');
							$('label[for="' + $(this).attr('id') + '"]').addClass('ui-checkbox-off');
							$('label[for="' + $(this).attr('id') + '"] .ui-btn-inner .ui-icon').removeClass('ui-icon-checkbox-on');
							$('label[for="' + $(this).attr('id') + '"] .ui-btn-inner .ui-icon').addClass('ui-icon-checkbox-off');
						});
					};
					
					this.selectAll = function(){
						$('input[type="checkbox"][name="' + _ITEM.getRealID() + '"]').each(function(){
							$(this).attr('checked', true);
							$('label[for="' + $(this).attr('id') + '"]').removeClass('ui-checkbox-off');
							$('label[for="' + $(this).attr('id') + '"]').addClass('ui-checkbox-on');
							$('label[for="' + $(this).attr('id') + '"] .ui-btn-inner .ui-icon').removeClass('ui-icon-checkbox-off');
							$('label[for="' + $(this).attr('id') + '"] .ui-btn-inner .ui-icon').addClass('ui-icon-checkbox-on');
						});
					};
					
					this.getItems = function(){
						return _ITEM.getContext().children('input[type="checkbox"]');
					};
					
					return this;
				},
				
				carousel: function(){
					return this;
				},
				
				scroller: function(){
					_ITEM.registerProperty({
						name: 'value',
						getter: function(){
							return _ITEM.getContext().val();
						},
						setter: function(obj){
							_ITEM.getContext().val(obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'label',
						getter: function(){
							return uiCommons.label();
						},
						setter: function(obj){
							uiCommons.label(obj);
						}
					});
				
					return this;
				},
				
				datepicker: function(){
					_ITEM.registerProperty({
						name: 'mode',
						getter: function(){
							var datepickerMode = _ITEM.getContext().data('datebox').options.mode,
								result = "";
							if(datepickerMode === "calbox"){
								result = "calendar";
							}else if(datepickerMode === "datebox"){
								result = "date";
							}else if(datepickerMode === "flipbox"){
								result = "flip";
							}else if(datepickerMode === "slidebox"){
								result = "slide";
							}else if(datepickerMode === "timebox"){
								result = "time";
							}else if(datepickerMode === "timeflipbox"){
								result = "timeflip";
							}else if(datepickerMode === "durationbox"){
								result = "duration";
							}
							return result;
						},
						setter: function(obj){
							var datepickerMode = ''; 
							if(typeof obj === "function"){
			       				obj({ 
			       					success: function(value){
			       						if(value === "calendar"){
											datepickerMode = "calbox";
										}else if(value === "date"){
											datepickerMode = "datebox";
										}else if(value === "flip"){
											datepickerMode = "flipbox";
										}else if(value === "slide"){
											datepickerMode = "slidebox";
										}else if(value === "time"){
											datepickerMode = "timebox";
										}else if(value === "timeflip"){
											datepickerMode = "timeflipbox";
										}else if(value === "duration"){
											datepickerMode = "durationbox";
										}
			       						_ITEM.getContext().data('datebox').options.mode = datepickerMode;
			       					} 
			       				});
			       				return;
			       			}
			       			if(obj === "calendar"){
								datepickerMode = "calbox";
							}else if(obj === "date"){
								datepickerMode = "datebox";
							}else if(obj === "flip"){
								datepickerMode = "flipbox";
							}else if(obj === "slide"){
								datepickerMode = "slidebox";
							}else if(obj === "time"){
								datepickerMode = "timebox";
							}else if(obj === "timeflip"){
								datepickerMode = "timeflipbox";
							}else if(obj === "duration"){
								datepickerMode = "durationbox";
							}
			       			_ITEM.getContext().data('datebox').options.mode = datepickerMode;
						}
					});
					
					_ITEM.registerProperty({
						name: 'before-today',
						getter: function(){
							return _ITEM.getContext().data('datebox').options.beforeToday;
						},
						setter: function(obj){
							if(typeof obj === "function"){
			       				obj({ 
			       					success: function(value){
			       						_ITEM.getContext().data('datebox').options.beforeToday = value;
			       					} 
			       				});
			       				return;
			       			}
			       			_ITEM.getContext().data('datebox').options.beforeToday = obj;
						}
					});
					
					_ITEM.registerProperty({
						name: 'after-today',
						getter: function(){
							return _ITEM.getContext().data('datebox').options.afterToday;
						},
						setter: function(obj){
							if(typeof obj === "function"){
			       				obj({ 
			       					success: function(value){
			       						_ITEM.getContext().data('datebox').options.afterToday = value;
			       					} 
			       				});
			       				return;
			       			}
			       			_ITEM.getContext().data('datebox').options.afterToday = obj;
						}
					});
					
					_ITEM.registerProperty({
						name: 'not-today',
						getter: function(){
							return _ITEM.getContext().data('datebox').options.notToday;
						},
						setter: function(obj){
							if(typeof obj === "function"){
			       				obj({ 
			       					success: function(value){
			       						_ITEM.getContext().data('datebox').options.notToday = value;
			       					} 
			       				});
			       				return;
			       			}
			       			_ITEM.getContext().data('datebox').options.notToday = obj;
						}
					});
					
					_ITEM.registerProperty({
						name: 'min-days',
						getter: function(){
							return _ITEM.getContext().data('datebox').options.minDays;
						},
						setter: function(obj){
							if(typeof obj === "function"){
			       				obj({ 
			       					success: function(value){
			       						_ITEM.getContext().data('datebox').options.minDays = parseInt(value,10);
			       					} 
			       				});
			       				return;
			       			}
			       			_ITEM.getContext().data('datebox').options.minDays = parseInt(obj,10);
						}
					});
					
					_ITEM.registerProperty({
						name: 'max-days',
						getter: function(){
							return _ITEM.getContext().data('datebox').options.maxDays;
						},
						setter: function(obj){
							if(typeof obj === "function"){
			       				obj({ 
			       					success: function(value){
			       						_ITEM.getContext().data('datebox').options.maxDays = parseInt(value,10);
			       					} 
			       				});
			       				return;
			       			}
			       			_ITEM.getContext().data('datebox').options.maxDays = parseInt(obj,10);
						}
					});
					
					_ITEM.registerProperty({
						name: 'min-hour',
						getter: function(){
							return _ITEM.getContext().data('datebox').options.minHour;
						},
						setter: function(obj){
							if(typeof obj === "function"){
			       				obj({ 
			       					success: function(value){
			       						_ITEM.getContext().data('datebox').options.minHour = parseInt(value,10);
			       					} 
			       				});
			       				return;
			       			}
			       			_ITEM.getContext().data('datebox').options.minHour = parseInt(obj,10);
						}
					});
					
					_ITEM.registerProperty({
						name: 'max-hour',
						getter: function(){
							return _ITEM.getContext().data('datebox').options.maxHour;
						},
						setter: function(obj){
							if(typeof obj === "function"){
			       				obj({ 
			       					success: function(value){
			       						_ITEM.getContext().data('datebox').options.maxHour = parseInt(value,10);
			       					} 
			       				});
			       				return;
			       			}
			       			_ITEM.getContext().data('datebox').options.maxHour = parseInt(obj,10);
						}
					});
					
					_ITEM.registerProperty({
						name: 'show-clear',
						getter: function(){
							return _ITEM.getContext().data('datebox').options.useClearButton;
						},
						setter: function(obj){
							if(typeof obj === "function"){
			       				obj({ 
			       					success: function(value){
			       						_ITEM.getContext().data('datebox').options.useClearButton = value;
			       					} 
			       				});
			       				return;
			       			}
			       			_ITEM.getContext().data('datebox').options.useClearButton = obj;
						}
					});
					
					_ITEM.registerProperty({
						name: 'modal-popup',
						getter: function(){
							return _ITEM.getContext().data('datebox').options.dialogForce;
						},
						setter: function(obj){
							if(typeof obj === "function"){
			       				obj({ 
			       					success: function(value){
			       						_ITEM.getContext().data('datebox').options.dialogForce = value;
			       					} 
			       				});
			       				return;
			       			}
			       			_ITEM.getContext().data('datebox').options.dialogForce = obj;
						}
					});
					
					_ITEM.registerProperty({
						name: 'inline',
						getter: function(){
							return _ITEM.getContext().data('datebox').options.useInline;
						},
						setter: function(obj){
							if(typeof obj === "function"){
			       				obj({ 
			       					success: function(value){
			       						_ITEM.getContext().data('datebox').options.useInline = value;
			       						if(value === true){
						       				_ITEM.getContext().data('datebox').options.useImmediate = true;
						       				_ITEM.getContext().data('datebox').options.hideInput = true;
						       			}
			       					} 
			       				});
			       				return;
			       			}
			       			_ITEM.getContext().data('datebox').options.useInline = obj;
			       			if(obj === true){
			       				_ITEM.getContext().data('datebox').options.useImmediate = true;
			       				_ITEM.getContext().data('datebox').options.hideInput = true;
			       			}
						}
					});
					
					_ITEM.registerProperty({
						name: 'trigger',
						getter: function(){
							var isButton = _ITEM.getContext().data('datebox').options.useButton,
								isFocus = _ITEM.getContext().data('datebox').options.useFocus;
							if(isButton === true && isFocus === false){
								return "button";
							}
							if(isButton === false && isFocus === true){
								return "focus";
							}
							if(isButton === true && isFocus === true){
								return "both";
							}
						},
						setter: function(obj){
							if(typeof obj === "function"){
			       				obj({ 
			       					success: function(value){
			       						if(value === "button"){
						       				_ITEM.getContext().data('datebox').options.useButton = true;
						       				_ITEM.getContext().data('datebox').options.useFocus = false;
						       			}else if(value === "focus"){
						       				_ITEM.getContext().data('datebox').options.useButton = false;
						       				_ITEM.getContext().data('datebox').options.useFocus = true;
						       			}else if(value === "both"){
						       				_ITEM.getContext().data('datebox').options.useButton = true;
						       				_ITEM.getContext().data('datebox').options.useFocus = true;
						       			}
			       					} 
			       				});
			       				return;
			       			}
			       			if(obj === "button"){
			       				_ITEM.getContext().data('datebox').options.useButton = true;
			       				_ITEM.getContext().data('datebox').options.useFocus = false;
			       			}else if(obj === "focus"){
			       				_ITEM.getContext().data('datebox').options.useButton = false;
			       				_ITEM.getContext().data('datebox').options.useFocus = true;
			       			}else if(obj === "both"){
			       				_ITEM.getContext().data('datebox').options.useButton = true;
			       				_ITEM.getContext().data('datebox').options.useFocus = true;
			       			}
						}
					});
					
					this.getBlobkDates = function(){
						return (typeof _ITEM.getContext().data('datebox').options.blackDates === "undefined")?[]:_ITEM.getContext().data('datebox').options.blackDates;
					};
					
					this.getHighlightDates = function(){
						return (typeof _ITEM.getContext().data('datebox').options.highDates === "undefined")?[]:_ITEM.getContext().data('datebox').options.highDates;
					};
					
					this.refresh = function(){
						_ITEM.getContext().datebox('refresh');
					};
					
					return this;
				},
				
				accordion: function(){
					_ITEM.registerProperty({
						name: 'label',
						getter: function(){
							return uiCommons.label();
						},
						setter: function(obj){
							uiCommons.label(obj);
						}
					});
				
					this.getItems = function(){
						return _ITEM.getContext().children('div[data-role="collapsible"]');
					};
					
					return this;
				},
				
				photoviewer: function(){
					this.init = function(options){
						$('#' + _ITEM.getRealID() + ' li a').photoSwipe(options);
					};
					
					this.clear = function(){
						$('#' + _ITEM.getRealID() + ' li').remove();
					};
					
					return this;
				},
				
				list: function(){
					_ITEM.registerProperty({
						name: 'label',
						getter: function(){
							return uiCommons.label();
						},
						setter: function(obj){
							uiCommons.label(obj);
						}
					});
					
					this.getItems = function(){
						return _ITEM.getContext().children('li');
					};
					
					this.count = function(){
						var count = 0;
						_ITEM.getContext().children('li').each(function(){
							count++;
						});
						return count;
					};
					
					this.refresh = function(){
						_ITEM.getContext().listview("refresh");
					};
					
					this.removeSwipeButton = function(){
						$('.aSwipeBtn').animate({ width: 'toggle' }, 200, function(e) {
							$(this).remove();
						});
					};
					
					return this;
				},
				
				map: function(){
					_ITEM.registerProperty({
						name: 'width',
						getter: function(){
							_ITEM.getContext().css('width');
						},
						setter: function(obj){
							_ITEM.getContext().css('width', obj);
						}
					});
					
					_ITEM.registerProperty({
						name: 'height',
						getter: function(){
							_ITEM.getContext().css('height');
						},
						setter: function(obj){
							_ITEM.getContext().css('height', obj);
						}
					});
					
					this.option = function(optionName, optionValue){
						if(typeof optionValue === "function"){
		       				optionValue({ 
		       					success: function(value){
		       						_ITEM.getContext().gmap('option', optionName, value);
		       					} 
		       				});
		       				return;
		       			}
		       			_ITEM.getContext().gmap('option', optionName, optionValue);
					};
					
					this.closeInfoWindow = function(){
						_ITEM.getContext().gmap('closeInfoWindow');
					};
					
					this.clear = function(objName){
						_ITEM.getContext().gmap('clear', objName);
					};
					
					this.refresh = function(){
						_ITEM.getContext().gmap('refresh');
					};
					
					this.search = function(address, callback){
						if(typeof address === "function"){
		       				address({ 
		       					success: function(value){
		       						_ITEM.getContext().gmap('search', { 'address': value }, function(results, status) {
							        	if ( status === 'OK' ) {
							        		console.log(results[0].geometry.location.toString());
							        		if(callback){
							        			callback(results);
							       			}else{
							            		_ITEM.getContext().gmap('addMarker', {'position': results[0].geometry.location, 'bounds': true});
							            		_ITEM.getContext().gmap('option', 'zoom', 15);
							            		_ITEM.getContext().gmap('option', 'center', results[0].geometry.location);
							       			}
							            }
									});
		       					} 
		       				});
		       				return;
		       			}
						_ITEM.getContext().gmap('search', { 'address': address }, function(results, status) {
				        	if ( status === 'OK' ) {
				        		console.log(results[0].geometry.location.toString());
				        		if(callback){
				        			callback(results);
				       			}else{
				       				_ITEM.getContext().gmap('addMarker', {'position': results[0].geometry.location, 'bounds': true});
				            		_ITEM.getContext().gmap('option', 'zoom', 15);
				            		_ITEM.getContext().gmap('option', 'center', results[0].geometry.location);
				       			}
				            }
						});
					};
					
					this.path = function(pathStart, pathEnd){
						var origin, destination;
						if(typeof pathStart === "function"){
		       				pathStart({ 
		       					success: function(originValue){
		       						origin = originValue;
		       						if(typeof pathEnd === "function"){
		       							pathEnd({
		       								success: function(destinationValue){
		       									destination = destinationValue;
		       									_ITEM.getContext().gmap('displayDirections', {'origin': origin, 'destination': destination, 'travelMode': 'DRIVING'});
		       								}
		       							});
		       							return;
		       						}else{
		       							destination = pathEnd;
		       							_ITEM.getContext().gmap('displayDirections', {'origin': origin, 'destination': destination, 'travelMode': 'DRIVING'});
		       						}
		       					} 
		       				});
		       				return;
		       			}else{
		       				origin = pathStart;
		       				if(typeof pathEnd === "function"){
       							pathEnd({
       								success: function(destinationValue){
       									destination = destinationValue;
       									_ITEM.getContext().gmap('displayDirections', {'origin': origin, 'destination': destination, 'travelMode': 'DRIVING'});
       								}
       							});
       							return;
       						}else{
       							destination = pathEnd;
       							_ITEM.getContext().gmap('displayDirections', {'origin': origin, 'destination': destination, 'travelMode': 'DRIVING'});
       						}
		       			}
					};
					
					this.marker = function(location){
						if(typeof location === "function"){
		       				location({ 
		       					success: function(value){
		       						_ITEM.getContext().gmap('addMarker', {'position': value, 'bounds': true});
		       					} 
		       				});
		       				return;
		       			}
						_ITEM.getContext().gmap('addMarker', {'position': location, 'bounds': true});
					};
					
					return this;
				}
			};
		console.log("type: "+_TYPE);
		console.log("type of context: " +  typeof uiContexts[_TYPE]);	
		return HYWEBAPP.extend(uiContexts[_TYPE](), _ITEM);
	};
		
	obj.ui = {
		text: function(item){
			return uiExtend('text', item);
		},
		
		button: function(item){
			return uiExtend('button', item);
		},
		
		textarea: function(item){
			return uiExtend('textarea', item);
		},
		
		password: function(item){
			return uiExtend('password', item);
		},
		
		search: function(item){
			return uiExtend('search', item);
		},
		
		slider: function(item){
			return uiExtend('slider', item);
		},
		
		toggle: function(item){
			return uiExtend('toggle', item);
		},
		
		image: function(item){
			return uiExtend('image', item);
		},
		
		map: function(item){
			return uiExtend('map', item);
		},
		
		datepicker: function(item){
			return uiExtend('datepicker', item);
		},
		
		scroller: function(item){
			return uiExtend('scroller', item);
		},
		
		carousel: function(item){
			return uiExtend('carousel', item);
		},
		
		photoviewer: function(item){
			return uiExtend('photoviewer', item);
		},
		
		list: function(item){
			return uiExtend('list', item);
		},
		
		select: function(item){
			return uiExtend('select', item);
		},
		
		checkbox: function(item){
			return uiExtend('checkbox', item);
		},
		
		radio: function(item){
			return uiExtend('radio', item);
		},
		
		accordion: function(item){
			return uiExtend('accordion', item);
		},
		
		submit: function(item){
			return uiExtend('submit', item);
		}
	};
	
}(HYWEBAPP));