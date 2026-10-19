(function($){
'use strict';
// Central image map: swap any URL here. Gradient fallbacks show if a URL fails to load.
var U=function(id,w){return 'https://images.unsplash.com/'+id+'?auto=format&fit=crop&q=75&w='+(w||900)};
var IMG={hero:U('photo-1541643600914-78b084683601',1800),cat1:U('photo-1541643600914-78b084683601'),cat2:U('photo-1556228720-195a672e8a03'),cat3:U('photo-1571781926291-c477ebfd024b'),
 leaves:U('photo-1470071459604-3b5ec3a7fe05',1600),woman:U('photo-1515377905703-c4788e51af15',1200),coast:U('photo-1507525428034-b723cf961d3e',1800)};
var PRODUCTS=[
 {id:1,name:'Vérité Eau de Parfum',desc:'Amber, white florals, cedar',price:98,rating:5,reviews:214,img:U('photo-1541643600914-78b084683601',700)},
 {id:2,name:'Radiant Face Cream',desc:'Daily botanical moisture',price:68,rating:5,reviews:182,img:U('photo-1556228720-195a672e8a03',700)},
 {id:3,name:'Botanical Face Oil',desc:'Cold-pressed seed blend',price:62,rating:4,reviews:96,img:U('photo-1571781926291-c477ebfd024b',700)},
 {id:4,name:'Silk Body Lotion',desc:'Light, fast-absorbing, soft',price:56,rating:5,reviews:128,img:U('photo-1596462502278-27bfdc403348',700)}];
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var money=function(n){return '$'+n.toFixed(2)};

$('[data-img]').each(function(){var u=IMG[$(this).data('img')],el=this;if(!u)return;
 var t=new Image();t.onload=function(){el.style.backgroundImage='url("'+u+'")'};t.src=u});

var html='';
PRODUCTS.forEach(function(p){
 var s='';for(var i=1;i<=5;i++)s+='<i class="fa-'+(i<=p.rating?'solid':'regular')+' fa-star"></i>';
 html+='<div class="col-6 col-lg-3"><article class="product reveal"><div class="p-img"><img src="'+p.img+'" alt="'+p.name+'" loading="lazy" onerror="this.style.visibility=\'hidden\'"><button class="add-btn" data-id="'+p.id+'">Add to cart</button></div>'+
 '<div class="p-body"><h3>'+p.name+'</h3><p>'+p.desc+'</p><div class="stars" aria-label="'+p.rating+' out of 5 stars">'+s+'<small>('+p.reviews+')</small></div><div class="price">'+money(p.price)+'</div></div></article></div>';
});
$('#productGrid').html(html);

var cart=[];try{cart=JSON.parse(localStorage.getItem('aurelCart'))||[]}catch(e){}
function save(){try{localStorage.setItem('aurelCart',JSON.stringify(cart))}catch(e){}}
function render(){
 var n=0,t=0,h='';
 cart.forEach(function(c){var p=PRODUCTS.filter(function(x){return x.id===c.id})[0];if(!p)return;n+=c.qty;t+=c.qty*p.price;
  h+='<li><img src="'+p.img+'" alt=""><div class="info"><strong>'+p.name+'</strong><br>'+c.qty+' × '+money(p.price)+'</div><button data-rm="'+p.id+'" aria-label="Remove '+p.name+'"><i class="fa-solid fa-xmark"></i></button></li>'});
 $('#cartItems').html(h||'<li class="cart-empty">Your bag is empty.</li>');
 $('#cartCount').text(n);$('#cartTotal').text(money(t));
}
function openPanel(sel,open){$(sel).toggleClass('open',open).attr('aria-hidden',!open);if(sel==='#cartDrawer')$('#backdrop').toggleClass('open',open)}
$(document).on('click','.add-btn',function(){
 var id=+$(this).data('id'),f=cart.filter(function(c){return c.id===id})[0];
 f?f.qty++:cart.push({id:id,qty:1});save();render();
 $('#cartCount').removeClass('pop');void $('#cartCount')[0].offsetWidth;$('#cartCount').addClass('pop');
 openPanel('#cartDrawer',true);
});
$(document).on('click','[data-rm]',function(){var id=+$(this).data('rm');cart=cart.filter(function(c){return c.id!==id});save();render()});
$('#openCart').on('click',function(){openPanel('#cartDrawer',true)});
$('#closeCart,#backdrop').on('click',function(){openPanel('#cartDrawer',false)});
$('#checkoutBtn').on('click',function(){alert('Checkout will be available when the shop pages are built.')});
render();

$('#openSearch').on('click',function(){openPanel('#searchOverlay',true);setTimeout(function(){$('#searchInput').trigger('focus')},300)});
$('#closeSearch').on('click',function(){openPanel('#searchOverlay',false)});
$('#searchForm').on('submit',function(e){e.preventDefault();var q=$.trim($('#searchInput').val());$('#searchNote').text(q?'Results for "'+q+'" will arrive with the shop pages.':'Please enter a search term.')});
$(document).on('keydown',function(e){if(e.key==='Escape'){openPanel('#searchOverlay',false);openPanel('#cartDrawer',false)}});
$('a[href="#"]').on('click',function(e){e.preventDefault()});

$('#newsForm').on('submit',function(e){
 e.preventDefault();var v=$.trim($('#newsEmail').val()),m=$('#newsMsg');
 if(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){m.attr('class','news-msg ok').text('Thank you, and welcome. Check your inbox for your 10% code.');this.reset()}
 else m.attr('class','news-msg err').text('Please enter a valid email address, like name@example.com.');
});

$(window).on('scroll',function(){$('#header').toggleClass('scrolled',$(this).scrollTop()>40)});
$('#toTop').on('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});

if(window.gsap&&window.ScrollTrigger&&!reduce){
 gsap.registerPlugin(ScrollTrigger);
 gsap.from('.hero h1 .line',{yPercent:110,duration:1.2,ease:'power3.out',stagger:.15});
 gsap.from('.hero-sub,.hero .btn-aurel',{opacity:0,y:20,duration:1,delay:.7,stagger:.15,ease:'power2.out'});
 ScrollTrigger.batch('.reveal',{start:'top 92%',once:true,onEnter:function(b){gsap.to(b,{opacity:1,y:0,duration:.9,stagger:.12,ease:'power2.out'})}});
 if(window.innerWidth>991)gsap.to('[data-parallax]',{backgroundPositionY:'60%',ease:'none',scrollTrigger:{trigger:'[data-parallax]',scrub:true}});
}else{$('.reveal').css({opacity:1,transform:'none'})}
})(jQuery);