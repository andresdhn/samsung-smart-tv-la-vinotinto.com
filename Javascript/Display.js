var Display =
{
	detail: 0,
    statusDiv : null,
    FIRSTIDX : 0,
    LASTIDX : 4,
    currentWindow : 0,

    SELECTOR : 0,
    LIST : 1,
    
    videoList : new Array()
}

Display.init = function()
{
    var success = true;
    
    this.statusDiv = document.getElementById("status");

    if (!this.statusDiv)
    {
        success = false;
    }
    
    return success;
}

Display.setTotalTime = function(total)
{
    this.totalTime = total;
}

Display.setTime = function(time)
{
    var timePercent = (100 * time) / this.totalTime;
    var timeElement = document.getElementById("timeInfo");
    var timeHTML = "";
    var timeHour = 0; var timeMinute = 0; var timeSecond = 0;
    var totalTimeHour = 0; var totalTimeMinute = 0; var totalTimesecond = 0;
    
    if (time == 0){
		document.getElementById("progressBar").style.width = "0px";
    }else{
		document.getElementById("progressBar").style.width = timePercent + "%";
	}
    
    if(Player.state == Player.PLAYING || Player.state == Player.PAUSED)
    {
        totalTimeHour = Math.floor(this.totalTime/3600000);
        timeHour = Math.floor(time/3600000);
        
        totalTimeMinute = Math.floor((this.totalTime%3600000)/60000);
        timeMinute = Math.floor((time%3600000)/60000);
        
        totalTimeSecond = Math.floor((this.totalTime%60000)/1000);
        timeSecond = Math.floor((time%60000)/1000);
        
        timeHTML = timeHour + ":";
        
        if(timeMinute == 0)
            timeHTML += "00:";
        else if(timeMinute <10)
            timeHTML += "0" + timeMinute + ":";
        else
            timeHTML += timeMinute + ":";
            
        if(timeSecond == 0)
            timeHTML += "00 /";
        else if(timeSecond <10)
            timeHTML += "0" + timeSecond + " / ";
        else
            timeHTML += timeSecond + " / ";
            
        timeHTML += totalTimeHour + ":";
        
        if(totalTimeMinute == 0)
            timeHTML += "00:";
        else if(totalTimeMinute <10)
            timeHTML += "0" + totalTimeMinute + ":";
        else
            timeHTML += totalTimeMinute + ":";
            
        if(totalTimeSecond == 0)
            timeHTML += "00";
        else if(totalTimeSecond <10)
            timeHTML += "0" + totalTimeSecond;
        else
            timeHTML += totalTimeSecond;
    }
    else
    {
		loading.hide();
        Display.status("");
		timeHTML = "0:00:00 / 0:00:00";     
		document.getElementById("progressBar").style.width = "0px";
	} 
    
    widgetAPI.putInnerHTML(timeElement, timeHTML);
    
}

Display.status = function(status)
{
    alert(status);
    widgetAPI.putInnerHTML(this.statusDiv, status);
}

Display.setVolume = function(level)
{
    document.getElementById("volumeBar").style.width = level + "%";
    
    var volumeElement = document.getElementById("volumeInfo");
	var volElement = document.getElementById("vol");

	if (!Audio.getMute())
	{
		widgetAPI.putInnerHTML(volumeElement, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + Audio.getVolume());
		widgetAPI.putInnerHTML(volElement, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + Audio.getVolume());
	}
}

Display.setVideoList = function(nameList)
{
    var listHTML = "";
    
    var i=0;
    for (var name in nameList)
    {
        this.videoList[i] = document.getElementById("video"+i);
        listHTML = nameList[name] ;
        widgetAPI.putInnerHTML(this.videoList[i], listHTML);
		i++;
    }
	
	var j = 0
	for (j; j <= 4; j++) 
	{
		this.videoList[j].style.backgroundImage= "url(none)";
		this.videoList[j].style.color= "#c0c0c0";
	}
	
	this.videoList[this.FIRSTIDX].style.backgroundImage= "url(Images/listBox/selector.png)";
	this.videoList[this.FIRSTIDX].style.color= "#666666";
	
    if(i > 5)
    {
        document.getElementById("next").style.opacity = '1.0';
        document.getElementById("previous").style.opacity = '1.0';
    }

	listHTML = "1 / " + i;
    widgetAPI.putInnerHTML(document.getElementById("videoCount"), listHTML);
}

Display.setVideoListPosition = function(position, move)
{    
    var listHTML = "";
    
    listHTML = (position + 1) + " / " + Data.getVideoCount();
    widgetAPI.putInnerHTML(document.getElementById("videoCount"), listHTML);
	
	if(Data.getVideoCount() < 5)
    {
        for (var i = 0; i < Data.getVideoCount(); i++)
        {
            if(i == position){
                this.videoList[i].style.backgroundImage= "url(Images/listBox/selector.png)";
				this.videoList[i].style.color= "#666666";}
            else{
                this.videoList[i].style.backgroundImage= "url(none)";
				this.videoList[i].style.color= "#c0c0c0";}
        }
    }
    else if((this.currentWindow!=this.LASTIDX && move==Main.DOWN) || (this.currentWindow!=this.FIRSTIDX && move==Main.UP))
    {
        if(move == Main.DOWN)
            this.currentWindow ++;
        else
            this.currentWindow --;
            
        for (var i = 0; i <= this.LASTIDX; i++)
        {
            if(i == this.currentWindow){
                this.videoList[i].style.backgroundImage= "url(Images/listBox/selector.png)";
				this.videoList[i].style.color= "#666666";}
            else{
                this.videoList[i].style.backgroundImage= "url(none)";
				this.videoList[i].style.color= "#c0c0c0";}
        }
    }
    else if(this.currentWindow == this.LASTIDX && move == Main.DOWN)
    {
        if(position == this.FIRSTIDX)
        {
            this.currentWindow = this.FIRSTIDX;
            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = Data.videoNames[i] ;
                widgetAPI.putInnerHTML(this.videoList[i], listHTML);
                
                if(i == this.currentWindow){
                    this.videoList[i].style.backgroundImage= "url(Images/listBox/selector.png)";
					this.videoList[i].style.color= "#666666";}
                else{
                    this.videoList[i].style.backgroundImage= "url(none)";
					this.videoList[i].style.color= "#c0c0c0";}
            }
        }
        else
        {      
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = Data.videoNames[i + position - this.currentWindow] ;
                widgetAPI.putInnerHTML(this.videoList[i], listHTML);
            }
        }
    }
    else if(this.currentWindow == this.FIRSTIDX && move == Main.UP)
    {
        if(position == Data.getVideoCount()-1)
        {
            this.currentWindow = this.LASTIDX;
            
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = Data.videoNames[i + position - this.currentWindow] ;
                widgetAPI.putInnerHTML(this.videoList[i], listHTML);
                
                if(i == this.currentWindow){
                    this.videoList[i].style.backgroundImage= "url(Images/listBox/selector.png)";
					this.videoList[i].style.color= "#666666";}
                else{
                    this.videoList[i].style.backgroundImage= "url(none)";
					this.videoList[i].style.color= "#c0c0c0";}
            }
        }
        else
        {    
            for(i = 0; i <= this.LASTIDX; i++)
            {
                listHTML = Data.videoNames[i + position] ;
                widgetAPI.putInnerHTML(this.videoList[i], listHTML);
            }
        }
    }
}

Display.setDescription = function(thumb, description)
{
    var descriptionElement = document.getElementById("description");
    
	alert("display: " + description);
	alert("thumb: " + thumb);
	widgetAPI.putInnerHTML(descriptionElement, description);
	
	if (thumb) {
	switch(Main.selectedCategory)
	{
		case 0:
			$('#description').prepend('<p style="background-color:#000000; text-align:center;" height=220 width=220><img height=150 width=210 id="thumb" src='+ thumb + ' /></p><br>');
			break;
		case 1:
			$('#description').prepend('<img style="float:left;" height=150 width=210 id="thumb" src='+ thumb + ' />');
			break;
	}
	}
}

Display.hide = function()
{
    document.getElementById("main").style.display="none";
}

Display.show = function()
{
    document.getElementById("main").style.display="block";
}

Display.handleCategory = function()
{
	$("#error").hide();
	$("#description").empty();
	
	switch(Main.selectedCategory)
	{
		case 0:
			document.getElementById("navi_player").style.display="block";
			document.getElementById("navi_news").style.display="none";
			document.getElementById("navi_news_detail").style.display="none";
			
			break;
		case 1:
			document.getElementById("navi_player").style.display="none";
			document.getElementById("navi_news").style.display="block";
			document.getElementById("navi_news_detail").style.display="none";

			break;
	}
	
	if (this.detail == 0)
	{
		this.SELECTOR = 0;
		this.FIRSTIDX = 0;
		this.LASTIDX = 4;
		this.currentWindow = 0;
	}
	else
	{
		this.detail = 0;
	}
	
}

Display.selectedNewsDetail = function()
{
	
	switch(Main.selectedNews)
	{
		case 1:
			document.getElementById("navi_player").style.display="none";
			document.getElementById("navi_news").style.display="none";
			document.getElementById("navi_news_detail").style.display="block";
			document.getElementById("videoList").style.opacity = "0.3";
			
			document.getElementById("previous").style.right="375px";
			document.getElementById("previous").style.top="20px";
			document.getElementById("next").style.right="375px";
			document.getElementById("next").style.top="450px";
			break;
			
		case 0:
			
			document.getElementById("navi_news_detail").style.display="none";
			document.getElementById("videoList").style.display="block";
			document.getElementById("videoList").style.opacity = "1";
			
			document.getElementById("previous").style.right="5px";
			document.getElementById("previous").style.top="60px";
			document.getElementById("next").style.right="5px";
			document.getElementById("next").style.top="330px";
			
			$("#description").scrollTop(0);
			alert ("scroll top");
			
			this.detail = 1;
			Display.handleCategory();
			Main.updateCurrentVideo();
			
			break;
	}

}