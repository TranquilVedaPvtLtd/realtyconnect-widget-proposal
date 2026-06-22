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
 *        headline:  "Pre-launch flats in Wakad - 2 BHK from Rs.65L*",     *
 *        promoTag:  "DIWALI",                                             *
 *        bannerImage: "https://your.cdn/promo.jpg",  // http/https only   *
 *        kicker:    "This Diwali",                                        *
 *        ctaLabel:  "Chat",                                               *
 *        brand:     "Realty Connect AI",                                  *
 *        openInNewTab: true                                               *
 *      };                                                                 *
 *    </script>                                                            *
 *  Note: the destination chat URL is hardcoded to                         *
 *  https://chat.realtyconnect.tech and cannot be overridden.              *
 *    <script src=".../widget/embed.js" defer></script>                    *
 *                                                                         *
 *  v1.0 · 2026-06-22 · Tranquil Veda for Pinaka Digital Technologies      *
 * ===================================================================== */
(function () {
  if (window.__rcWidgetLoaded) return;       // guard against double-include
  window.__rcWidgetLoaded = true;

  /* ---------- defaults + user overrides ----------
   * Note: chatUrl is HARDCODED to the production chatbot. It cannot be
   * overridden via RC_WIDGET_CONFIG (Codex review 2026-06-22: prevents
   * arbitrary-redirect risk on a public client widget).
   */
  var CHAT_URL = "https://chat.realtyconnect.tech";
  var defaults = {
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

  /* ---------- safety helpers ---------- */
  // Strict text escape — covers attribute-context AND text-context.
  // (Codex review: previous esc() missed the single-quote, allowing attribute
  //  injection when interpolated into single-quoted attribute values.)
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c];
    });
  }
  // Validate a banner-image URL: must be http(s), absolute, no JS schemes,
  // no embedded quotes/parens/semicolons (CSS-context safety). Returns the
  // safe URL string or null.
  function safeImageUrl(raw){
    if (!raw || typeof raw !== "string") return null;
    if (/['"()\\]/.test(raw) || raw.indexOf(";") !== -1) return null;
    try {
      var u = new URL(raw, window.location.href);
      if (u.protocol !== "https:" && u.protocol !== "http:") return null;
      return u.href;
    } catch (e) { return null; }
  }

  /* ---------- inject CSS once ----------
   * All selectors are scoped under #rc-widget-root so the widget CANNOT
   * restyle WordPress theme/plugin elements (Codex review 2026-06-22).
   */
  var CSS = (
    "#rc-widget-root,#rc-widget-root *{box-sizing:border-box}" +
    "#rc-widget-root .rc-w{position:fixed;right:18px;bottom:18px;z-index:2147483000;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif}" +
    "#rc-widget-root .rc-card{width:320px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px rgba(31,36,97,.28),0 4px 14px rgba(0,0,0,.08);cursor:pointer;transform:translateY(0);opacity:1;transition:transform .22s ease,box-shadow .22s ease,opacity .2s ease}" +
    "#rc-widget-root .rc-card:hover{transform:translateY(-3px);box-shadow:0 30px 72px rgba(31,36,97,.34)}" +
    "#rc-widget-root .rc-card:focus-visible{outline:3px solid #be8116;outline-offset:3px}" +
    "#rc-widget-root .rc-banner{position:relative;height:120px;color:#fff;padding:14px;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;background:linear-gradient(180deg,rgba(31,36,97,.15),rgba(31,36,97,.78)),linear-gradient(135deg,#2a3070 0%,#1f2461 100%);background-size:cover;background-position:center}" +
    "#rc-widget-root .rc-promo{position:absolute;top:10px;left:12px;background:#be8116;color:#fff;font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;padding:3px 9px;border-radius:99px}" +
    // Close button: 44x44 WCAG 2.1 SC 2.5.5 across all viewports (Codex 2026-06-22).
    "#rc-widget-root .rc-close{position:absolute;top:6px;right:6px;width:44px;height:44px;border:0;border-radius:50%;background:rgba(0,0,0,.32);color:#fff;font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}" +
    "#rc-widget-root .rc-close:hover{background:rgba(0,0,0,.5)}" +
    "#rc-widget-root .rc-kicker{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#f3d79a}" +
    "#rc-widget-root .rc-headline{font-size:15.5px;font-weight:700;line-height:1.25;max-width:250px}" +
    "#rc-widget-root .rc-foot{padding:13px 14px;display:flex;align-items:center;gap:10px;background:#fff}" +
    "#rc-widget-root .rc-av{width:38px;height:38px;border-radius:50%;flex:0 0 38px;background:#1f2461;display:flex;align-items:center;justify-content:center}" +
    "#rc-widget-root .rc-av svg{width:20px;height:20px}" +
    "#rc-widget-root .rc-meta{display:flex;flex-direction:column;line-height:1.25;flex:1;min-width:0}" +
    "#rc-widget-root .rc-brand{font-size:14px;font-weight:700;color:#1f2461}" +
    "#rc-widget-root .rc-status{font-size:11.5px;color:#1f7a4a;font-weight:600;display:flex;align-items:center;gap:5px}" +
    "#rc-widget-root .rc-status::before{content:\"\";width:8px;height:8px;border-radius:50%;background:#1f7a4a;box-shadow:0 0 0 0 rgba(31,122,74,.55);animation:rc-pulse 2.2s ease-in-out infinite}" +
    "#rc-widget-root .rc-cta{background:#1f2461;color:#fff;border:0;border-radius:99px;padding:9px 16px;font-size:13px;font-weight:600;cursor:pointer}" +
    "#rc-widget-root .rc-card:hover .rc-cta{background:#be8116}" +
    "#rc-widget-root .rc-bubble{width:64px;height:64px;border-radius:50%;cursor:pointer;background:linear-gradient(135deg,#be8116,#a3680f);color:#fff;display:none;align-items:center;justify-content:center;box-shadow:0 18px 44px rgba(31,36,97,.3);transition:transform .2s ease;position:relative}" +
    "#rc-widget-root .rc-bubble:hover{transform:scale(1.07)}" +
    "#rc-widget-root .rc-bubble:focus-visible{outline:3px solid #1f2461;outline-offset:3px}" +
    "#rc-widget-root .rc-bubble svg{width:30px;height:30px}" +
    "#rc-widget-root .rc-bubble .rc-dot{position:absolute;top:2px;right:2px;width:13px;height:13px;border-radius:50%;background:#1f7a4a;border:2px solid #fff}" +
    "#rc-widget-root .rc-w.rc-collapsed .rc-card{display:none}" +
    "#rc-widget-root .rc-w.rc-collapsed .rc-bubble{display:flex}" +
    "@keyframes rc-pulse{0%,100%{box-shadow:0 0 0 0 rgba(31,122,74,.55)}50%{box-shadow:0 0 0 7px rgba(31,122,74,0)}}" +
    "@media (prefers-reduced-motion: reduce){#rc-widget-root .rc-card,#rc-widget-root .rc-bubble,#rc-widget-root .rc-status::before{transition:none;animation:none}}" +
    "@media (max-width:480px){#rc-widget-root .rc-w{right:12px;bottom:12px}#rc-widget-root .rc-card{width:calc(100vw - 24px);max-width:330px}#rc-widget-root .rc-banner{height:104px}}"
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

  var CHAT_SVG = (
    "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>" +
    "<path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'/></svg>"
  );

  /** Small DOM helper: create element + set attrs safely (no innerHTML for
   *  user-controlled values; uses setAttribute / textContent). */
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }

  function render() {
    if (document.getElementById("rc-widget-instance")) return;  // double-include safety

    var root = document.getElementById("rc-widget-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "rc-widget-root";
      root.setAttribute("aria-live", "polite");
      document.body.appendChild(root);
    }

    /* ---- build the card DOM with safe APIs (no string interpolation into HTML/CSS) ---- */
    var wrap = el("div", {class: "rc-w", id: "rc-widget-instance"});

    // Card
    var card = el("div", {class: "rc-card", role: "button", tabindex: "0",
                          "aria-label": "Open " + CFG.brand});

    // Banner — set background-image ONLY via element.style with a validated URL.
    var banner = el("div", {class: "rc-banner"});
    var validImg = safeImageUrl(CFG.bannerImage);
    if (validImg) {
      banner.style.backgroundImage =
        "linear-gradient(180deg, rgba(31,36,97,.15), rgba(31,36,97,.8)), url(" + JSON.stringify(validImg) + ")";
    }
    if (CFG.promoTag) banner.appendChild(el("span", {class: "rc-promo"}, CFG.promoTag));
    var closeBtn = el("button", {class: "rc-close", "aria-label": "Minimise", type: "button"}, "×");
    banner.appendChild(closeBtn);
    if (CFG.kicker) banner.appendChild(el("span", {class: "rc-kicker"}, CFG.kicker));
    banner.appendChild(el("span", {class: "rc-headline"}, CFG.headline));

    // Foot
    var foot = el("div", {class: "rc-foot"});
    var av = el("span", {class: "rc-av"}); av.innerHTML = CHAT_SVG;  // static, safe
    foot.appendChild(av);
    var meta = el("span", {class: "rc-meta"});
    meta.appendChild(el("span", {class: "rc-brand"}, CFG.brand));
    meta.appendChild(el("span", {class: "rc-status"}, CFG.status));
    foot.appendChild(meta);
    foot.appendChild(el("button", {class: "rc-cta", type: "button", tabindex: "-1"}, CFG.ctaLabel));

    card.appendChild(banner);
    card.appendChild(foot);

    // Bubble (collapsed state)
    var bubble = el("div", {class: "rc-bubble", role: "button", tabindex: "0",
                            "aria-label": "Open " + CFG.brand});
    bubble.innerHTML = CHAT_SVG;  // static, safe
    var dot = el("span", {class: "rc-dot"});
    bubble.appendChild(dot);

    wrap.appendChild(card);
    wrap.appendChild(bubble);
    root.appendChild(wrap);

    function openChat(){
      if (CFG.openInNewTab) window.open(CHAT_URL, "_blank", "noopener");
      else window.location.href = CHAT_URL;
    }
    function collapse(){ wrap.classList.add("rc-collapsed"); if (CFG.rememberMinimised) try{localStorage.setItem("rc_widget_collapsed","1");}catch(e){} }
    function expand(){ wrap.classList.remove("rc-collapsed"); if (CFG.rememberMinimised) try{localStorage.removeItem("rc_widget_collapsed");}catch(e){} }

    if (CFG.rememberMinimised) try{ if (localStorage.getItem("rc_widget_collapsed")==="1") wrap.classList.add("rc-collapsed"); }catch(e){}

    card.addEventListener("click", openChat);
    card.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); openChat(); }});
    bubble.addEventListener("click", expand);
    bubble.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); expand(); }});
    closeBtn.addEventListener("click", function(e){ e.stopPropagation(); collapse(); });
  }

  ready(render);
})();
