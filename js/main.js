var smokeEffect = document.createElement("div"),
    toUp = document.querySelector('#to-up'),
    isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
	sfrVers = navigator.userAgent.split("/"),
    isMSIE = /*@cc_on!@*/0,
    edgi  = /Edge/.test(navigator.userAgent),
	scrW = screen.width,
	imageCache = new Object(),
    smokeHTML;
    smokeHTML = '<div class="smoke-area">';
	smokeHTML+= '<div class="smoke"></div>';
	smokeHTML+= '<div class="smoke"></div>';
	smokeHTML+= '<div class="smoke"></div>';
	smokeHTML+= '<div class="smoke"></div>';
	smokeHTML+= '<div class="smoke"></div>';
	smokeHTML+= '<div class="smoke"></div>';
	smokeHTML+= '<div class="smoke"></div>';
	smokeHTML+= '<div class="smoke"></div></div>';
    smokeEffect.innerHTML = smokeHTML;
	sfrVers = ((sfrVers[sfrVers.length - 2]).split(" ")[0]).split(".")[0];
	
	if(!/Firefox/.test(navigator.userAgent) && screen.width > 1600) {
		var video = document.createElement("video");
		    video.src="/video/fon.mp4";
			video.autoplay = true;
			video.loop = true;
			video.class = 'fv';
			document.body.appendChild(video);
	}
	document.querySelector("header").appendChild(smokeEffect);
    if(isSafari && sfrVers < 6) {
	  document.querySelector("main").classList.add("no-flex");
	}  
    if(isSafari || isMSIE || edgi) {
	  var textBlock = document.querySelectorAll("details > ul");
	  for(var i = 0, details = document.querySelectorAll("details"),len = details.length; i < len;i++) {
		  details[i].classList.add("no-details");
		  (function(j,details) {
			  details[j].onclick = function(e) {
			  if( details[j].classList.contains("no-details")) {
				  details[j].classList.remove("no-details");
				  details[j].setAttribute("open","true");
			  } else {
				 details[j].classList.add("no-details");
				 details[j].removeAttribute("open");
			  }
			} 	
		  })(i,details);
	  } 
    }
  
   toUp.addEventListener("click",function(){
	   
	 var iter = document.body.scrollTop;
	     toUp.style.display = 'none';
	 setTimeout(function(){
		 if(iter > 0) {
			 setTimeout(arguments.callee,0);
		 }
		 iter-=100;
		 window.scrollTo(0,iter);
	 },0);
       
   },false);

   window.addEventListener("scroll",function(e){
     if(document.body.scrollTop > 1200 && screen.width > 480) {
        toUp.style.display = 'block';
     } else {
        toUp.style.display = 'none';
     }
   },false);

   var videoProduct = document.querySelectorAll(".playBtn");

   for(var i = 0; i < videoProduct.length; i++) {
	videoProduct[i].addEventListener("click",function(e) {
       var player = document.createElement("iframe");
	       player.classList.add("vp");
		   player.frameBorder = "0";
		   player.src = e.target.getAttribute("data-video");
		   e.target.parentNode.appendChild(player);
     });
   }
   
   var IndexSlide = {},
       nextButton = document.querySelectorAll('.nextBtn');
	   
   for(var i = 0; i < nextButton.length; i++) {
	 nextButton[i].addEventListener("click",function(e) {
	   
     var $allPic = JSON.parse((e.target.nextSibling).getAttribute("data-attr")),
             sid = (e.target).getAttribute("id");
			
     if(!IndexSlide.hasOwnProperty(sid))  {  

         IndexSlide[sid] = 1;

     } else {
        IndexSlide[sid] = IndexSlide[sid] + 1;
     }
     slideId = $allPic.length == 2 ? IndexSlide[sid] - 1 : IndexSlide[sid];

    if(slideId >= $allPic.length - 1) {
        IndexSlide[sid] = 0;
    }
	var sID = String(e.target.getAttribute("id")).split("_")[1],
	    currentPict = document.querySelector("#slide-box-" + sID),
		pict,
	    w = currentPict.width,
		h = currentPict.height;
		
	    e.target.classList.add("loading");

	if(imageCache.hasOwnProperty(String($allPic[slideId]))) {
		
	   currentPict.classList.add('fadeOut');
       pic = imageCache[$allPic[slideId]];
	   parentNode = currentPict.parentNode;
       currentPict.parentNode.removeChild(currentPict);
	   (parentNode.appendChild(pic)).classList.add('fadeIn'); 
        e.target.classList.remove("loading");

        return false;	   
	}
  
	fetch("/resize.php?scr=" + screen.width + "&wd=" + w + '&hd=' + h + '&impath=' + $allPic[slideId]).then(function(resp) {
		 
		 return resp.text();
		 
	}).then(function(data){
		
	var picture = new Image();
        picture.src = data;
		picture.id  = "slide-box-" + sID,
		parentNodePict = currentPict.parentNode,
		hashId = data.replace("resz_","").substr(1);
	
		currentPict.classList.add('fadeOut');
		if(!imageCache[hashId]) 
		    imageCache[hashId] = picture;
	
		setTimeout(function() {
		   e.target.classList.remove("loading");
           parentNodePict.removeChild(currentPict);
	       (parentNodePict.appendChild(picture)).classList.add('fadeIn');	
		},600);
			
	}).catch(function(error) {
		
	   console.log(error);
	});
   });
  }