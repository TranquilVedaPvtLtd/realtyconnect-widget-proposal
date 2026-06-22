/* ===================================================================== *
 *  Realty Connect — Floating Chat Widget (Option B · Quick Launch)        *
 *  Two-line embed loader.                                                 *
 *                                                                         *
 *  Install on any page (WordPress, plain HTML, anywhere):                 *
 *    <script src="https://tranquilvedapvtltd.github.io/realtyconnect-widget-proposal/widget/embed.js" defer></script>
 *                                                                         *
 *  To override defaults (banner copy, promo, image), set a global config  *
 *  BEFORE the script tag:                                                 *
 *    <script>                                                             *
 *      window.RC_WIDGET_CONFIG = {                                        *
 *        headline:  "Pre-launch flats in Wakad — 2 BHK from ₹65L*",   *
 *        promoTag:  "DIWALI",                                             *
 *        bannerImage: "https://your.cdn/promo.jpg",                       *
 *        kicker:    "This Diwali",                                        *
 *        ctaLabel:  "Chat",                                               *
 *        brand:     "Realty Connect AI",                                  *
 *        chatUrl:   "https://chat.realtyconnect.tech",                    *
 *        openInNewTab: true                                               *
 *      };                                                                 *
 *    </script>                                                            *
 *    <script src=".../widget/embed.js" defer></script>                    *
 *                                                                         *
 *  v1.0 · 2026-06-22 · Tranquil Veda for Pinaka Digital Technologies      *
 * ===================================================================== */
(function () {
  if (window.__rcWidgetLoaded) return;       // guard against double-include
  window.__rcWidgetLoaded = true;

  /* ---------- defaults + user overrides ---------- */
  var defaults = {
    chatUrl:   "https://chat.realtyconnect.tech",
    brand:     "Realty Connect AI",
    status:    "Online now",
    promoTag:  "NEW",
    kicker:    "Ask our AI assistant",
    headline:  "2 BHK in Baner under ₹1 Cr? Ask me anything.",
    ctaLabel:  "Chat",
    bannerImage: "",
    openInNewTab: true,
    rememberMinimised: true
  };
  var user = (window.RC_WIDGET_CONFIG && typeof window.RC_WIDGET_CONFIG === "object") ? window.RC_WIDGET_CONFIG : {};
  var CFG = {};
  for (var k in defaults) CFG[k] = (k in user) ? user[k] : defaults[k];

  /* ---------- inject CSS once ---------- */
  var CSS = (
    "#rc-widget-root,#rc-widget-root *{box-sizing:border-box}" +
    ".rc-w{position:fixed;right:18px;bottom:18px;z-index:2147483000;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif}" +
    ".rc-card{width:320px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px rgba(31,36,97,.28),0 4px 14px rgba(0,0,0,.08);cursor:pointer;transform:translateY(0);opacity:1;transition:transform .22s ease,box-shadow .22s ease,opacity .2s ease}" +
    ".rc-card:hover{transform:translateY(-3px);box-shadow:0 30px 72px rgba(31,36,97,.34)}" +
    ".rc-card:focus-visible{outline:3px solid #be8116;outline-offset:3px}" +
    ".rc-banner{position:relative;height:120px;color:#fff;padding:14px;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;background:linear-gradient(180deg,rgba(31,36,97,.15),rgba(31,36,97,.78)),linear-gradient(135deg,#2a3070 0%,#1f2461 100%);background-size:cover;background-position:center}" +
    ".rc-promo{position:absolute;top:10px;left:12px;background:#be8116;color:#fff;font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;padding:3px 9px;border-radius:99px}" +
    ".rc-close{position:absolute;top:6px;right:6px;width:30px;height:30px;border:0;border-radius:50%;background:rgba(0,0,0,.28);color:#fff;font-size:18px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}" +
    ".rc-close:hover{background:rgba(0,0,0,.45)}" +
    ".rc-kicker{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#f3d79a}" +
    ".rc-headline{font-size:15.5px;font-weight:700;line-height:1.25;max-width:250px}" +
    ".rc-foot{padding:13px 14px;display:flex;align-items:center;gap:10px;background:#fff}" +
    ".rc-av{width:38px;height:38px;border-radius:50%;flex:0 0 38px;background:#1f2461;display:flex;align-items:center;justify-content:center}" +
    ".rc-av svg{width:20px;height:20px}" +
    ".rc-meta{display:flex;flex-direction:column;line-height:1.25;flex:1;min-width:0}" +
    ".rc-brand{font-size:14px;font-weight:700;color:#1f2461}" +
    ".rc-status{font-size:11.5px;color:#1f7a4a;font-weight:600;display:flex;align-items:center;gap:5px}" +
    ".rc-status::before{content:\"\";width:8px;height:8px;border-radius:50%;background:#1f7a4a;box-shadow:0 0 0 0 rgba(31,122,74,.55);animation:rc-pulse 2.2s ease-in-out infinite}" +
    ".rc-cta{background:#1f2461;color:#fff;border:0;border-radius:99px;padding:9px 16px;font-size:13px;font-weight:600;cursor:pointer}" +
    ".rc-card:hover .rc-cta{background:#be8116}" +
    ".rc-bubble{width:64px;height:64px;border-radius:50%;cursor:pointer;background:linear-gradient(135deg,#be8116,#a3680f);color:#fff;display:none;align-items:center;justify-content:center;box-shadow:0 18px 44px rgba(31,36,97,.3);transition:transform .2s ease;position:relative}" +
    ".rc-bubble:hover{transform:scale(1.07)}" +
    ".rc-bubble:focus-visible{outline:3px solid #1f2461;outline-offset:3px}" +
    ".rc-bubble svg{width:30px;height:30px}" +
    ".rc-bubble .rc-dot{position:absolute;top:2px;right:2px;width:13px;height:13px;border-radius:50%;background:#1f7a4a;border:2px solid #fff}" +
    ".rc-w.rc-collapsed .rc-card{display:none}" +
    ".rc-w.rc-collapsed .rc-bubble{display:flex}" +
    "@keyframes rc-pulse{0%,100%{box-shadow:0 0 0 0 rgba(31,122,74,.55)}50%{box-shadow:0 0 0 7px rgba(31,122,74,0)}}" +
    "@media (prefers-reduced-motion: reduce){.rc-card,.rc-bubble,.rc-status::before{transition:none;animation:none}}" +
    "@media (max-width:480px){.rc-w{right:12px;bottom:12px}.rc-card{width:calc(100vw - 24px);max-width:330px}.rc-banner{height:104px}.rc-close{width:34px;height:34px}}"
  );

  var styleEl = document.createElement("style");
  styleEl.setAttribute("data-rc-widget", "1");
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ---------- render after DOM is ready ---------- */
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, {once:true});
    else fn();
  }

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"})[c]; }); }

  var CHAT_SVG = (
    "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>" +
    "<path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'/></svg>"
  );

  function render() {
    if (document.getElementById("rc-widget-instance")) return;  // double-include safety

    var root = document.getElementById("rc-widget-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "rc-widget-root";
      root.setAttribute("aria-live", "polite");
      document.body.appendChild(root);
    }

    var bannerStyle = CFG.bannerImage
      ? " style=\"background-image:linear-gradient(180deg,rgba(31,36,97,.15),rgba(31,36,97,.8)),url('" + encodeURI(CFG.bannerImage) + "');\""
      : "";

    var wrap = document.createElement("div");
    wrap.className = "rc-w";
    wrap.id = "rc-widget-instance";
    wrap.innerHTML =
      "<div class='rc-card' role='button' tabindex='0' aria-label='Open " + esc(CFG.brand) + "'>" +
        "<div class='rc-banner'" + bannerStyle + ">" +
          (CFG.promoTag ? "<span class='rc-promo'>" + esc(CFG.promoTag) + "</span>" : "") +
          "<button class='rc-close' aria-label='Minimise' type='button'>&times;</button>" +
          (CFG.kicker ? "<span class='rc-kicker'>" + esc(CFG.kicker) + "</span>" : "") +
          "<span class='rc-headline'>" + esc(CFG.headline) + "</span>" +
        "</div>" +
        "<div class='rc-foot'>" +
          "<span class='rc-av'>" + CHAT_SVG + "</span>" +
          "<span class='rc-meta'><span class='rc-brand'>" + esc(CFG.brand) + "</span>" +
            "<span class='rc-status'>" + esc(CFG.status) + "</span></span>" +
          "<button class='rc-cta' type='button' tabindex='-1'>" + esc(CFG.ctaLabel) + "</button>" +
        "</div>" +
      "</div>" +
      "<div class='rc-bubble' role='button' tabindex='0' aria-label='Open " + esc(CFG.brand) + "'>" +
        CHAT_SVG + "<span class='rc-dot'></span>" +
      "</div>";
    root.appendChild(wrap);

    function openChat(){
      if (CFG.openInNewTab) window.open(CFG.chatUrl, "_blank", "noopener");
      else window.location.href = CFG.chatUrl;
    }
    function collapse(){ wrap.classList.add("rc-collapsed"); if (CFG.rememberMinimised) try{localStorage.setItem("rc_widget_collapsed","1");}catch(e){} }
    function expand(){ wrap.classList.remove("rc-collapsed"); if (CFG.rememberMinimised) try{localStorage.removeItem("rc_widget_collapsed");}catch(e){} }

    if (CFG.rememberMinimised) try{ if (localStorage.getItem("rc_widget_collapsed")==="1") wrap.classList.add("rc-collapsed"); }catch(e){}

    var card = wrap.querySelector(".rc-card");
    var bubble = wrap.querySelector(".rc-bubble");
    var closeBtn = wrap.querySelector(".rc-close");

    card.addEventListener("click", openChat);
    card.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); openChat(); }});
    bubble.addEventListener("click", expand);
    bubble.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); expand(); }});
    closeBtn.addEventListener("click", function(e){ e.stopPropagation(); collapse(); });
  }

  ready(render);
})();
