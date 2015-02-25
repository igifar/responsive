 defaultURL = 'wikipedia.com'; //<---- CHANGE TO YOUR WEBSITE URL
 $.support.cors = true;

	//show loading graphic
	function showLoader(id) {
	  $('.imageLoader').fadeIn('slow');
	}

	//hide loading graphic
	function hideLoader(id) {
	  $('.imageLoader').fadeOut('slow');
	}
	
	
	function clearFrame(){
		var src = $('#frameId').attr('src');
		if(src != 'html/blank.html')
		{
			$('#frameId').attr('src','html/blank.html');
		}
	}

	//load page
	function loadPage(url)
	{
		if ( url != '' && url.substr(0,7) !== 'http://' && url.substr(0,8) !== 'https://' && url.substr(0, 7) !== 'file://' ) {
			url = 'http://'+url;
		 }
		/*$('iframe').each(function(){*/showLoader($(this).parent().attr('id'));/*})*/
		//$('iframe').data('loaded', false);
		$('#frameId').attr('src', url);
	}

	
	
	//load from JSON
	function loadDeviceList()
	{
		
		$.getJSON( "json/devices.json", function( data ) {
			 jsonObject = data;
			 var text = '<ul class="nav navbar-nav navbar-center">';
			  $.each( data.supportedDevices, function( key, val ) {
				if(key != '_id')
					{
						
						  text = text + '<li role="presentation" class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false"> ';
						  text = text + val.title;
						  text = text + '<span class="caret"></span> </a> <ul class="dropdown-menu" role="menu">';
						if(val.brands !== null && typeof val.brands === 'object')
						{
							$.each( val.brands, function( key, val ) {
								text = text + '<li role="presentation" class="dropdown-header">'+val.name+'</li>';
								if(val !== null && typeof val === 'object')
								{
									$.each( val, function( key, val ) {
										
										if(val !== null && typeof val === 'object')
										{
											$.each( val, function( key, val ) {
												var pixelDensity = val.pxd ? val.pxd : 1;
												var width , height;
												width = Math.round(val.w/pixelDensity);
												height = Math.round(val.h/pixelDensity);
												text = text + '<li role="presentation"><a href="javascript:void(0)" class="deviceListClass" onClick="clickOnDevice(this)" data-width="'+width+'" data-height="'+height+'" data-title="'+val.name+'" data-inch="'+val.inch+'" data-pixelDensity="'+pixelDensity+'" >';
												text = text + val.name;
												text = text + '</a></li>';
										});
										
										}
									});
									
								}
							
							});
							text = text + '</ul></li>';
						}
					}
			  });
			  text = text + '</ul>';
			 

			  $('#deviceNav').html(text);
			
			});
	}

	//load from DB - devices working 
	function loadDevicesFromDb()
	{
		var URL= "https://api.mongolab.com/api/1/databases/responsive-web_design-testing-tool-devices/collections/devices?apiKey=AydSMDIMXs1y_5qM8s9H2uaygix11-d9";
		 $.getJSON( URL, function( data ) {
			 jsonObject = data;
			 var text = '<ul class="nav navbar-nav navbar-center">';
			  $.each( data[0].supportedDevices, function( key, val ) {
				if(key != '_id')
					{
						
						  text = text + '<li role="presentation" class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false"> ';
						  text = text + val.title;
						  text = text + '<span class="caret"></span> </a> <ul class="dropdown-menu" role="menu">';
						if(val.brands !== null && typeof val.brands === 'object')
						{
							$.each( val.brands, function( key, val ) {
								text = text + '<li role="presentation" class="dropdown-header">'+val.name+'</li>';
								if(val !== null && typeof val === 'object')
								{
									$.each( val, function( key, val ) {
										
										if(val !== null && typeof val === 'object')
										{
											$.each( val, function( key, val ) {
												var pixelDensity = val.pxd ? val.pxd : 1;
												var width , height;
												width = Math.round(val.w/pixelDensity);
												height = Math.round(val.h/pixelDensity);
												text = text + '<li role="presentation"><a href="javascript:void(0)" class="deviceListClass" onClick="clickOnDevice(this)" data-width="'+width+'" data-height="'+height+'" data-title="'+val.name+'" data-inch="'+val.inch+'" data-pixelDensity="'+pixelDensity+'" >';
												text = text + val.name;
												text = text + '</a></li>';
										});
										
										}
									});
									
								}
							
							});
							text = text + '</ul></li>';
						}
					}
			  });
			  text = text + '</ul>';
			 

			  $('#deviceNav').html(text);
			
			}).error(function() {
				
				$('#deviceNav').html('<div class="alert alert-danger" role="alert">Error occured while loading device list from database, <a href="#" class="alert-link" onClick="loadDeviceList()">Click here!</a> to load static list of Devices</div>');					
			});

		
	}
	
	
	function clickOnDevice(thisVal)
	{
		var width = $(thisVal).attr('data-width');
		var height = $(thisVal).attr('data-height');
		var pixelDensity = $(thisVal).attr('data-pixelDensity');
		var title = $(thisVal).attr('data-title');
		
		$('#deviceDimention').text(width+' x '+height);
		$('#deviceDescription').text(title);
		
		
		$('#widthText').val(width);
		$('#widthText').val(height);
		
		var newWidth = parseInt(width,10)+17;
		
		$('#frameId').animate({'width': newWidth, 'height': height},1500);
		 
	}


	//when document loads
	$(document).ready(function(){

		//loadDeviceList();
		  loadDevicesFromDb();
		  loadPage(defaultURL);
		  
		  //query string
		  var qsArray = window.location.href.split('?');
		  var qs = qsArray[qsArray.length-1];

		  if(qs != '' && qsArray.length > 1){
		    $('#urlText').val(qs);
		 //   clearFrame();
		    loadPage(qs);
		  }

		  $('form').submit(function(){
		//	clearFrame();
			loadPage( $('#urlText').val());
			return false;
		  });
		  
		  $('iframe').on("load", function () {
			  hideLoader($(this).parent().attr('id'));
			 // $(this).data('loaded',true);
			});	    // once the iframe is loaded
		
		  //rotate
		  $('#deviceOrientation').on("click", function () {
			  
			  var width = $('#frameId').css("width");
			  var height = $('#frameId').css("height");
			  
			  var newWidth = parseInt(width,10)-17;
			  var newHeight = parseInt(height,10);
			  
			  //var index = height.indexOf("px");
			  //var resHeight = height.substring(0,index);
			  
			  $('#deviceDimention').text(newHeight+' x '+newWidth);
			  
			  newHeight = newHeight+17;
			  $('#frameId').animate({'width': newHeight, 'height': newWidth},1500);
			  
			});	 
		  
		

	});
