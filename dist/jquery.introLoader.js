/*
 *  jQueryIntroLoader - v1.4.2
 *  "simple intro loader animations"
 *  http://factory.brainleaf.eu/jqueryIntroLoader
 *
 *  Made by BRAINLEAF Communication
 *  Released Under GNU/GPL License
 *  (c)2014-2015 by BRAINLEAF Communication
 *  
 *  
 *  BugReport/Assistence: https://github.com/Gix075/jqueryIntroLoader/issues
 */
(function($) {

    $.introLoader = function(element, options) {

    
        var defaults = {

            animation: {
                name: 'simpleLoader',
                options: {
				
                    /* Shared Options */
                    /* ----------------------------- */
                    exitFx:'fadeOut', //OLD -> exitFx:'fadeOut'
                    ease: "linear",
                    style: 'light',
                    delayBefore: 500, //OLD -> delayTime: 500,
                    delayAfter: 300, //OLD -> afterAnimationDelayTime: 0,
                    exitTime: 300, //OLD -> animationTime: 300,

                    /* "doubleLoader" animation only */
                    /* ----------------------------- */
                    progbarTime: 300, //OLD -> progbarAnimationTime: 300
                    progbarDelayAfter: 300, 

                    /* "lettersLoader animation only */
                    /* ----------------------------- */
                    loaderText: 'Website is Ready!',
                    lettersDelayTime: 1,

                    /* "Globals Options */	
                    /* ----------------------------- */
                    preventScroll: false,
                    fixed: true,
                    stop: true,
                    onAfter: function(){},
                    onBefore: function(){}
					
                }
            },    

            spinJs: {}

        }

        
        var plugin = this;

        plugin.settings = {}

        var $element = $(element),
             element = element;   
        
        //Constructor
        plugin.init = function() {
            
            
            plugin.settings = $.extend(true, defaults, options);
            
            // spinJS Options
            var spinOpt = {
                lines: this.settings.spinJs.lines,
                length: this.settings.spinJs.length, 
                width: this.settings.spinJs.width, 
                radius: this.settings.spinJs.radius, 
                corners: this.settings.spinJs.corners, 
                rotate: this.settings.spinJs.rotate,
                direction: this.settings.spinJs.direction,
                color: this.settings.spinJs.color, 
                speed: this.settings.spinJs.speed,
                trail: this.settings.spinJs.trail, 
                shadow: this.settings.spinJs.shadow,
                hwaccel: this.settings.spinJs.hwaccel, 
                className: this.settings.spinJs.className,
                zIndex: this.settings.spinJs.zIndex,
                top: this.settings.spinJs.top, 
                left: this.settings.spinJs.left 
            }

            // animation options object
            var anim = plugin.settings.animation.name;
            var animOpt = plugin.settings.animation.options;
            var spinOpt = plugin.settings.spinJs;
            
            
            
            // Choose Animation
            switch(anim) {
                case "simpleLoader":
                    plugin.spinner = new Spinner(spinOpt).spin();
                    simpleLoaderAnimation(element,animOpt,spinOpt);
                    break;
                case "doubleLoader":
                    doubleLoaderAnimation(element,animOpt);
                    break;
                case "lettersLoader":
                    plugin.spinner = new Spinner(spinOpt).spin();
                    lettersLoaderAnimation(element,animOpt,spinOpt);
                    break;
                default:
                    plugin.spinner = new Spinner(spinOpt).spin();
                    simpleLoaderAnimation(element,animOpt,spinOpt);
                    break;
            }

        }

        
        /*  
            ==================================================
            PUBLICS
            ================================================== 
        */
        
        plugin.stop = function() {
            switch(plugin.settings.animation.name) {
                case "simpleLoader":
                    simpleLoaderAnimationExit();
                    break;
                case "doubleLoader":
                    doubleLoaderAnimationExit();
                    break;  
                case "lettersLoader":
                    lettersLoaderAnimationExit();
                    break;     
            }
            
        }
        
        
        plugin.destroy = function() {
            $(element).removeData();
        }

        
        /*  
            ==================================================
            PRIVATES
            ================================================== 
        */
        
        // ------------------------- simpleLoaderAnimation ----------------------------------
        
        var simpleLoaderAnimation = function(element,animOpt,spinOpt) {
            
            // onBefore function 
            animOpt.onBefore();  
            animationOpening(element,animOpt,'simpleLoader');
          
            var markup  = '';
                markup += '<div id="introLoaderSpinner" class="introLoaderInner">';
                markup += '</div>';

            $(element).html(markup);
            $(element).show();

            var target = document.getElementById('introLoaderSpinner');
            plugin.spinner.spin(target);
            
            
            if (animOpt.stop === true) {
                $(window).on('load', function() {
                    simpleLoaderAnimationExit();
                });
            }
        }
        
        var simpleLoaderAnimationExit = function() {
            
            var animOpt = plugin.settings.animation.options; 
            animationExitEffect(animOpt,true);
            
        }

        // ----------------------------------------------------------------------------------
        
        
        // ------------------------- doubleLoaderAnimation ----------------------------------
        
        var doubleLoaderAnimation = function(element,animOpt) {
            // onBefore function 
            animOpt.onBefore(); 
            animationOpening(element,animOpt,'doubleLoader');
            
            var markup  = '';
                markup += '<div class="doubleLoaderTop"></div>';
                markup += '<div class="doubleLoaderBottom"></div>';
                markup += '<div class="doubleLoaderProgBar"><span></span></div>';

            $(element).html(markup);
            $(element).show();     
            
            if (animOpt.stop === true) {
                $(window).on('load', function() {
                    doubleLoaderAnimationExit();
                });       
            }
            
        }
        
        var doubleLoaderAnimationExit = function() {
            
            var animOpt = plugin.settings.animation.options; 
            
            setTimeout(function() {
                
                $(element).find('.doubleLoaderProgBar').find('span').animate(
                    {'width':'100%'},
                    animOpt.progbarTime, 
                    animOpt.ease,
                    slidingDoorsVertical()
                );
                
            }, animOpt.delayBefore ); // end Timeout
            
            function slidingDoorsVertical() {
                setTimeout(function() {
                    $(element).find('.doubleLoaderProgBar').hide();
                    $(element).find('.doubleLoaderTop, .doubleLoaderBottom').animate(
                        {'height':0},
                        animOpt.exitTime, 
                        animOpt.ease,
                        function() {
                            $(element).hide();
                            if (animOpt.preventScroll === true) $('body').removeClass('introLoader_preventScroll');
                            animOpt.onAfter(); // onAfter function
                        }
                    );
                }, animOpt.progbarTime + animOpt.progbarDelayAfter ); // end Timeout    
            } // end slidingDoorsVertical()
        }
        
        // ----------------------------------------------------------------------------------
        
        
        // ------------------------- lettersLoaderAnimation ----------------------------------
        var lettersLoaderAnimation = function(element,animOpt,spinOpt) {
            
            // onBefore function 
            animOpt.onBefore();
            animationOpening(element,animOpt,'lettersLoader');
            
            // split text string
            var textString = stringSplitter(animOpt.loaderText,'lettersLoaderItem');
            
            // animation html markup
            var markup  = '';
                markup += '<div id="introLoaderSpinner" class="introLoaderInner"></div>';
                markup += '<div id="lettersLoaderAnimation" class="lettersLoaderRow">';
                markup +=   textString;
                markup += '</div>';
                
            $(element).html(markup);
            $(element).show();

            var target = document.getElementById('introLoaderSpinner');
            plugin.spinner.spin(target);
            
            
            if (animOpt.stop === true) {
                $(window).on('load', function() {
                    lettersLoaderAnimationExit();
                });
            }
            
        }// end of lettersLoaderAnimation() 
        
        
        var lettersLoaderAnimationExit = function() {
            var animOpt = plugin.settings.animation.options;
            
            setTimeout(function() {
                
                plugin.spinner.stop();
                $(element).find('.lettersLoaderRow').show();
                var target = $(element).find('.lettersLoaderItem');
                target.each(function(index) {
                    var self = this;
                        
                        $(self).animate(
                            {'opacity':1},
                            animOpt.exitTime * (index + animOpt.lettersDelayTime) ,
                            animOpt.ease
                        );
                        
                });
                target.promise().done( function(){
                    setTimeout(function() {
                        $(element).fadeOut();
                        if (animOpt.preventScroll === true) $('body').removeClass('introLoader_preventScroll');
                    }, animOpt.delayAfter);
                })
            }, animOpt.delayBefore);
            
            
        }// end of lettersLoaderAnimationExit()
        
        
        // ----------------------------------------------------------------------------------
        // UTILITIES
        
        var animationOpening = function(element,animOpt,elementClass) {
            if (animOpt.preventScroll === true) $('body').addClass('introLoader_preventScroll');
            var styleClass = 'theme-'+ animOpt.style;
            if (animOpt.fixed === false) {
                $(element).addClass('absolute');
                $(element).parent().css({'position':'relative','overflow':'hidden'});
            }
            $(element).addClass('introLoader '+ elementClass +' ' + styleClass);
        }// end of animationOpening()
        
        var animationExitEffect = function(animOpt,stopSpin) {
        
            setTimeout(function() {
                           
                switch(animOpt.exitFx) {
                        
                    case "fadeOut":
                        $(element).fadeOut(
                            animOpt.exitTime, 
                            animOpt.ease,
                            function() {
                                if(stopSpin === true) $('#introLoaderSpinner').remove();
                                if (animOpt.preventScroll === true) $('body').removeClass('introLoader_preventScroll');
                                animOpt.onAfter() // onAfter function
                            }
                        );
                        break;

                    case "slideUp":
                        if(stopSpin === true) plugin.spinner.stop();
                        $(element).animate(
                            {"bottom":$(window).height()},
                            animOpt.exitTime, 
                            animOpt.ease,
                            function () {
                                $(element).hide();
                                $('#introLoaderSpinner').remove();
                                if (animOpt.preventScroll === true) $('body').removeClass('introLoader_preventScroll');
                                animOpt.onAfter(); // onAfter function
                            }
                        );
                        break;

                    case "slideDown":
                        if(stopSpin === true) plugin.spinner.stop();
                        $(element).animate(
                            {"top":$(window).height()},
                            animOpt.exitTime, 
                            animOpt.ease,
                            function () {
                                $(element).hide();
                                $('#introLoaderSpinner').remove();
                                if (animOpt.preventScroll === true) $('body').removeClass('introLoader_preventScroll');
                                animOpt.onAfter(); // onAfter function
                            }
                        );
                        break;

                    case "slideLeft":
                        if(stopSpin === true) plugin.spinner.stop();
                        $(element).animate(
                            {"right":$(window).width(),"left":"-100%"},
                            animOpt.exitTime, 
                            animOpt.ease,
                            function () {
                                $(element).hide();
                                $('#introLoaderSpinner').remove();
                                if (animOpt.preventScroll === true) $('body').removeClass('introLoader_preventScroll');
                                animOpt.onAfter(); // onAfter function
                            }
                        );
                        break; 
                        
                    case "slideRight":
                        if(stopSpin === true) plugin.spinner.stop();
                        $(element).animate(
                            {"left":$(window).width(),"right":"-100%"},
                            animOpt.exitTime, 
                            animOpt.ease,
                            function () {
                                $(element).hide();
                                $('#introLoaderSpinner').remove();
                                if (animOpt.preventScroll === true) $('body').removeClass('introLoader_preventScroll');
                                animOpt.onAfter(); // onAfter function
                            }
                        );
                        break;    
                    default:
                        $(element).hide();
                        break;
                }
                

            }, animOpt.delayBefore);
        
        } // end of animationExit()
        
        
        var stringSplitter = function(string, spanClass) {
            var str = string.split("");
            var markup = "";
            for (var i=0; i<str.length; i++) {
                var spanCssClass= spanClass;
                if(str[i] == " ") {
                    spanCssClass = spanClass+"-space";
                    str[i] = " ";
                }
                markup += '<span class="'+ spanCssClass +'">'+ str[i] +'</span>';
            }
            return markup;
        } //end of stringSplitter()
        
        
        
        /* ############################################################## */
        /* PLUGIN INIT */
        plugin.init();

    }

    
    $.fn.introLoader = function(options) {

        
        return this.each(function() {
  
            if (undefined == $(this).data('introLoader')) {
			
                var plugin = new $.introLoader(this, options);
                $(this).data('introLoader', plugin);
                
            }else{
			
                $(this).removeData('introLoader');
                var plugin = new $.introLoader(this, options);
                $(this).data('introLoader', plugin);
				
            }

        });

    }

})(jQuery);