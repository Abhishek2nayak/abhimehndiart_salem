/* Abhi Mehndi Art | Salem — shared behaviour */
(function(){
  "use strict";

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if(toggle && links){
    toggle.addEventListener("click",function(){
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click",function(){
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded","false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- mark active nav link ---------- */
  try{
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if(here === "") here = "index.html";
    document.querySelectorAll(".nav-links a[href]").forEach(function(a){
      var href = a.getAttribute("href").split("#")[0].toLowerCase();
      if(href === here || (href === "index.html" && here === "")) a.classList.add("active");
    });
  }catch(e){}

  /* ---------- scroll reveal (fallback for when GSAP is not available) ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if("IntersectionObserver" in window && revealEls.length){
    document.body.classList.add("js-reveal");
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },{threshold:.12, rootMargin:"0px 0px -4% 0px"});
    revealEls.forEach(function(el){ io.observe(el); });
    setTimeout(function(){
      revealEls.forEach(function(el){ el.classList.add("is-visible"); });
    }, 2600);
  }else{
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  }

  /* ---------- GSAP animations (progressive enhancement) ---------- */
  function initGsap(){
    if(typeof window.gsap === "undefined") return;
    var gsap = window.gsap;
    var prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(prefersReduce) return;

    // Hero copy entrance (editorial fade-up)
    var heroCopy = document.querySelector(".hero-copy");
    if(heroCopy){
      var copyTargets = heroCopy.querySelectorAll(".hero-kicker, h1, .hero-lede, .hero-features .feat, .hero-actions, .hero-signature");
      if(copyTargets.length){
        gsap.from(copyTargets,{
          y:26, opacity:0, duration:.8, stagger:.09, ease:"power3.out", clearProps:"all"
        });
      }
    }
    // Hero image entrance (main + overlay)
    var heroWrap = document.querySelector(".hero-visual-wrap");
    if(heroWrap){
      var main = heroWrap.querySelector(".hv-main");
      var overlay = heroWrap.querySelector(".hv-overlay");
      var badge = heroWrap.querySelector(".hv-badge");
      var play = heroWrap.querySelector(".hv-play");
      var tl = gsap.timeline({defaults:{ease:"power3.out"}});
      if(main)   tl.from(main,   {opacity:0, scale:.94, y:28, duration:1.05}, 0);
      if(overlay)tl.from(overlay,{opacity:0, x:-40, y:20, scale:.9, duration:.9, ease:"back.out(1.4)"}, .35);
      if(badge)  tl.from(badge,  {opacity:0, y:-10, duration:.6}, .7);
      if(play)   tl.from(play,   {opacity:0, scale:0, duration:.6, ease:"back.out(2)"}, .85);
    }
    // Service card hover lift (GSAP-powered micro-interaction)
    document.querySelectorAll(".service-card").forEach(function(card){
      var img = card.querySelector(".img-wrap img");
      card.addEventListener("mouseenter", function(){
        if(img) gsap.to(img,{scale:1.08, duration:.6, ease:"power2.out"});
      });
      card.addEventListener("mouseleave", function(){
        if(img) gsap.to(img,{scale:1, duration:.6, ease:"power2.out"});
      });
    });
    // Floating decorative motifs
    document.querySelectorAll(".float-motif").forEach(function(el, i){
      gsap.to(el,{y:-16, duration:3 + i*.4, ease:"sine.inOut", yoyo:true, repeat:-1, delay:i*.3});
    });

    // ScrollTrigger-based reveals if plugin is loaded
    if(window.ScrollTrigger){
      gsap.registerPlugin(window.ScrollTrigger);
      document.querySelectorAll("[data-gsap-fade]").forEach(function(el){
        gsap.from(el,{
          y:40, opacity:0, duration:.9, ease:"power3.out",
          scrollTrigger:{trigger:el, start:"top 85%", once:true}
        });
      });
      document.querySelectorAll("[data-gsap-stagger]").forEach(function(container){
        var children = container.children;
        gsap.from(children,{
          y:34, opacity:0, duration:.7, stagger:.1, ease:"power3.out",
          scrollTrigger:{trigger:container, start:"top 85%", once:true}
        });
      });
    }
  }
  // wait for GSAP to load (deferred script)
  if(document.readyState === "complete"){
    initGsap();
  }else{
    window.addEventListener("load", initGsap);
  }

  /* ---------- testimonial carousel ---------- */
  var carousel = document.querySelector("[data-carousel]");
  if(carousel){
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-slide]"));
    var dotsWrap = carousel.querySelector("[data-dots]");
    var idx = 0, timer;
    if(dotsWrap){
      slides.forEach(function(_,i){
        var b = document.createElement("button");
        b.type="button"; b.setAttribute("aria-label","Show testimonial "+(i+1));
        if(i===0) b.classList.add("is-active");
        b.addEventListener("click",function(){ show(i); restart(); });
        dotsWrap.appendChild(b);
      });
    }
    function show(i){
      idx = (i+slides.length)%slides.length;
      slides.forEach(function(s,j){ s.classList.toggle("is-active", j===idx); });
      if(dotsWrap){
        Array.prototype.forEach.call(dotsWrap.children,function(d,j){ d.classList.toggle("is-active", j===idx); });
      }
    }
    function restart(){
      clearInterval(timer);
      timer = setInterval(function(){ show(idx+1); }, 5200);
    }
    var prev = carousel.querySelector("[data-prev]");
    var next = carousel.querySelector("[data-next]");
    if(prev) prev.addEventListener("click",function(){ show(idx-1); restart(); });
    if(next) next.addEventListener("click",function(){ show(idx+1); restart(); });
    show(0); restart();
  }

  /* ---------- gallery filter ---------- */
  var filterWrap = document.querySelector("[data-filters]");
  if(filterWrap){
    var tiles = document.querySelectorAll("[data-tile]");
    filterWrap.addEventListener("click",function(e){
      var btn = e.target.closest("button[data-filter]");
      if(!btn) return;
      filterWrap.querySelectorAll("button").forEach(function(b){ b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var val = btn.getAttribute("data-filter");
      tiles.forEach(function(t){
        var show = val === "all" || t.getAttribute("data-tile") === val;
        t.style.display = show ? "" : "none";
      });
    });
  }

  /* ---------- FAQ / blog accordions ---------- */
  document.querySelectorAll("[data-accordion-trigger]").forEach(function(trigger){
    trigger.addEventListener("click",function(){
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      var open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", open ? "false" : "true");
      if(panel) panel.hidden = open;
    });
  });

  /* ---------- contact form -> WhatsApp link builder + preview modal ---------- */
  var form = document.querySelector("[data-contact-form]");
  var waLink = document.querySelector("[data-wa-submit]");
  var WA_NUMBER = "918799668439"; /* Salem studio WhatsApp */

  function get(el){ return el ? el.value.trim() : ""; }

  function buildMessage(){
    if(!form) return "";
    var name = get(form.querySelector("[name=name]")),
        service = get(form.querySelector("[name=service]")),
        date = get(form.querySelector("[name=date]")),
        phone = get(form.querySelector("[name=phone]")),
        message = get(form.querySelector("[name=message]"));
    var lines = ["Hello Abhi Mehndi Art! I'd like to enquire about a booking."];
    if(name) lines.push("Name: "+name);
    if(service) lines.push("Service: "+service);
    if(date) lines.push("Preferred date: "+date);
    if(phone) lines.push("My contact number: "+phone);
    if(message) lines.push("Details: "+message);
    return lines.join("\n");
  }

  if(form && waLink){
    var updateHref = function(){
      waLink.href = "https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(buildMessage());
    };
    form.addEventListener("input", updateHref);
    updateHref();
  }

  // Preview modal
  var previewBtn = document.querySelector("[data-preview-btn]");
  var previewModal = document.querySelector("[data-preview-modal]");
  if(previewBtn && previewModal && form){
    var previewText = previewModal.querySelector("[data-preview-text]");
    var previewSendLink = previewModal.querySelector("[data-preview-send]");
    var closeBtn = previewModal.querySelector("[data-preview-close]");

    previewBtn.addEventListener("click", function(e){
      e.preventDefault();
      var msg = buildMessage();
      if(previewText) previewText.textContent = msg;
      if(previewSendLink) previewSendLink.href = "https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(msg);
      previewModal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
    function closeModal(){
      previewModal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    if(closeBtn) closeBtn.addEventListener("click", closeModal);
    previewModal.addEventListener("click", function(e){
      if(e.target === previewModal) closeModal();
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && previewModal.classList.contains("is-open")) closeModal();
    });
  }

  // Form submit fallback (kept for the WhatsApp button that acts as an <a>)
  if(form){
    form.addEventListener("submit",function(e){
      e.preventDefault();
      // trigger preview if the submit came from the outline button
      if(previewBtn){ previewBtn.click(); }
    });
  }

  /* ---------- copy-to-clipboard helper ---------- */
  document.querySelectorAll("[data-copy]").forEach(function(btn){
    btn.addEventListener("click",function(){
      var text = btn.getAttribute("data-copy");
      var done = function(){
        var original = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(function(){ btn.textContent = original; },1600);
      };
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done).catch(function(){
          fallbackCopy(text); done();
        });
      }else{
        fallbackCopy(text); done();
      }
    });
  });
  function fallbackCopy(text){
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position="fixed"; ta.style.opacity="0";
    document.body.appendChild(ta); ta.select();
    try{ document.execCommand("copy"); }catch(e){}
    document.body.removeChild(ta);
  }

  /* ---------- current year in footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function(el){ el.textContent = new Date().getFullYear(); });

})();
