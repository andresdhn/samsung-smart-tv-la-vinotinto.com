var Data =
{
    videoNames : [ ],
    videoURLs : [ ],
    videoDescriptions : [ ],
	videoThumbs : [ ]
}

Data.init = function()
{
    var success = true;
	
	this.videoURLs = 0;
	
	return success;
}
	
Data.setVideoNames = function(list)
{
    this.videoNames = list;
}

Data.setVideoURLs = function(list)
{
    this.videoURLs = list;
}

Data.setVideoDescriptions = function(list)
{
    this.videoDescriptions = list;
}

Data.setVideoThumbs = function(list)
{
    this.videoThumbs = list;
}

Data.getVideoURL = function(index)
{
    var url = this.videoURLs[index];
    
    if (url)    // Check for undefined entry (outside of valid array)
    {
        return url;
    }
    else
    {
        return null;
    }
}

Data.getVideoCount = function()
{
    var count = this.videoURLs.length;
	if (count)
	{
		return count;
	}
	else
	{
		return 0;
	}
}

Data.getVideoNames = function()
{
    return this.videoNames;
}

Data.getVideoDescription = function(index)
{
	var description = this.videoDescriptions[index];
    
    if (description)    // Check for undefined entry (outside of valid array)
    {
		alert ("longitud: " + description.length);
		var description = description.replace(/8242/g, "8217");
		var description = description.replace(/8243/g, "8221");
		if (description == "" || description == "texto" || description == "textos") 
		{
			return this.videoNames[index];
		}
		else
		{
			return description;
		}
    }
    else
    {
        return this.videoNames[index];
    }
}

Data.getVideoThumb = function(index)
{
    var thumb = this.videoThumbs[index];
    alert ("thumb: " + thumb);
	
    if (typeof thumb == "undefined")  // Check for undefined entry (outside of valid array)
    {
        //return "/Images/Bg3.png";
		return null;
    }
    else
    {
        return thumb;
    }
}