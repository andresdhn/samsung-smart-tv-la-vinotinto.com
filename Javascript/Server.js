var Server =
{
    /* Callback function to be set by client */
    dataReceivedCallback : null,
    
    XHRObj : null,
	Videos : "http://blip.tv/lavinotinto/rss",
	Noticias : "http://www.lavinotinto.com/feed/"

}

Server.init = function()
{
    var success = true;

    if (this.XHRObj)
    {
        this.XHRObj.destroy();  // Save memory
        this.XHRObj = null;
    }
    
    return success;
}

Server.fetchVideoList = function()
{
	
    if (this.XHRObj == null)
    {
        this.XHRObj = new XMLHttpRequest();
    }
    
    if (this.XHRObj)
    {
        this.XHRObj.onreadystatechange = function()
            {
                if (Server.XHRObj.readyState == 4)
                {
                    Server.createVideoList();
                }
            }
			
        alert(Main.selectedCategory);
		switch(Main.selectedCategory)
		{
			case 0:
				this.XHRObj.open("GET", this.Videos, true);
				break;
			case 1:
				this.XHRObj.open("GET", this.Noticias, true);
				break;
		}
        this.XHRObj.send(null);
     }
    else
    {
        alert("Failed to create XHR");
    }
}

Server.createVideoList = function()
{
    if (this.XHRObj.status != 200)
    {
        Display.status("XML Server Error " + this.XHRObj.status);
		$("#error").show();
		loading.hide();
    }
    else
    {
        var xmlElement = this.XHRObj.responseXML.documentElement;
        
        if (!xmlElement)
        {
            alert("Failed to get valid XML");
			$("#error").show();
			loading.hide();
        }
        else
        {
			
            // Parse RSS
            // Get all "item" elements
            var items = xmlElement.getElementsByTagName("item");
            
            var videoNames = [ ];
            var videoURLs = [ ];
            var videoDescriptions = [ ];
			var videoThumbs = [ ];
            
            for (var index = 0; index < items.length; index++)
            {
				if (index > 20 ) break;
				switch(Main.selectedCategory)
				{
					case 0:
						var titleElement = items[index].getElementsByTagName("title")[0];
						var descriptionElement = items[index].getElementsByTagName("blip:puredescription")[0];
						var thumbElement = items[index].getElementsByTagName("media:thumbnail")[0];
						var linkElement = items[index].getElementsByTagName("media:content")[1];
											
						if (titleElement && descriptionElement) 
						{
							videoNames[index] = titleElement.firstChild.data;
							videoDescriptions[index] = descriptionElement.firstChild.data;
							
						}
						
						if (linkElement && thumbElement)
						{
							var thumbElementUrl=thumbElement.getAttribute("url"); 
							var linkElementUrl=linkElement.getAttribute("url");	
							videoURLs[index] = linkElementUrl;
							videoThumbs[index] = thumbElementUrl;
							
						}
						
						break;
						
					case 1:				
						var titleElement = items[index].getElementsByTagName("title")[0];
						var descriptionElement = items[index].getElementsByTagName("content:encoded")[0];
						var thumbElement = items[index].getElementsByTagName("image")[0];
						var linkElement = items[index].getElementsByTagName("link")[0];      
						
						if (titleElement && descriptionElement && linkElement)
						{
							videoNames[index] = titleElement.firstChild.data;
							videoURLs[index] = linkElement.firstChild.data;
							videoDescriptions[index] = descriptionElement.firstChild.data ;
							
						}
						if (thumbElement)
						{
							videoThumbs[index] = thumbElement.firstChild.data;
						}
						break;
				}
            }
			
            Data.setVideoNames(videoNames);
            Data.setVideoURLs(videoURLs);
            Data.setVideoDescriptions(videoDescriptions);
			Data.setVideoThumbs(videoThumbs);
			
            if (this.dataReceivedCallback)
            {
                this.dataReceivedCallback();    /* Notify all data is received and stored */
            }
        }
    }
}


