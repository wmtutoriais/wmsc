/*
 * desenvolvidor por Welison Menezes
 * welisonmenezes@gmail.com
 */
(function( $ ){
    $.fn.wmsc = function(options) {
        var element  = $(this);
        var defaults = {
            'auto'        :true,
            'bullets'     : {
                'show':true,
                'num_bullets': true
            },
            'draggable'   : false,
            'interval'    : 4000,
            'item'        : {
                'h':150,
                'w':250
            },
            'pag':{
                'show':true,
                'labels'  :{
                    'p':'Prev',
                    'n':'Next'
                }
            },
            'pause_hover' : true,
            'speed'       : 800,
            'vertical'    : false,
            'visible'     :1
        };
        var settings = $.extend(true, defaults, options);
        funcs.init_wmsc(element, settings);
    };
    var funcs = {
        init_wmsc: function(el, set){
            var obj = funcs.get_el(el, set);
            funcs.add_bullet_pag(el, set, obj);
            if( set.pag.show == true ) funcs.add_pagination(el, set, obj);
            if( set.vertical == false ) funcs.style_horizontal(el, set, obj);
            if( set.vertical == true ) funcs.style_vertical(el, set, obj);
            if( set.draggable == true && set.vertical == false ) funcs.drag_horizontal(el, set, obj);
            if( set.draggable == true && set.vertical == true ) funcs.drag_vertical(el, set, obj);
            funcs.set_default(el, set, obj);
            funcs.temp_auto(el, set, obj);
        },
        temp_auto: function(el, set, obj){
            if( set.auto === true ) {
                var t = window.setInterval(function() {
                    if( set.vertical == false ) funcs.next_horizontal(el, set, obj);
                    if( set.vertical == true ) funcs.next_vertical(el, set, obj);
                }, set.interval);
                if( set.pause_hover === true ){
                    el.hover(function(){
                        window.clearTimeout(t);
                    },function(){
                        t = window.setInterval(function() {
                            if( set.vertical == false ) funcs.next_horizontal(el, set, obj);
                            if( set.vertical == true ) funcs.next_vertical(el, set, obj);
                        }, set.interval);
                    });
                } 
            }
        },
        set_default : function(el, set, obj){
            obj.first.addClass('item_active');
        },
        add_bullet_pag : function(el, set, obj){
            if( set.bullets.show == true )
                var html    = '<div class="wmsc_bullets" style="position:absolute; z-index:11;" >';

            if( set.bullets.show == false )
                var html    = '<div class="wmsc_bullets" style="position:absolute; z-index:11; display:none !important;" >';

            if( set.bullets.num_bullets === true ){
                for(var i=0; i<obj.new_len; i++){
                    if (i == 0){
                       html +='<span class="wmsc_active" style="float: left; margin-right:3px;" rel="'+ (i+1) +'" >'+ (i+1) +'</span>'; 
                    }else{
                        html +='<span style="float: left; margin-right:3px;" rel="'+ (i+1) +'" >'+ (i+1) +'</span>';
                    }
                }
            }else{
                for(var i=0; i<obj.new_len; i++){
                    if (i == 0){
                       html +='<span style="float: left; margin-right:3px;" class="wmsc_active" rel="'+ (i+1) +'" ></span>'; 
                    }else{
                        html +='<span style="float: left; margin-right:3px;" rel="'+ (i+1) +'" ></span>';
                    }
                }
            }

            html     += '</div>';
            $(html).appendTo( obj.full );

            funcs.bullet_pag(el, set, obj);
        },
        bullet_pag : function(el, set, obj){
            el.delegate('div.wmsc_bullets > span', 'click', function(){
                var index     = $(this).attr('rel');
                if( set.vertical == false ) funcs.nav_bullet_horizontal(el, set, obj, index);
                if( set.vertical == true ) funcs.nav_bullet_vertical(el, set, obj, index);
            });
        },
        add_pagination : function(el, set, obj){
            var html  = '<div class="wmsc_pag">';
            html     += '<div class="wmsc_prev" style="position:absolute; z-index:12;">'+set.pag.labels.p+'</div>';
            html     += '<div class="wmsc_next" style="position:absolute; z-index:12;">'+set.pag.labels.n+'</div>';
            html     += '</div>'; 
            $(html).appendTo( obj.el );

            funcs.pagination(el, set, obj);
        },
        pagination : function(el, set, obj){
            el.delegate('div.wmsc_pag div.wmsc_prev', 'click', function(){
                if( set.vertical == false ) funcs.prev_horizontal(el, set, obj);
                if( set.vertical == true ) funcs.prev_vertical(el, set, obj);
            });

            el.delegate('div.wmsc_pag div.wmsc_next', 'click', function(){
                if( set.vertical == false ) funcs.next_horizontal(el, set, obj);
                if( set.vertical == true ) funcs.next_vertical(el, set, obj);
            });
        },
        next_horizontal : function( el, set, obj ){
            var cont = (obj.box.width() - obj.ani) - set.item.w;
            var index = $('div.wmsc_bullets span.wmsc_active', el).attr('rel');

            var w_dinamic = (obj.ani*index) - set.item.w * set.visible;
            var w_total   = set.item.w * obj.len;
            var w_cont    = w_total - ( set.item.w * set.visible );

            index = index-1;    

             if( w_dinamic >= w_cont ){ 
                obj.box.stop().animate({"left": '0px'}, set.speed);
                i = 0;
                funcs.get_active(el, set, obj, i );
                return false;
            }
            else if( (w_dinamic+set.item.w) == w_cont ){
                obj.box.stop().animate({"left": '-'+( w_dinamic + set.item.w )+'px'}, set.speed);
                i = index + 1
                funcs.get_active(el, set, obj, i );
                return false;
            }
            else if( w_dinamic <= w_total ){ 
                obj.box.stop().animate({"left": '-'+( w_dinamic + set.item.w * set.visible )+'px'}, set.speed);
                i = index + 1
                funcs.get_active(el, set, obj, i );
                return false;
            }
            return false;
        },
        next_vertical : function( el, set, obj ){
            var cont = (obj.box.height() - obj.ani_v) - set.item.h;
            var index = $('div.wmsc_bullets span.wmsc_active', el).attr('rel');

            var w_dinamic = (obj.ani_v*index) - set.item.h * set.visible;
            var w_total   = set.item.h * obj.len;
            var w_cont    = w_total - ( set.item.h * set.visible );

            index = index-1;    

             if( w_dinamic >= w_cont ){ 
                obj.box.stop().animate({"top": '0px'}, set.speed);
                i = 0;
                funcs.get_active(el, set, obj, i );
                return false;
            }
            else if( (w_dinamic+set.item.h) == w_cont ){
                obj.box.stop().animate({"top": '-'+( w_dinamic + set.item.h )+'px'}, set.speed);
                i = index + 1
                funcs.get_active(el, set, obj, i );
                return false;
            }
            else if( w_dinamic <= w_total ){ 
                obj.box.stop().animate({"top": '-'+( w_dinamic + set.item.h * set.visible )+'px'}, set.speed);
                i = index + 1
                funcs.get_active(el, set, obj, i );
                return false;
            }
            return false;
        },
        prev_horizontal : function( el, set, obj ){
            var cont = (obj.box.width() - obj.ani) - set.item.w;
            var index = $('div.wmsc_bullets span.wmsc_active',el).attr('rel');

            var w_dinamic = (obj.ani*index) - set.item.w * set.visible;
            var w_total   = set.item.w * obj.len;
            var w_cont    = w_total - ( set.item.w * set.visible );

            index = index-1;

            if( w_dinamic == 0 ){
                obj.box.stop().animate({"left": '-'+w_cont+'px'}, set.speed);
                i = index -1
                funcs.get_active(el, set, obj, i );
                return false;
            }
            else if( w_dinamic <= w_total ){
                obj.box.stop().animate({"left": '-'+( w_dinamic - (set.item.w * set.visible) )+'px'}, set.speed);
                i = index -1
                funcs.get_active(el, set, obj, i );
                return false;
            }
            return false;
        },
        prev_vertical : function( el, set, obj ){
            var cont = (obj.box.height() - obj.ani_v) - set.item.h;
            var index = $('div.wmsc_bullets span.wmsc_active',el).attr('rel');

            var w_dinamic = (obj.ani_v*index) - set.item.h * set.visible;
            var w_total   = set.item.h * obj.len;
            var w_cont    = w_total - ( set.item.h * set.visible );

            index = index-1;

            if( w_dinamic == 0 ){
                obj.box.stop().animate({"top": '-'+w_cont+'px'}, set.speed);
                i = index -1
                funcs.get_active(el, set, obj, i );
                return false;
            }
            else if( w_dinamic <= w_total ){
                obj.box.stop().animate({"top": '-'+( w_dinamic - (set.item.h * set.visible) )+'px'}, set.speed);
                i = index -1
                funcs.get_active(el, set, obj, i );
                return false;
            }
            return false;
        },
        nav_bullet_horizontal : function(el, set, obj, index){
            var active    = $('div.wmsc_bullets span.wmsc_active', el).attr('rel');
            var w_dinamic = (obj.ani*index) - set.item.w * set.visible;
            var w_total   = set.item.w * obj.len;
            var w_cont    = w_total - ( set.item.w * set.visible );

            if( $(this).hasClass('wmsc_active') ){
                return false;
            }
            else if( w_cont < w_dinamic ){
                obj.box.stop().animate({"left": '-'+w_cont+'px'}, set.speed);
                funcs.get_active(el, set, obj, (index-1) );
            }
            else if( w_dinamic < w_total && index > active ){
                obj.box.stop().animate({"left": '-'+w_dinamic+'px'}, set.speed);
                funcs.get_active(el, set, obj, (index-1) );
            }
            else if( w_dinamic < w_total && index < active ){
                obj.box.stop().animate({"left": '-'+w_dinamic+'px'}, set.speed);
                funcs.get_active(el, set, obj, (index-1) );
            }
            return false;
        },
        nav_bullet_vertical : function(el, set, obj, index){
            var active    = $('div.wmsc_bullets span.wmsc_active', el).attr('rel');
            var w_dinamic = (obj.ani_v*index) - set.item.h * set.visible;
            var w_total   = set.item.h * obj.len;
            var w_cont    = w_total - ( set.item.h * set.visible );

            if( $(this).hasClass('wmsc_active') ){
                return false;
            }
            else if( w_cont < w_dinamic ){
                obj.box.stop().animate({"top": '-'+w_cont+'px'}, set.speed);
                funcs.get_active(el, set, obj, (index-1) );
            }
            else if( w_dinamic < w_total && index > active ){
                obj.box.stop().animate({"top": '-'+w_dinamic+'px'}, set.speed);
                funcs.get_active(el, set, obj, (index-1) );
            }
            else if( w_dinamic < w_total && index < active ){
                obj.box.stop().animate({"top": '-'+w_dinamic+'px'}, set.speed);
                funcs.get_active(el, set, obj, (index-1) );
            }
            return false;
        },
        drag_horizontal : function(el, set, obj){
            var wid  = obj.itens.outerWidth();
            var total = obj.len;
            obj.box.draggable({  
                scroll: false,
                axis: "x",
                iframeFix: true,
                start: function( event, ui ) {
                    return true;
                },
                stop: function( event, ui ){
                    var l = ui.position.left;
                    var i = (obj.box.outerWidth() - (wid*set.visible) ) * -1;
                    var v = ( (total*wid) - (wid*set.visible) );
                    if( (l*-1) >= v  ){
                        obj.box.css({'top': 0, 'left' : i+'px'});
                    }
                    if( l > 1 ) {
                        obj.box.css({'left' :'0px'}); 
                    }
                    return true;
                }
            });
        },
        drag_vertical : function(el, set, obj){
            var wid  = obj.itens.outerHeight();
            var total = obj.len;
            obj.box.draggable({  
                scroll: false,
                axis: "y",
                iframeFix: true,
                start: function( event, ui ) {
                    return true;
                },
                stop: function( event, ui ){
                    var l = ui.position.top;
                    var i = (obj.box.outerHeight() - (wid*set.visible) ) * -1;
                    var v = ( (total*wid) - (wid*set.visible) );
                    if( (l*-1) >= v  ){
                        obj.box.css({'left': 0, 'top' : i+'px'});
                    }
                    if( l > 1 ) {
                        obj.box.css({'top' :'0px'}); 
                    }
                    return true;
                }
            });
        },
        get_active : function(el, set, obj, dir){
            var active = $('div.wmsc_bullets span.wmsc_active', el);
            $('div.wmsc_bullets span', el).removeClass('wmsc_active');
            $('div.wmsc_bullets span', el).eq(dir).addClass('wmsc_active');
            return false;
        },
        style_horizontal: function(el, set, obj){
            obj.el.css({
                'display'   : 'block',
                'position'  : 'relative',
                '-moz-user-select': 'none',
                '-khtml-user-select': 'none',
                '-webkit-user-select': 'none',
                'user-select': 'none'
            });

            obj.full.css({
                'display'   : 'block',
                'height'    : set.item.h+'px',
                'overflow'  :'hidden',
                'position'  :'relative',
                'width'     : ( set.item.w * set.visible )+'px'
            });

            obj.box.css({
                'display'   : 'block',
                'height'    : set.item.h+'px',
                'left'      :'0px',
                'position'  :'absolute',
                'top'       :'0px',
                'width'     : ( set.item.w * obj.len )+'px',
                'z-index'   : '10'
            });

            obj.itens.css({
                'display'   :'block',
                'float'     : 'left',
                'height'    : set.item.h+'px',
                'overflow'  : 'hidden',
                'width'     : set.item.w+'px'
            });
        }, 
        style_vertical: function(el, set, obj){
            obj.el.css({
                'display'   : 'block',
                'position'  : 'relative',
                '-moz-user-select': 'none',
                '-khtml-user-select': 'none',
                '-webkit-user-select': 'none',
                'user-select': 'none'
            });

            obj.full.css({
                'display'   : 'block',
                'height'    : ( set.item.h * set.visible )+'px',
                'overflow'  :'hidden',
                'position'  :'relative',
                'width'     : ( set.item.w )+'px'
            });

            obj.box.css({
                'display'   : 'block',
                'height'    : ( set.item.h * obj.len )+'px',
                'left'      :'0px',
                'position'  :'absolute',
                'top'       :'0px',
                'width'     : ( set.item.w )+'px',
                'z-index'   : '10'
            });

            obj.itens.css({
                'display'   :'block',
                'height'    : set.item.h+'px',
                'overflow'  : 'hidden',
                'width'     : set.item.w+'px'
            });
        }, 
        get_el : function(el, set){
            var el      = el;
            var full    = el.children().eq(0);
            var box     = full.children().eq(0);
            var itens   = box.children();
            var first   = itens.eq(0);
            var len     = itens.length;
            var new_len = Math.round(len / set.visible);
            var ani     = set.item.w * set.visible;
            var ani_v   = set.item.h * set.visible;

            var obj = {
                'el'      : el,
                'full'    : full,
                'box'     : box,
                'itens'   : itens,
                'first'   : first,
                'len'     : len,
                'ani'     : ani,
                'ani_v'   : ani_v,
                'new_len' : new_len
            }
            return obj;
        }
    }
})( jQuery );