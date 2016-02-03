var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var plugin = new Common.API.Plugin();
var loading;

var Main =
{
    selectedCategory: 0,
	selectedVideo: 0,
	selectedNews: 0,
	
    mode : 0,
    mute : 0,
    
    UP : 0,
    DOWN : 1,

    WINDOW : 0,
    FULLSCREEN : 1,
    
    NMUTE : 0,
    YMUTE : 1
}

Main.onLoad = function() {
	window.onshow = function(){ 
		plugin.registKey(TVKEY.KEY_INFOLINK);
		plugin.setOffScreenSaver();
    }	
	widgetAPI.sendReadyEvent();
	
}


$(document).ready( function() {

	/* Terms and Conditions file */
	var file = this.file = new Main.FileSystem("LaVinotinto_Terms_2012.txt");
	
	$("#samsung-terms").hide();
	
	if(file.read() == undefined) {
		file.write("rejected");
	}

	if(file.read() != undefined && file.read() != "rejected" && file.read() == "accepted") {
		/* Terms and Conditions were previously accepted, app deploy */
		Main.init();
		loading.show();

	} else if(file.read() == "rejected") {
		/* Terms and Conditions were'nt accepted yet, they are shown */
		Main.showTermOfConditions(file);
	}
	
});

Main.init = function()
{
	loading = new Main.LoadingIndicator();
	
	if ( Player.init() && Audio.init() && Display.init() && Server.init() && Data.init() )
	{
		Display.handleCategory();
		Display.setVolume( Audio.getVolume() );
		Display.setTime(0);
		
		Player.stopCallback = function()
		{
			/* Return to windowed mode when video is stopped
				(by choice or when it reaches the end) */
			Main.setWindowMode();
		}

		// Start retrieving data from server
		Server.dataReceivedCallback = function()
		{
			/* Use video information when it has arrived */
			Display.setVideoList( Data.getVideoNames() );
			Main.updateCurrentVideo();
		}
		Server.fetchVideoList(); /* Request video information from server */
		
		
		// Enable key event processing
		this.enableKeys();

		widgetAPI.sendReadyEvent();    
		
	}
	else
	{
		alert("Failed to initialise");
	}

}

Main.onUnload = function()
{
    Player.deinit();
}

Main.updateCurrentVideo = function(move)
{
	if (this.selectedCategory == 0) 
	{
		Player.setVideoURL( Data.getVideoURL(this.selectedVideo) );
	}

    Display.setVideoListPosition(this.selectedVideo, move);

    Display.setDescription( Data.getVideoThumb(this.selectedVideo),  Data.getVideoDescription(this.selectedVideo));
	
	loading.hide();
}

Main.enableKeys = function()
{
    document.getElementById("anchor").focus();
}

Main.keyDown = function()
{
    var keyCode = event.keyCode;
    alert("Key pressed: " + keyCode);
    
	switch(keyCode)
	{
		case tvKey.KEY_RETURN:
		case tvKey.KEY_PANEL_RETURN:
			alert("RETURN");
			this.handleReturnKey();
			widgetAPI.blockNavigation(event);
			break;    
	
		case tvKey.KEY_PLAY:
			alert("PLAY");
			if ($("#error").is(":hidden")) 
			{
				if (this.selectedCategory == 0) 
				{
					if (this.mode == this.FULLSCREEN) 
					{
						this.handlePlayKey();
					} 
				}
			}
			break;
			
		case tvKey.KEY_STOP:
			alert("STOP");
			if ($("#error").is(":hidden")) 
			{
				if (this.selectedCategory == 0) 
				{
					if (Player.getState() == Player.PLAYING)
					{
						Player.stopVideo();
					}
				}
			}
			break;
			
		case tvKey.KEY_PAUSE:
			alert("PAUSE");
			if ($("#error").is(":hidden")) 
			{
				if (this.selectedCategory == 0) 
				{
					if (Player.getState() == Player.PLAYING)
					{
						this.handlePauseKey();
					}
				}
			}
			break;
			
		case tvKey.KEY_FF:
			alert("FF");
			if ($("#error").is(":hidden")) 
			{
				if (this.selectedCategory == 0) 
				{
					if (Player.getState() == Player.PLAYING)
					{
						if (document.getElementById("progressBar").style.width !== "0px")
						{
							Player.skipForwardVideo();
						}
					} 
				}
			}
			break;
		
		case tvKey.KEY_RW:
			alert("RW");
			if ($("#error").is(":hidden")) 
			{
				if (this.selectedCategory == 0) 
				{
					if (Player.getState() == Player.PLAYING)
					{
						if (document.getElementById("progressBar").style.width !== "0px")
						{
							Player.skipBackwardVideo();
						}
					}
				}
			}
			break;

		case tvKey.KEY_VOL_UP:
		case tvKey.KEY_PANEL_VOL_UP:
			alert("VOL_UP");
			if ($("#error").is(":hidden")) 
			{
				if (this.selectedCategory == 0) 
				{
					if(Audio.getMute() == true) 
					{
						Audio.setMute(false);
					}
					Audio.setRelativeVolume(0);
					
				}
			}
			break;
			
		case tvKey.KEY_VOL_DOWN:
		case tvKey.KEY_PANEL_VOL_DOWN:
			alert("VOL_DOWN");
			if ($("#error").is(":hidden")) 
			{
				if (this.selectedCategory == 0) 
				{
					if(Audio.getMute() == true) 
					{
						Audio.setMute(false);
					}
					Audio.setRelativeVolume(1);
					
				}
			}
			break;   

		case tvKey.KEY_DOWN:
			alert("DOWN");
			if ($("#main").is(":visible")) 
			{
				if ($("#error").is(":hidden")) 
				{
					if (this.selectedNews == 1)
					{
						alert ("scroll");
						$("#description").scrollTop($("#description").scrollTop() + 50);
					}
					else
					{
						this.selectNextVideo(this.DOWN);
					}
				}
			}
			break;
			
		case tvKey.KEY_UP:
			alert("UP");
			if ($("#main").is(":visible")) 
			{
				if ($("#error").is(":hidden")) 
				{
					if (this.selectedNews == 1)
					{
						alert ("scroll");
						$("#description").scrollTop($("#description").scrollTop() - 50);
					}
					else
					{
						this.selectPreviousVideo(this.UP);
					}
				}
			}
			break;            
			
		case tvKey.KEY_LEFT:
			alert("LEFT");
			if ($("#main").is(":visible")) 
			{
				if ($("#error").is(":hidden")) 
				{
					if (this.selectedNews == 1)
					{
						this.selectedNews = 0;
						Display.selectedNewsDetail();
					}
					this.selectPrevCategory(this.selectedCategory);
				}
			}
			break;
			
		case tvKey.KEY_RIGHT:
			alert("RIGHT");
			if ($("#main").is(":visible")) 
			{
				if ($("#error").is(":hidden")) 
				{
					if (this.selectedNews == 0)
					{
						this.selectedNews = 0;
						Display.selectedNewsDetail();
						this.selectNextCategory(this.selectedCategory);
					}
				}
			}
			break; 
			
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			if ($("#error").is(":hidden")) 
			{
				if ($("#main").is(":visible")) 
				{
					if (this.selectedCategory == 0)
					{
						this.handlePlayKey();
					}
					else
					{
						this.handleNewsDetail();
					}
				}
			}
			break;
		
		case tvKey.KEY_MUTE:
			alert("MUTE");
			if ($("#error").is(":hidden")) 
			{
				if (this.selectedCategory == 0) 
				{
					Audio.setMute(!Audio.getMute());
				}
			}
			break;
		
		case tvKey.KEY_EXIT:
			widgetAPI.sendExitEvent();
			break;
			
		default:
			alert("Unhandled key");
			break;
	}

}

Main.handleReturnKey = function()
{
	switch ( Player.getState() )
    {
		case Player.PLAYING:
		case Player.PAUSED:
			Player.stopVideo();
			break;
			
		case Player.STOPPED:
			if (this.selectedNews == 1)
			{
				this.selectedNews = 0;
				Display.selectedNewsDetail();
			}
			else
			{
				widgetAPI.sendReturnEvent(); 
			}
            break;
            
        default:
            alert("Ignoring Return key, not in correct state");
            break;
    }
	
}

Main.handlePlayKey = function()
{
    switch ( Player.getState() )
    {
        case Player.STOPPED:
            Player.playVideo();
			this.toggleMode();
            break;
            
        case Player.PAUSED:
			Player.resumeVideo();
			break;
            
        default:
            alert("Ignoring play key, not in correct state");
            break;
    }
}

Main.handlePauseKey = function()
{
    switch ( Player.getState() )
    {
        case Player.PLAYING:
			if (document.getElementById("progressBar").style.width !== "0px")
			{
				Player.pauseVideo();
			}
            break;
        
        default:
            alert("Ignoring pause key, not in correct state");
            break;
    }
}

Main.handleNewsDetail = function()
{
	this.selectedNews = 1;
	Display.selectedNewsDetail();
	
}

Main.selectNextCategory = function(i)
{
	if (i < 1) {
		
		Player.stopVideo();
		
		$("#Category" + i).focus().eq(0).removeAttr("class").addClass("menu");
		i++;
		$("#Category" + i).focus().eq(0).removeAttr("class").addClass("current");
		
		this.selectedCategory = (this.selectedCategory + 1);
		this.selectedVideo = 0;
		
		this.init();
		loading.show();
		
		
	}
	alert ("i:" + i);
}

Main.selectPrevCategory = function(i)
{
	if (i > 0) {

		Player.stopVideo();

		$("#Category" + i).focus().eq(0).removeAttr("class").addClass("menu");
		i--;
		$("#Category" + i).focus().eq(0).removeAttr("class").addClass("current");
		
		this.selectedCategory = (this.selectedCategory - 1);
		this.selectedVideo = 0;
		
		this.init();
		loading.show();
		
	}
	alert ("i:" - i);
}


Main.selectNextVideo = function(down)
{
    if (Data.getVideoCount() > 0) {
	
		if (this.selectedCategory == 0) 
		{
			Player.stopVideo();
		}
		
		this.selectedVideo = (this.selectedVideo + 1) % Data.getVideoCount();

		this.updateCurrentVideo(down);
	}
}

Main.selectPreviousVideo = function(up)
{
    if (Data.getVideoCount() > 0) {
	
		if (this.selectedCategory == 0) 
		{
			Player.stopVideo();
		}
		
		if (--this.selectedVideo < 0)
		{
			this.selectedVideo += Data.getVideoCount();
		}

		this.updateCurrentVideo(up);
	}
}

Main.setFullScreenMode = function()
{
    if (this.mode != this.FULLSCREEN)
    {
        Display.hide();
        Player.setFullscreen();
		document.getElementById("loading-indicator").style.left = "470px"; 
		document.getElementById("loading-indicator").style.top = "230px"; 
		document.getElementById("loading-text").style.left = "450px";
		document.getElementById("loading-text").style.top = "200px"; 
		this.mode = this.FULLSCREEN;
    }
}

Main.setWindowMode = function()
{
    if (this.mode != this.WINDOW)
    {
		alert("setwindowmode");
		Player.setWindow();
		Display.show();
		document.getElementById("loading-indicator").style.left = "280px";
		document.getElementById("loading-indicator").style.top = "210px"; 
		document.getElementById("loading-text").style.left = "260px";
		document.getElementById("loading-text").style.top = "180px"; 
        this.mode = this.WINDOW;
    }
}

Main.toggleMode = function()
{
    if(Player.getState() == Player.PAUSED)
    {
		Player.resumeVideo();
	}
	if(Player.getState() == Player.STOPPED)
	{
		alert("Ignoring toggle Mode, not in correct state");
	}
	else 
	{
		switch (this.mode)
		{
			case this.WINDOW:
				this.setFullScreenMode();
				break;
				
			case this.FULLSCREEN:
				this.setWindowMode();
				break;
				
			default:
				alert("ERROR: unexpected mode in toggleMode");
				break;
		}
	}
}


/*
 * creates a file in File System and provides 
 * funtionalities to write an read
 */
Main.FileSystem = function(fileName) {
	var Obj = this;
	var fileSystem = new FileSystem();

	this.write = function(str) {
		var fileObj = fileSystem.openCommonFile(fileName, "w");
		fileObj.writeAll(str);
		fileSystem.closeCommonFile(fileObj);
	}
	this.read = function() {
		if(fileSystem.openCommonFile(fileName, "r") != null) {
			var fileObj = fileSystem.openCommonFile(fileName, "r");
			var str = jQuery.trim(fileObj.readAll());
			fileSystem.closeCommonFile(str);
			return str;
		}
	}
}
/*  */

/*
 * Terms and contditions window
 */ 
Main.showTermOfConditions = function(file) {

	$("#samsung-terms").focus().eq(0).addClass("focus").show();
	
	$("#samsung-terms").focus().keydown( function(e) {

		switch(e.keyCode)
		{
		case tvKey.KEY_ENTER: 
			$("#samsung-terms").remove();
			file.write("accepted");
			Main.init();
			loading.show();
			e.stopPropagation();
			break;
			
		case tvKey.KEY_RETURN:
			widgetAPI.sendExitEvent();
			break;
			
		case tvKey.KEY_EXIT:
			widgetAPI.sendExitEvent();
			break;
			
		}	
	});
}

Main.LoadingIndicator = function() {
   
	$("#loading-indicator").attr("src", "Images/loader.gif");

    this.show = function() {
        $("#loading-indicator").show();
		$("#loading-text").show();
    };
    
    this.hide = function() {
        $("#loading-indicator").hide();
		$("#loading-text").hide();
    };
 
}