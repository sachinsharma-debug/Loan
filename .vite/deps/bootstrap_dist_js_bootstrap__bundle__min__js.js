import {
  __commonJS
} from "./chunk-V4OQ3NZ2.js";

// node_modules/bootstrap/dist/js/bootstrap.bundle.min.js
var require_bootstrap_bundle_min = __commonJS({
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).bootstrap = e();
    }(exports, function() {
      "use strict";
      const t = { find: (t2, e2 = document.documentElement) => [].concat(...Element.prototype.querySelectorAll.call(e2, t2)), findOne: (t2, e2 = document.documentElement) => Element.prototype.querySelector.call(e2, t2), children: (t2, e2) => [].concat(...t2.children).filter((t3) => t3.matches(e2)), parents(t2, e2) {
        const i2 = [];
        let n2 = t2.parentNode;
        for (; n2 && n2.nodeType === Node.ELEMENT_NODE && 3 !== n2.nodeType; ) n2.matches(e2) && i2.push(n2), n2 = n2.parentNode;
        return i2;
      }, prev(t2, e2) {
        let i2 = t2.previousElementSibling;
        for (; i2; ) {
          if (i2.matches(e2)) return [i2];
          i2 = i2.previousElementSibling;
        }
        return [];
      }, next(t2, e2) {
        let i2 = t2.nextElementSibling;
        for (; i2; ) {
          if (i2.matches(e2)) return [i2];
          i2 = i2.nextElementSibling;
        }
        return [];
      } }, e = (t2) => {
        do {
          t2 += Math.floor(1e6 * Math.random());
        } while (document.getElementById(t2));
        return t2;
      }, i = (t2) => {
        let e2 = t2.getAttribute("data-bs-target");
        if (!e2 || "#" === e2) {
          let i2 = t2.getAttribute("href");
          if (!i2 || !i2.includes("#") && !i2.startsWith(".")) return null;
          i2.includes("#") && !i2.startsWith("#") && (i2 = "#" + i2.split("#")[1]), e2 = i2 && "#" !== i2 ? i2.trim() : null;
        }
        return e2;
      }, n = (t2) => {
        const e2 = i(t2);
        return e2 && document.querySelector(e2) ? e2 : null;
      }, s = (t2) => {
        const e2 = i(t2);
        return e2 ? document.querySelector(e2) : null;
      }, o = (t2) => {
        if (!t2) return 0;
        let { transitionDuration: e2, transitionDelay: i2 } = window.getComputedStyle(t2);
        const n2 = Number.parseFloat(e2), s2 = Number.parseFloat(i2);
        return n2 || s2 ? (e2 = e2.split(",")[0], i2 = i2.split(",")[0], 1e3 * (Number.parseFloat(e2) + Number.parseFloat(i2))) : 0;
      }, r = (t2) => {
        t2.dispatchEvent(new Event("transitionend"));
      }, a = (t2) => !(!t2 || "object" != typeof t2) && (void 0 !== t2.jquery && (t2 = t2[0]), void 0 !== t2.nodeType), l = (e2) => a(e2) ? e2.jquery ? e2[0] : e2 : "string" == typeof e2 && e2.length > 0 ? t.findOne(e2) : null, c = (t2, e2) => {
        let i2 = false;
        const n2 = e2 + 5;
        t2.addEventListener("transitionend", function e3() {
          i2 = true, t2.removeEventListener("transitionend", e3);
        }), setTimeout(() => {
          i2 || r(t2);
        }, n2);
      }, d = (t2, e2, i2) => {
        Object.keys(i2).forEach((n2) => {
          const s2 = i2[n2], o2 = e2[n2], r2 = o2 && a(o2) ? "element" : null == (l2 = o2) ? "" + l2 : {}.toString.call(l2).match(/\s([a-z]+)/i)[1].toLowerCase();
          var l2;
          if (!new RegExp(s2).test(r2)) throw new TypeError(`${t2.toUpperCase()}: Option "${n2}" provided type "${r2}" but expected type "${s2}".`);
        });
      }, h = (t2) => {
        if (!t2) return false;
        if (t2.style && t2.parentNode && t2.parentNode.style) {
          const e2 = getComputedStyle(t2), i2 = getComputedStyle(t2.parentNode);
          return "none" !== e2.display && "none" !== i2.display && "hidden" !== e2.visibility;
        }
        return false;
      }, u = (t2) => !t2 || t2.nodeType !== Node.ELEMENT_NODE || !!t2.classList.contains("disabled") || (void 0 !== t2.disabled ? t2.disabled : t2.hasAttribute("disabled") && "false" !== t2.getAttribute("disabled")), f = (t2) => {
        if (!document.documentElement.attachShadow) return null;
        if ("function" == typeof t2.getRootNode) {
          const e2 = t2.getRootNode();
          return e2 instanceof ShadowRoot ? e2 : null;
        }
        return t2 instanceof ShadowRoot ? t2 : t2.parentNode ? f(t2.parentNode) : null;
      }, p = () => {
      }, m = (t2) => t2.offsetHeight, g = () => {
        const { jQuery: t2 } = window;
        return t2 && !document.body.hasAttribute("data-bs-no-jquery") ? t2 : null;
      }, _ = () => "rtl" === document.documentElement.dir, b = (t2) => {
        var e2;
        e2 = () => {
          const e3 = g();
          if (e3) {
            const i2 = t2.NAME, n2 = e3.fn[i2];
            e3.fn[i2] = t2.jQueryInterface, e3.fn[i2].Constructor = t2, e3.fn[i2].noConflict = () => (e3.fn[i2] = n2, t2.jQueryInterface);
          }
        }, "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", e2) : e2();
      }, v = (t2) => {
        "function" == typeof t2 && t2();
      }, y = /* @__PURE__ */ new Map();
      var w = { set(t2, e2, i2) {
        y.has(t2) || y.set(t2, /* @__PURE__ */ new Map());
        const n2 = y.get(t2);
        n2.has(e2) || 0 === n2.size ? n2.set(e2, i2) : console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(n2.keys())[0]}.`);
      }, get: (t2, e2) => y.has(t2) && y.get(t2).get(e2) || null, remove(t2, e2) {
        if (!y.has(t2)) return;
        const i2 = y.get(t2);
        i2.delete(e2), 0 === i2.size && y.delete(t2);
      } };
      const E = /[^.]*(?=\..*)\.|.*/, T = /\..*/, A = /::\d+$/, L = {};
      let O = 1;
      const k = { mouseenter: "mouseover", mouseleave: "mouseout" }, C = /^(mouseenter|mouseleave)/i, x = /* @__PURE__ */ new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
      function D(t2, e2) {
        return e2 && `${e2}::${O++}` || t2.uidEvent || O++;
      }
      function N(t2) {
        const e2 = D(t2);
        return t2.uidEvent = e2, L[e2] = L[e2] || {}, L[e2];
      }
      function S(t2, e2, i2 = null) {
        const n2 = Object.keys(t2);
        for (let s2 = 0, o2 = n2.length; s2 < o2; s2++) {
          const o3 = t2[n2[s2]];
          if (o3.originalHandler === e2 && o3.delegationSelector === i2) return o3;
        }
        return null;
      }
      function I(t2, e2, i2) {
        const n2 = "string" == typeof e2, s2 = n2 ? i2 : e2;
        let o2 = M(t2);
        return x.has(o2) || (o2 = t2), [n2, s2, o2];
      }
      function j(t2, e2, i2, n2, s2) {
        if ("string" != typeof e2 || !t2) return;
        if (i2 || (i2 = n2, n2 = null), C.test(e2)) {
          const t3 = (t4) => function(e3) {
            if (!e3.relatedTarget || e3.relatedTarget !== e3.delegateTarget && !e3.delegateTarget.contains(e3.relatedTarget)) return t4.call(this, e3);
          };
          n2 ? n2 = t3(n2) : i2 = t3(i2);
        }
        const [o2, r2, a2] = I(e2, i2, n2), l2 = N(t2), c2 = l2[a2] || (l2[a2] = {}), d2 = S(c2, r2, o2 ? i2 : null);
        if (d2) return void (d2.oneOff = d2.oneOff && s2);
        const h2 = D(r2, e2.replace(E, "")), u2 = o2 ? /* @__PURE__ */ function(t3, e3, i3) {
          return function n3(s3) {
            const o3 = t3.querySelectorAll(e3);
            for (let { target: r3 } = s3; r3 && r3 !== this; r3 = r3.parentNode) for (let a3 = o3.length; a3--; ) if (o3[a3] === r3) return s3.delegateTarget = r3, n3.oneOff && H.off(t3, s3.type, e3, i3), i3.apply(r3, [s3]);
            return null;
          };
        }(t2, i2, n2) : /* @__PURE__ */ function(t3, e3) {
          return function i3(n3) {
            return n3.delegateTarget = t3, i3.oneOff && H.off(t3, n3.type, e3), e3.apply(t3, [n3]);
          };
        }(t2, i2);
        u2.delegationSelector = o2 ? i2 : null, u2.originalHandler = r2, u2.oneOff = s2, u2.uidEvent = h2, c2[h2] = u2, t2.addEventListener(a2, u2, o2);
      }
      function P(t2, e2, i2, n2, s2) {
        const o2 = S(e2[i2], n2, s2);
        o2 && (t2.removeEventListener(i2, o2, Boolean(s2)), delete e2[i2][o2.uidEvent]);
      }
      function M(t2) {
        return t2 = t2.replace(T, ""), k[t2] || t2;
      }
      const H = { on(t2, e2, i2, n2) {
        j(t2, e2, i2, n2, false);
      }, one(t2, e2, i2, n2) {
        j(t2, e2, i2, n2, true);
      }, off(t2, e2, i2, n2) {
        if ("string" != typeof e2 || !t2) return;
        const [s2, o2, r2] = I(e2, i2, n2), a2 = r2 !== e2, l2 = N(t2), c2 = e2.startsWith(".");
        if (void 0 !== o2) {
          if (!l2 || !l2[r2]) return;
          return void P(t2, l2, r2, o2, s2 ? i2 : null);
        }
        c2 && Object.keys(l2).forEach((i3) => {
          !function(t3, e3, i4, n3) {
            const s3 = e3[i4] || {};
            Object.keys(s3).forEach((o3) => {
              if (o3.includes(n3)) {
                const n4 = s3[o3];
                P(t3, e3, i4, n4.originalHandler, n4.delegationSelector);
              }
            });
          }(t2, l2, i3, e2.slice(1));
        });
        const d2 = l2[r2] || {};
        Object.keys(d2).forEach((i3) => {
          const n3 = i3.replace(A, "");
          if (!a2 || e2.includes(n3)) {
            const e3 = d2[i3];
            P(t2, l2, r2, e3.originalHandler, e3.delegationSelector);
          }
        });
      }, trigger(t2, e2, i2) {
        if ("string" != typeof e2 || !t2) return null;
        const n2 = g(), s2 = M(e2), o2 = e2 !== s2, r2 = x.has(s2);
        let a2, l2 = true, c2 = true, d2 = false, h2 = null;
        return o2 && n2 && (a2 = n2.Event(e2, i2), n2(t2).trigger(a2), l2 = !a2.isPropagationStopped(), c2 = !a2.isImmediatePropagationStopped(), d2 = a2.isDefaultPrevented()), r2 ? (h2 = document.createEvent("HTMLEvents"), h2.initEvent(s2, l2, true)) : h2 = new CustomEvent(e2, { bubbles: l2, cancelable: true }), void 0 !== i2 && Object.keys(i2).forEach((t3) => {
          Object.defineProperty(h2, t3, { get: () => i2[t3] });
        }), d2 && h2.preventDefault(), c2 && t2.dispatchEvent(h2), h2.defaultPrevented && void 0 !== a2 && a2.preventDefault(), h2;
      } };
      class R {
        constructor(t2) {
          (t2 = l(t2)) && (this._element = t2, w.set(this._element, this.constructor.DATA_KEY, this));
        }
        dispose() {
          w.remove(this._element, this.constructor.DATA_KEY), H.off(this._element, this.constructor.EVENT_KEY), Object.getOwnPropertyNames(this).forEach((t2) => {
            this[t2] = null;
          });
        }
        _queueCallback(t2, e2, i2 = true) {
          if (!i2) return void v(t2);
          const n2 = o(e2);
          H.one(e2, "transitionend", () => v(t2)), c(e2, n2);
        }
        static getInstance(t2) {
          return w.get(t2, this.DATA_KEY);
        }
        static get VERSION() {
          return "5.0.1";
        }
        static get NAME() {
          throw new Error('You have to implement the static method "NAME", for each component!');
        }
        static get DATA_KEY() {
          return "bs." + this.NAME;
        }
        static get EVENT_KEY() {
          return "." + this.DATA_KEY;
        }
      }
      class B extends R {
        static get NAME() {
          return "alert";
        }
        close(t2) {
          const e2 = t2 ? this._getRootElement(t2) : this._element, i2 = this._triggerCloseEvent(e2);
          null === i2 || i2.defaultPrevented || this._removeElement(e2);
        }
        _getRootElement(t2) {
          return s(t2) || t2.closest(".alert");
        }
        _triggerCloseEvent(t2) {
          return H.trigger(t2, "close.bs.alert");
        }
        _removeElement(t2) {
          t2.classList.remove("show");
          const e2 = t2.classList.contains("fade");
          this._queueCallback(() => this._destroyElement(t2), t2, e2);
        }
        _destroyElement(t2) {
          t2.parentNode && t2.parentNode.removeChild(t2), H.trigger(t2, "closed.bs.alert");
        }
        static jQueryInterface(t2) {
          return this.each(function() {
            let e2 = w.get(this, "bs.alert");
            e2 || (e2 = new B(this)), "close" === t2 && e2[t2](this);
          });
        }
        static handleDismiss(t2) {
          return function(e2) {
            e2 && e2.preventDefault(), t2.close(this);
          };
        }
      }
      H.on(document, "click.bs.alert.data-api", '[data-bs-dismiss="alert"]', B.handleDismiss(new B())), b(B);
      class W extends R {
        static get NAME() {
          return "button";
        }
        toggle() {
          this._element.setAttribute("aria-pressed", this._element.classList.toggle("active"));
        }
        static jQueryInterface(t2) {
          return this.each(function() {
            let e2 = w.get(this, "bs.button");
            e2 || (e2 = new W(this)), "toggle" === t2 && e2[t2]();
          });
        }
      }
      function q(t2) {
        return "true" === t2 || "false" !== t2 && (t2 === Number(t2).toString() ? Number(t2) : "" === t2 || "null" === t2 ? null : t2);
      }
      function z(t2) {
        return t2.replace(/[A-Z]/g, (t3) => "-" + t3.toLowerCase());
      }
      H.on(document, "click.bs.button.data-api", '[data-bs-toggle="button"]', (t2) => {
        t2.preventDefault();
        const e2 = t2.target.closest('[data-bs-toggle="button"]');
        let i2 = w.get(e2, "bs.button");
        i2 || (i2 = new W(e2)), i2.toggle();
      }), b(W);
      const U = { setDataAttribute(t2, e2, i2) {
        t2.setAttribute("data-bs-" + z(e2), i2);
      }, removeDataAttribute(t2, e2) {
        t2.removeAttribute("data-bs-" + z(e2));
      }, getDataAttributes(t2) {
        if (!t2) return {};
        const e2 = {};
        return Object.keys(t2.dataset).filter((t3) => t3.startsWith("bs")).forEach((i2) => {
          let n2 = i2.replace(/^bs/, "");
          n2 = n2.charAt(0).toLowerCase() + n2.slice(1, n2.length), e2[n2] = q(t2.dataset[i2]);
        }), e2;
      }, getDataAttribute: (t2, e2) => q(t2.getAttribute("data-bs-" + z(e2))), offset(t2) {
        const e2 = t2.getBoundingClientRect();
        return { top: e2.top + document.body.scrollTop, left: e2.left + document.body.scrollLeft };
      }, position: (t2) => ({ top: t2.offsetTop, left: t2.offsetLeft }) }, $ = { interval: 5e3, keyboard: true, slide: false, pause: "hover", wrap: true, touch: true }, F = { interval: "(number|boolean)", keyboard: "boolean", slide: "(boolean|string)", pause: "(string|boolean)", wrap: "boolean", touch: "boolean" }, V = "next", K = "prev", X = "left", Y = "right";
      class Q extends R {
        constructor(e2, i2) {
          super(e2), this._items = null, this._interval = null, this._activeElement = null, this._isPaused = false, this._isSliding = false, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(i2), this._indicatorsElement = t.findOne(".carousel-indicators", this._element), this._touchSupported = "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0, this._pointerEvent = Boolean(window.PointerEvent), this._addEventListeners();
        }
        static get Default() {
          return $;
        }
        static get NAME() {
          return "carousel";
        }
        next() {
          this._isSliding || this._slide(V);
        }
        nextWhenVisible() {
          !document.hidden && h(this._element) && this.next();
        }
        prev() {
          this._isSliding || this._slide(K);
        }
        pause(e2) {
          e2 || (this._isPaused = true), t.findOne(".carousel-item-next, .carousel-item-prev", this._element) && (r(this._element), this.cycle(true)), clearInterval(this._interval), this._interval = null;
        }
        cycle(t2) {
          t2 || (this._isPaused = false), this._interval && (clearInterval(this._interval), this._interval = null), this._config && this._config.interval && !this._isPaused && (this._updateInterval(), this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval));
        }
        to(e2) {
          this._activeElement = t.findOne(".active.carousel-item", this._element);
          const i2 = this._getItemIndex(this._activeElement);
          if (e2 > this._items.length - 1 || e2 < 0) return;
          if (this._isSliding) return void H.one(this._element, "slid.bs.carousel", () => this.to(e2));
          if (i2 === e2) return this.pause(), void this.cycle();
          const n2 = e2 > i2 ? V : K;
          this._slide(n2, this._items[e2]);
        }
        _getConfig(t2) {
          return t2 = { ...$, ...t2 }, d("carousel", t2, F), t2;
        }
        _handleSwipe() {
          const t2 = Math.abs(this.touchDeltaX);
          if (t2 <= 40) return;
          const e2 = t2 / this.touchDeltaX;
          this.touchDeltaX = 0, e2 && this._slide(e2 > 0 ? Y : X);
        }
        _addEventListeners() {
          this._config.keyboard && H.on(this._element, "keydown.bs.carousel", (t2) => this._keydown(t2)), "hover" === this._config.pause && (H.on(this._element, "mouseenter.bs.carousel", (t2) => this.pause(t2)), H.on(this._element, "mouseleave.bs.carousel", (t2) => this.cycle(t2))), this._config.touch && this._touchSupported && this._addTouchEventListeners();
        }
        _addTouchEventListeners() {
          const e2 = (t2) => {
            !this._pointerEvent || "pen" !== t2.pointerType && "touch" !== t2.pointerType ? this._pointerEvent || (this.touchStartX = t2.touches[0].clientX) : this.touchStartX = t2.clientX;
          }, i2 = (t2) => {
            this.touchDeltaX = t2.touches && t2.touches.length > 1 ? 0 : t2.touches[0].clientX - this.touchStartX;
          }, n2 = (t2) => {
            !this._pointerEvent || "pen" !== t2.pointerType && "touch" !== t2.pointerType || (this.touchDeltaX = t2.clientX - this.touchStartX), this._handleSwipe(), "hover" === this._config.pause && (this.pause(), this.touchTimeout && clearTimeout(this.touchTimeout), this.touchTimeout = setTimeout((t3) => this.cycle(t3), 500 + this._config.interval));
          };
          t.find(".carousel-item img", this._element).forEach((t2) => {
            H.on(t2, "dragstart.bs.carousel", (t3) => t3.preventDefault());
          }), this._pointerEvent ? (H.on(this._element, "pointerdown.bs.carousel", (t2) => e2(t2)), H.on(this._element, "pointerup.bs.carousel", (t2) => n2(t2)), this._element.classList.add("pointer-event")) : (H.on(this._element, "touchstart.bs.carousel", (t2) => e2(t2)), H.on(this._element, "touchmove.bs.carousel", (t2) => i2(t2)), H.on(this._element, "touchend.bs.carousel", (t2) => n2(t2)));
        }
        _keydown(t2) {
          /input|textarea/i.test(t2.target.tagName) || ("ArrowLeft" === t2.key ? (t2.preventDefault(), this._slide(Y)) : "ArrowRight" === t2.key && (t2.preventDefault(), this._slide(X)));
        }
        _getItemIndex(e2) {
          return this._items = e2 && e2.parentNode ? t.find(".carousel-item", e2.parentNode) : [], this._items.indexOf(e2);
        }
        _getItemByOrder(t2, e2) {
          const i2 = t2 === V, n2 = t2 === K, s2 = this._getItemIndex(e2), o2 = this._items.length - 1;
          if ((n2 && 0 === s2 || i2 && s2 === o2) && !this._config.wrap) return e2;
          const r2 = (s2 + (n2 ? -1 : 1)) % this._items.length;
          return -1 === r2 ? this._items[this._items.length - 1] : this._items[r2];
        }
        _triggerSlideEvent(e2, i2) {
          const n2 = this._getItemIndex(e2), s2 = this._getItemIndex(t.findOne(".active.carousel-item", this._element));
          return H.trigger(this._element, "slide.bs.carousel", { relatedTarget: e2, direction: i2, from: s2, to: n2 });
        }
        _setActiveIndicatorElement(e2) {
          if (this._indicatorsElement) {
            const i2 = t.findOne(".active", this._indicatorsElement);
            i2.classList.remove("active"), i2.removeAttribute("aria-current");
            const n2 = t.find("[data-bs-target]", this._indicatorsElement);
            for (let t2 = 0; t2 < n2.length; t2++) if (Number.parseInt(n2[t2].getAttribute("data-bs-slide-to"), 10) === this._getItemIndex(e2)) {
              n2[t2].classList.add("active"), n2[t2].setAttribute("aria-current", "true");
              break;
            }
          }
        }
        _updateInterval() {
          const e2 = this._activeElement || t.findOne(".active.carousel-item", this._element);
          if (!e2) return;
          const i2 = Number.parseInt(e2.getAttribute("data-bs-interval"), 10);
          i2 ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, this._config.interval = i2) : this._config.interval = this._config.defaultInterval || this._config.interval;
        }
        _slide(e2, i2) {
          const n2 = this._directionToOrder(e2), s2 = t.findOne(".active.carousel-item", this._element), o2 = this._getItemIndex(s2), r2 = i2 || this._getItemByOrder(n2, s2), a2 = this._getItemIndex(r2), l2 = Boolean(this._interval), c2 = n2 === V, d2 = c2 ? "carousel-item-start" : "carousel-item-end", h2 = c2 ? "carousel-item-next" : "carousel-item-prev", u2 = this._orderToDirection(n2);
          if (r2 && r2.classList.contains("active")) return void (this._isSliding = false);
          if (this._triggerSlideEvent(r2, u2).defaultPrevented) return;
          if (!s2 || !r2) return;
          this._isSliding = true, l2 && this.pause(), this._setActiveIndicatorElement(r2), this._activeElement = r2;
          const f2 = () => {
            H.trigger(this._element, "slid.bs.carousel", { relatedTarget: r2, direction: u2, from: o2, to: a2 });
          };
          if (this._element.classList.contains("slide")) {
            r2.classList.add(h2), m(r2), s2.classList.add(d2), r2.classList.add(d2);
            const t2 = () => {
              r2.classList.remove(d2, h2), r2.classList.add("active"), s2.classList.remove("active", h2, d2), this._isSliding = false, setTimeout(f2, 0);
            };
            this._queueCallback(t2, s2, true);
          } else s2.classList.remove("active"), r2.classList.add("active"), this._isSliding = false, f2();
          l2 && this.cycle();
        }
        _directionToOrder(t2) {
          return [Y, X].includes(t2) ? _() ? t2 === X ? K : V : t2 === X ? V : K : t2;
        }
        _orderToDirection(t2) {
          return [V, K].includes(t2) ? _() ? t2 === K ? X : Y : t2 === K ? Y : X : t2;
        }
        static carouselInterface(t2, e2) {
          let i2 = w.get(t2, "bs.carousel"), n2 = { ...$, ...U.getDataAttributes(t2) };
          "object" == typeof e2 && (n2 = { ...n2, ...e2 });
          const s2 = "string" == typeof e2 ? e2 : n2.slide;
          if (i2 || (i2 = new Q(t2, n2)), "number" == typeof e2) i2.to(e2);
          else if ("string" == typeof s2) {
            if (void 0 === i2[s2]) throw new TypeError(`No method named "${s2}"`);
            i2[s2]();
          } else n2.interval && n2.ride && (i2.pause(), i2.cycle());
        }
        static jQueryInterface(t2) {
          return this.each(function() {
            Q.carouselInterface(this, t2);
          });
        }
        static dataApiClickHandler(t2) {
          const e2 = s(this);
          if (!e2 || !e2.classList.contains("carousel")) return;
          const i2 = { ...U.getDataAttributes(e2), ...U.getDataAttributes(this) }, n2 = this.getAttribute("data-bs-slide-to");
          n2 && (i2.interval = false), Q.carouselInterface(e2, i2), n2 && w.get(e2, "bs.carousel").to(n2), t2.preventDefault();
        }
      }
      H.on(document, "click.bs.carousel.data-api", "[data-bs-slide], [data-bs-slide-to]", Q.dataApiClickHandler), H.on(window, "load.bs.carousel.data-api", () => {
        const e2 = t.find('[data-bs-ride="carousel"]');
        for (let t2 = 0, i2 = e2.length; t2 < i2; t2++) Q.carouselInterface(e2[t2], w.get(e2[t2], "bs.carousel"));
      }), b(Q);
      const G = { toggle: true, parent: "" }, Z = { toggle: "boolean", parent: "(string|element)" };
      class J extends R {
        constructor(e2, i2) {
          super(e2), this._isTransitioning = false, this._config = this._getConfig(i2), this._triggerArray = t.find(`[data-bs-toggle="collapse"][href="#${this._element.id}"],[data-bs-toggle="collapse"][data-bs-target="#${this._element.id}"]`);
          const s2 = t.find('[data-bs-toggle="collapse"]');
          for (let e3 = 0, i3 = s2.length; e3 < i3; e3++) {
            const i4 = s2[e3], o2 = n(i4), r2 = t.find(o2).filter((t2) => t2 === this._element);
            null !== o2 && r2.length && (this._selector = o2, this._triggerArray.push(i4));
          }
          this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), this._config.toggle && this.toggle();
        }
        static get Default() {
          return G;
        }
        static get NAME() {
          return "collapse";
        }
        toggle() {
          this._element.classList.contains("show") ? this.hide() : this.show();
        }
        show() {
          if (this._isTransitioning || this._element.classList.contains("show")) return;
          let e2, i2;
          this._parent && (e2 = t.find(".show, .collapsing", this._parent).filter((t2) => "string" == typeof this._config.parent ? t2.getAttribute("data-bs-parent") === this._config.parent : t2.classList.contains("collapse")), 0 === e2.length && (e2 = null));
          const n2 = t.findOne(this._selector);
          if (e2) {
            const t2 = e2.find((t3) => n2 !== t3);
            if (i2 = t2 ? w.get(t2, "bs.collapse") : null, i2 && i2._isTransitioning) return;
          }
          if (H.trigger(this._element, "show.bs.collapse").defaultPrevented) return;
          e2 && e2.forEach((t2) => {
            n2 !== t2 && J.collapseInterface(t2, "hide"), i2 || w.set(t2, "bs.collapse", null);
          });
          const s2 = this._getDimension();
          this._element.classList.remove("collapse"), this._element.classList.add("collapsing"), this._element.style[s2] = 0, this._triggerArray.length && this._triggerArray.forEach((t2) => {
            t2.classList.remove("collapsed"), t2.setAttribute("aria-expanded", true);
          }), this.setTransitioning(true);
          const o2 = "scroll" + (s2[0].toUpperCase() + s2.slice(1));
          this._queueCallback(() => {
            this._element.classList.remove("collapsing"), this._element.classList.add("collapse", "show"), this._element.style[s2] = "", this.setTransitioning(false), H.trigger(this._element, "shown.bs.collapse");
          }, this._element, true), this._element.style[s2] = this._element[o2] + "px";
        }
        hide() {
          if (this._isTransitioning || !this._element.classList.contains("show")) return;
          if (H.trigger(this._element, "hide.bs.collapse").defaultPrevented) return;
          const t2 = this._getDimension();
          this._element.style[t2] = this._element.getBoundingClientRect()[t2] + "px", m(this._element), this._element.classList.add("collapsing"), this._element.classList.remove("collapse", "show");
          const e2 = this._triggerArray.length;
          if (e2 > 0) for (let t3 = 0; t3 < e2; t3++) {
            const e3 = this._triggerArray[t3], i2 = s(e3);
            i2 && !i2.classList.contains("show") && (e3.classList.add("collapsed"), e3.setAttribute("aria-expanded", false));
          }
          this.setTransitioning(true), this._element.style[t2] = "", this._queueCallback(() => {
            this.setTransitioning(false), this._element.classList.remove("collapsing"), this._element.classList.add("collapse"), H.trigger(this._element, "hidden.bs.collapse");
          }, this._element, true);
        }
        setTransitioning(t2) {
          this._isTransitioning = t2;
        }
        _getConfig(t2) {
          return (t2 = { ...G, ...t2 }).toggle = Boolean(t2.toggle), d("collapse", t2, Z), t2;
        }
        _getDimension() {
          return this._element.classList.contains("width") ? "width" : "height";
        }
        _getParent() {
          let { parent: e2 } = this._config;
          e2 = l(e2);
          const i2 = `[data-bs-toggle="collapse"][data-bs-parent="${e2}"]`;
          return t.find(i2, e2).forEach((t2) => {
            const e3 = s(t2);
            this._addAriaAndCollapsedClass(e3, [t2]);
          }), e2;
        }
        _addAriaAndCollapsedClass(t2, e2) {
          if (!t2 || !e2.length) return;
          const i2 = t2.classList.contains("show");
          e2.forEach((t3) => {
            i2 ? t3.classList.remove("collapsed") : t3.classList.add("collapsed"), t3.setAttribute("aria-expanded", i2);
          });
        }
        static collapseInterface(t2, e2) {
          let i2 = w.get(t2, "bs.collapse");
          const n2 = { ...G, ...U.getDataAttributes(t2), ..."object" == typeof e2 && e2 ? e2 : {} };
          if (!i2 && n2.toggle && "string" == typeof e2 && /show|hide/.test(e2) && (n2.toggle = false), i2 || (i2 = new J(t2, n2)), "string" == typeof e2) {
            if (void 0 === i2[e2]) throw new TypeError(`No method named "${e2}"`);
            i2[e2]();
          }
        }
        static jQueryInterface(t2) {
          return this.each(function() {
            J.collapseInterface(this, t2);
          });
        }
      }
      H.on(document, "click.bs.collapse.data-api", '[data-bs-toggle="collapse"]', function(e2) {
        ("A" === e2.target.tagName || e2.delegateTarget && "A" === e2.delegateTarget.tagName) && e2.preventDefault();
        const i2 = U.getDataAttributes(this), s2 = n(this);
        t.find(s2).forEach((t2) => {
          const e3 = w.get(t2, "bs.collapse");
          let n2;
          e3 ? (null === e3._parent && "string" == typeof i2.parent && (e3._config.parent = i2.parent, e3._parent = e3._getParent()), n2 = "toggle") : n2 = i2, J.collapseInterface(t2, n2);
        });
      }), b(J);
      var tt = "top", et = "bottom", it = "right", nt = "left", st = [tt, et, it, nt], ot = st.reduce(function(t2, e2) {
        return t2.concat([e2 + "-start", e2 + "-end"]);
      }, []), rt = [].concat(st, ["auto"]).reduce(function(t2, e2) {
        return t2.concat([e2, e2 + "-start", e2 + "-end"]);
      }, []), at = ["beforeRead", "read", "afterRead", "beforeMain", "main", "afterMain", "beforeWrite", "write", "afterWrite"];
      function lt(t2) {
        return t2 ? (t2.nodeName || "").toLowerCase() : null;
      }
      function ct(t2) {
        if (null == t2) return window;
        if ("[object Window]" !== t2.toString()) {
          var e2 = t2.ownerDocument;
          return e2 && e2.defaultView || window;
        }
        return t2;
      }
      function dt(t2) {
        return t2 instanceof ct(t2).Element || t2 instanceof Element;
      }
      function ht(t2) {
        return t2 instanceof ct(t2).HTMLElement || t2 instanceof HTMLElement;
      }
      function ut(t2) {
        return "undefined" != typeof ShadowRoot && (t2 instanceof ct(t2).ShadowRoot || t2 instanceof ShadowRoot);
      }
      var ft = { name: "applyStyles", enabled: true, phase: "write", fn: function(t2) {
        var e2 = t2.state;
        Object.keys(e2.elements).forEach(function(t3) {
          var i2 = e2.styles[t3] || {}, n2 = e2.attributes[t3] || {}, s2 = e2.elements[t3];
          ht(s2) && lt(s2) && (Object.assign(s2.style, i2), Object.keys(n2).forEach(function(t4) {
            var e3 = n2[t4];
            false === e3 ? s2.removeAttribute(t4) : s2.setAttribute(t4, true === e3 ? "" : e3);
          }));
        });
      }, effect: function(t2) {
        var e2 = t2.state, i2 = { popper: { position: e2.options.strategy, left: "0", top: "0", margin: "0" }, arrow: { position: "absolute" }, reference: {} };
        return Object.assign(e2.elements.popper.style, i2.popper), e2.styles = i2, e2.elements.arrow && Object.assign(e2.elements.arrow.style, i2.arrow), function() {
          Object.keys(e2.elements).forEach(function(t3) {
            var n2 = e2.elements[t3], s2 = e2.attributes[t3] || {}, o2 = Object.keys(e2.styles.hasOwnProperty(t3) ? e2.styles[t3] : i2[t3]).reduce(function(t4, e3) {
              return t4[e3] = "", t4;
            }, {});
            ht(n2) && lt(n2) && (Object.assign(n2.style, o2), Object.keys(s2).forEach(function(t4) {
              n2.removeAttribute(t4);
            }));
          });
        };
      }, requires: ["computeStyles"] };
      function pt(t2) {
        return t2.split("-")[0];
      }
      function mt(t2) {
        var e2 = t2.getBoundingClientRect();
        return { width: e2.width, height: e2.height, top: e2.top, right: e2.right, bottom: e2.bottom, left: e2.left, x: e2.left, y: e2.top };
      }
      function gt(t2) {
        var e2 = mt(t2), i2 = t2.offsetWidth, n2 = t2.offsetHeight;
        return Math.abs(e2.width - i2) <= 1 && (i2 = e2.width), Math.abs(e2.height - n2) <= 1 && (n2 = e2.height), { x: t2.offsetLeft, y: t2.offsetTop, width: i2, height: n2 };
      }
      function _t(t2, e2) {
        var i2 = e2.getRootNode && e2.getRootNode();
        if (t2.contains(e2)) return true;
        if (i2 && ut(i2)) {
          var n2 = e2;
          do {
            if (n2 && t2.isSameNode(n2)) return true;
            n2 = n2.parentNode || n2.host;
          } while (n2);
        }
        return false;
      }
      function bt(t2) {
        return ct(t2).getComputedStyle(t2);
      }
      function vt(t2) {
        return ["table", "td", "th"].indexOf(lt(t2)) >= 0;
      }
      function yt(t2) {
        return ((dt(t2) ? t2.ownerDocument : t2.document) || window.document).documentElement;
      }
      function wt(t2) {
        return "html" === lt(t2) ? t2 : t2.assignedSlot || t2.parentNode || (ut(t2) ? t2.host : null) || yt(t2);
      }
      function Et(t2) {
        return ht(t2) && "fixed" !== bt(t2).position ? t2.offsetParent : null;
      }
      function Tt(t2) {
        for (var e2 = ct(t2), i2 = Et(t2); i2 && vt(i2) && "static" === bt(i2).position; ) i2 = Et(i2);
        return i2 && ("html" === lt(i2) || "body" === lt(i2) && "static" === bt(i2).position) ? e2 : i2 || function(t3) {
          var e3 = -1 !== navigator.userAgent.toLowerCase().indexOf("firefox");
          if (-1 !== navigator.userAgent.indexOf("Trident") && ht(t3) && "fixed" === bt(t3).position) return null;
          for (var i3 = wt(t3); ht(i3) && ["html", "body"].indexOf(lt(i3)) < 0; ) {
            var n2 = bt(i3);
            if ("none" !== n2.transform || "none" !== n2.perspective || "paint" === n2.contain || -1 !== ["transform", "perspective"].indexOf(n2.willChange) || e3 && "filter" === n2.willChange || e3 && n2.filter && "none" !== n2.filter) return i3;
            i3 = i3.parentNode;
          }
          return null;
        }(t2) || e2;
      }
      function At(t2) {
        return ["top", "bottom"].indexOf(t2) >= 0 ? "x" : "y";
      }
      var Lt = Math.max, Ot = Math.min, kt = Math.round;
      function Ct(t2, e2, i2) {
        return Lt(t2, Ot(e2, i2));
      }
      function xt(t2) {
        return Object.assign({}, { top: 0, right: 0, bottom: 0, left: 0 }, t2);
      }
      function Dt(t2, e2) {
        return e2.reduce(function(e3, i2) {
          return e3[i2] = t2, e3;
        }, {});
      }
      var Nt = { name: "arrow", enabled: true, phase: "main", fn: function(t2) {
        var e2, i2 = t2.state, n2 = t2.name, s2 = t2.options, o2 = i2.elements.arrow, r2 = i2.modifiersData.popperOffsets, a2 = pt(i2.placement), l2 = At(a2), c2 = [nt, it].indexOf(a2) >= 0 ? "height" : "width";
        if (o2 && r2) {
          var d2 = function(t3, e3) {
            return xt("number" != typeof (t3 = "function" == typeof t3 ? t3(Object.assign({}, e3.rects, { placement: e3.placement })) : t3) ? t3 : Dt(t3, st));
          }(s2.padding, i2), h2 = gt(o2), u2 = "y" === l2 ? tt : nt, f2 = "y" === l2 ? et : it, p2 = i2.rects.reference[c2] + i2.rects.reference[l2] - r2[l2] - i2.rects.popper[c2], m2 = r2[l2] - i2.rects.reference[l2], g2 = Tt(o2), _2 = g2 ? "y" === l2 ? g2.clientHeight || 0 : g2.clientWidth || 0 : 0, b2 = p2 / 2 - m2 / 2, v2 = d2[u2], y2 = _2 - h2[c2] - d2[f2], w2 = _2 / 2 - h2[c2] / 2 + b2, E2 = Ct(v2, w2, y2), T2 = l2;
          i2.modifiersData[n2] = ((e2 = {})[T2] = E2, e2.centerOffset = E2 - w2, e2);
        }
      }, effect: function(t2) {
        var e2 = t2.state, i2 = t2.options.element, n2 = void 0 === i2 ? "[data-popper-arrow]" : i2;
        null != n2 && ("string" != typeof n2 || (n2 = e2.elements.popper.querySelector(n2))) && _t(e2.elements.popper, n2) && (e2.elements.arrow = n2);
      }, requires: ["popperOffsets"], requiresIfExists: ["preventOverflow"] }, St = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
      function It(t2) {
        var e2, i2 = t2.popper, n2 = t2.popperRect, s2 = t2.placement, o2 = t2.offsets, r2 = t2.position, a2 = t2.gpuAcceleration, l2 = t2.adaptive, c2 = t2.roundOffsets, d2 = true === c2 ? function(t3) {
          var e3 = t3.x, i3 = t3.y, n3 = window.devicePixelRatio || 1;
          return { x: kt(kt(e3 * n3) / n3) || 0, y: kt(kt(i3 * n3) / n3) || 0 };
        }(o2) : "function" == typeof c2 ? c2(o2) : o2, h2 = d2.x, u2 = void 0 === h2 ? 0 : h2, f2 = d2.y, p2 = void 0 === f2 ? 0 : f2, m2 = o2.hasOwnProperty("x"), g2 = o2.hasOwnProperty("y"), _2 = nt, b2 = tt, v2 = window;
        if (l2) {
          var y2 = Tt(i2), w2 = "clientHeight", E2 = "clientWidth";
          y2 === ct(i2) && "static" !== bt(y2 = yt(i2)).position && (w2 = "scrollHeight", E2 = "scrollWidth"), y2 = y2, s2 === tt && (b2 = et, p2 -= y2[w2] - n2.height, p2 *= a2 ? 1 : -1), s2 === nt && (_2 = it, u2 -= y2[E2] - n2.width, u2 *= a2 ? 1 : -1);
        }
        var T2, A2 = Object.assign({ position: r2 }, l2 && St);
        return a2 ? Object.assign({}, A2, ((T2 = {})[b2] = g2 ? "0" : "", T2[_2] = m2 ? "0" : "", T2.transform = (v2.devicePixelRatio || 1) < 2 ? "translate(" + u2 + "px, " + p2 + "px)" : "translate3d(" + u2 + "px, " + p2 + "px, 0)", T2)) : Object.assign({}, A2, ((e2 = {})[b2] = g2 ? p2 + "px" : "", e2[_2] = m2 ? u2 + "px" : "", e2.transform = "", e2));
      }
      var jt = { name: "computeStyles", enabled: true, phase: "beforeWrite", fn: function(t2) {
        var e2 = t2.state, i2 = t2.options, n2 = i2.gpuAcceleration, s2 = void 0 === n2 || n2, o2 = i2.adaptive, r2 = void 0 === o2 || o2, a2 = i2.roundOffsets, l2 = void 0 === a2 || a2, c2 = { placement: pt(e2.placement), popper: e2.elements.popper, popperRect: e2.rects.popper, gpuAcceleration: s2 };
        null != e2.modifiersData.popperOffsets && (e2.styles.popper = Object.assign({}, e2.styles.popper, It(Object.assign({}, c2, { offsets: e2.modifiersData.popperOffsets, position: e2.options.strategy, adaptive: r2, roundOffsets: l2 })))), null != e2.modifiersData.arrow && (e2.styles.arrow = Object.assign({}, e2.styles.arrow, It(Object.assign({}, c2, { offsets: e2.modifiersData.arrow, position: "absolute", adaptive: false, roundOffsets: l2 })))), e2.attributes.popper = Object.assign({}, e2.attributes.popper, { "data-popper-placement": e2.placement });
      }, data: {} }, Pt = { passive: true }, Mt = { name: "eventListeners", enabled: true, phase: "write", fn: function() {
      }, effect: function(t2) {
        var e2 = t2.state, i2 = t2.instance, n2 = t2.options, s2 = n2.scroll, o2 = void 0 === s2 || s2, r2 = n2.resize, a2 = void 0 === r2 || r2, l2 = ct(e2.elements.popper), c2 = [].concat(e2.scrollParents.reference, e2.scrollParents.popper);
        return o2 && c2.forEach(function(t3) {
          t3.addEventListener("scroll", i2.update, Pt);
        }), a2 && l2.addEventListener("resize", i2.update, Pt), function() {
          o2 && c2.forEach(function(t3) {
            t3.removeEventListener("scroll", i2.update, Pt);
          }), a2 && l2.removeEventListener("resize", i2.update, Pt);
        };
      }, data: {} }, Ht = { left: "right", right: "left", bottom: "top", top: "bottom" };
      function Rt(t2) {
        return t2.replace(/left|right|bottom|top/g, function(t3) {
          return Ht[t3];
        });
      }
      var Bt = { start: "end", end: "start" };
      function Wt(t2) {
        return t2.replace(/start|end/g, function(t3) {
          return Bt[t3];
        });
      }
      function qt(t2) {
        var e2 = ct(t2);
        return { scrollLeft: e2.pageXOffset, scrollTop: e2.pageYOffset };
      }
      function zt(t2) {
        return mt(yt(t2)).left + qt(t2).scrollLeft;
      }
      function Ut(t2) {
        var e2 = bt(t2), i2 = e2.overflow, n2 = e2.overflowX, s2 = e2.overflowY;
        return /auto|scroll|overlay|hidden/.test(i2 + s2 + n2);
      }
      function $t(t2, e2) {
        var i2;
        void 0 === e2 && (e2 = []);
        var n2 = function t3(e3) {
          return ["html", "body", "#document"].indexOf(lt(e3)) >= 0 ? e3.ownerDocument.body : ht(e3) && Ut(e3) ? e3 : t3(wt(e3));
        }(t2), s2 = n2 === (null == (i2 = t2.ownerDocument) ? void 0 : i2.body), o2 = ct(n2), r2 = s2 ? [o2].concat(o2.visualViewport || [], Ut(n2) ? n2 : []) : n2, a2 = e2.concat(r2);
        return s2 ? a2 : a2.concat($t(wt(r2)));
      }
      function Ft(t2) {
        return Object.assign({}, t2, { left: t2.x, top: t2.y, right: t2.x + t2.width, bottom: t2.y + t2.height });
      }
      function Vt(t2, e2) {
        return "viewport" === e2 ? Ft(function(t3) {
          var e3 = ct(t3), i2 = yt(t3), n2 = e3.visualViewport, s2 = i2.clientWidth, o2 = i2.clientHeight, r2 = 0, a2 = 0;
          return n2 && (s2 = n2.width, o2 = n2.height, /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (r2 = n2.offsetLeft, a2 = n2.offsetTop)), { width: s2, height: o2, x: r2 + zt(t3), y: a2 };
        }(t2)) : ht(e2) ? function(t3) {
          var e3 = mt(t3);
          return e3.top = e3.top + t3.clientTop, e3.left = e3.left + t3.clientLeft, e3.bottom = e3.top + t3.clientHeight, e3.right = e3.left + t3.clientWidth, e3.width = t3.clientWidth, e3.height = t3.clientHeight, e3.x = e3.left, e3.y = e3.top, e3;
        }(e2) : Ft(function(t3) {
          var e3, i2 = yt(t3), n2 = qt(t3), s2 = null == (e3 = t3.ownerDocument) ? void 0 : e3.body, o2 = Lt(i2.scrollWidth, i2.clientWidth, s2 ? s2.scrollWidth : 0, s2 ? s2.clientWidth : 0), r2 = Lt(i2.scrollHeight, i2.clientHeight, s2 ? s2.scrollHeight : 0, s2 ? s2.clientHeight : 0), a2 = -n2.scrollLeft + zt(t3), l2 = -n2.scrollTop;
          return "rtl" === bt(s2 || i2).direction && (a2 += Lt(i2.clientWidth, s2 ? s2.clientWidth : 0) - o2), { width: o2, height: r2, x: a2, y: l2 };
        }(yt(t2)));
      }
      function Kt(t2) {
        return t2.split("-")[1];
      }
      function Xt(t2) {
        var e2, i2 = t2.reference, n2 = t2.element, s2 = t2.placement, o2 = s2 ? pt(s2) : null, r2 = s2 ? Kt(s2) : null, a2 = i2.x + i2.width / 2 - n2.width / 2, l2 = i2.y + i2.height / 2 - n2.height / 2;
        switch (o2) {
          case tt:
            e2 = { x: a2, y: i2.y - n2.height };
            break;
          case et:
            e2 = { x: a2, y: i2.y + i2.height };
            break;
          case it:
            e2 = { x: i2.x + i2.width, y: l2 };
            break;
          case nt:
            e2 = { x: i2.x - n2.width, y: l2 };
            break;
          default:
            e2 = { x: i2.x, y: i2.y };
        }
        var c2 = o2 ? At(o2) : null;
        if (null != c2) {
          var d2 = "y" === c2 ? "height" : "width";
          switch (r2) {
            case "start":
              e2[c2] = e2[c2] - (i2[d2] / 2 - n2[d2] / 2);
              break;
            case "end":
              e2[c2] = e2[c2] + (i2[d2] / 2 - n2[d2] / 2);
          }
        }
        return e2;
      }
      function Yt(t2, e2) {
        void 0 === e2 && (e2 = {});
        var i2 = e2, n2 = i2.placement, s2 = void 0 === n2 ? t2.placement : n2, o2 = i2.boundary, r2 = void 0 === o2 ? "clippingParents" : o2, a2 = i2.rootBoundary, l2 = void 0 === a2 ? "viewport" : a2, c2 = i2.elementContext, d2 = void 0 === c2 ? "popper" : c2, h2 = i2.altBoundary, u2 = void 0 !== h2 && h2, f2 = i2.padding, p2 = void 0 === f2 ? 0 : f2, m2 = xt("number" != typeof p2 ? p2 : Dt(p2, st)), g2 = "popper" === d2 ? "reference" : "popper", _2 = t2.elements.reference, b2 = t2.rects.popper, v2 = t2.elements[u2 ? g2 : d2], y2 = function(t3, e3, i3) {
          var n3 = "clippingParents" === e3 ? function(t4) {
            var e4 = $t(wt(t4)), i4 = ["absolute", "fixed"].indexOf(bt(t4).position) >= 0 && ht(t4) ? Tt(t4) : t4;
            return dt(i4) ? e4.filter(function(t5) {
              return dt(t5) && _t(t5, i4) && "body" !== lt(t5);
            }) : [];
          }(t3) : [].concat(e3), s3 = [].concat(n3, [i3]), o3 = s3[0], r3 = s3.reduce(function(e4, i4) {
            var n4 = Vt(t3, i4);
            return e4.top = Lt(n4.top, e4.top), e4.right = Ot(n4.right, e4.right), e4.bottom = Ot(n4.bottom, e4.bottom), e4.left = Lt(n4.left, e4.left), e4;
          }, Vt(t3, o3));
          return r3.width = r3.right - r3.left, r3.height = r3.bottom - r3.top, r3.x = r3.left, r3.y = r3.top, r3;
        }(dt(v2) ? v2 : v2.contextElement || yt(t2.elements.popper), r2, l2), w2 = mt(_2), E2 = Xt({ reference: w2, element: b2, strategy: "absolute", placement: s2 }), T2 = Ft(Object.assign({}, b2, E2)), A2 = "popper" === d2 ? T2 : w2, L2 = { top: y2.top - A2.top + m2.top, bottom: A2.bottom - y2.bottom + m2.bottom, left: y2.left - A2.left + m2.left, right: A2.right - y2.right + m2.right }, O2 = t2.modifiersData.offset;
        if ("popper" === d2 && O2) {
          var k2 = O2[s2];
          Object.keys(L2).forEach(function(t3) {
            var e3 = [it, et].indexOf(t3) >= 0 ? 1 : -1, i3 = [tt, et].indexOf(t3) >= 0 ? "y" : "x";
            L2[t3] += k2[i3] * e3;
          });
        }
        return L2;
      }
      function Qt(t2, e2) {
        void 0 === e2 && (e2 = {});
        var i2 = e2, n2 = i2.placement, s2 = i2.boundary, o2 = i2.rootBoundary, r2 = i2.padding, a2 = i2.flipVariations, l2 = i2.allowedAutoPlacements, c2 = void 0 === l2 ? rt : l2, d2 = Kt(n2), h2 = d2 ? a2 ? ot : ot.filter(function(t3) {
          return Kt(t3) === d2;
        }) : st, u2 = h2.filter(function(t3) {
          return c2.indexOf(t3) >= 0;
        });
        0 === u2.length && (u2 = h2);
        var f2 = u2.reduce(function(e3, i3) {
          return e3[i3] = Yt(t2, { placement: i3, boundary: s2, rootBoundary: o2, padding: r2 })[pt(i3)], e3;
        }, {});
        return Object.keys(f2).sort(function(t3, e3) {
          return f2[t3] - f2[e3];
        });
      }
      var Gt = { name: "flip", enabled: true, phase: "main", fn: function(t2) {
        var e2 = t2.state, i2 = t2.options, n2 = t2.name;
        if (!e2.modifiersData[n2]._skip) {
          for (var s2 = i2.mainAxis, o2 = void 0 === s2 || s2, r2 = i2.altAxis, a2 = void 0 === r2 || r2, l2 = i2.fallbackPlacements, c2 = i2.padding, d2 = i2.boundary, h2 = i2.rootBoundary, u2 = i2.altBoundary, f2 = i2.flipVariations, p2 = void 0 === f2 || f2, m2 = i2.allowedAutoPlacements, g2 = e2.options.placement, _2 = pt(g2), b2 = l2 || (_2 !== g2 && p2 ? function(t3) {
            if ("auto" === pt(t3)) return [];
            var e3 = Rt(t3);
            return [Wt(t3), e3, Wt(e3)];
          }(g2) : [Rt(g2)]), v2 = [g2].concat(b2).reduce(function(t3, i3) {
            return t3.concat("auto" === pt(i3) ? Qt(e2, { placement: i3, boundary: d2, rootBoundary: h2, padding: c2, flipVariations: p2, allowedAutoPlacements: m2 }) : i3);
          }, []), y2 = e2.rects.reference, w2 = e2.rects.popper, E2 = /* @__PURE__ */ new Map(), T2 = true, A2 = v2[0], L2 = 0; L2 < v2.length; L2++) {
            var O2 = v2[L2], k2 = pt(O2), C2 = "start" === Kt(O2), x2 = [tt, et].indexOf(k2) >= 0, D2 = x2 ? "width" : "height", N2 = Yt(e2, { placement: O2, boundary: d2, rootBoundary: h2, altBoundary: u2, padding: c2 }), S2 = x2 ? C2 ? it : nt : C2 ? et : tt;
            y2[D2] > w2[D2] && (S2 = Rt(S2));
            var I2 = Rt(S2), j2 = [];
            if (o2 && j2.push(N2[k2] <= 0), a2 && j2.push(N2[S2] <= 0, N2[I2] <= 0), j2.every(function(t3) {
              return t3;
            })) {
              A2 = O2, T2 = false;
              break;
            }
            E2.set(O2, j2);
          }
          if (T2) for (var P2 = function(t3) {
            var e3 = v2.find(function(e4) {
              var i3 = E2.get(e4);
              if (i3) return i3.slice(0, t3).every(function(t4) {
                return t4;
              });
            });
            if (e3) return A2 = e3, "break";
          }, M2 = p2 ? 3 : 1; M2 > 0 && "break" !== P2(M2); M2--) ;
          e2.placement !== A2 && (e2.modifiersData[n2]._skip = true, e2.placement = A2, e2.reset = true);
        }
      }, requiresIfExists: ["offset"], data: { _skip: false } };
      function Zt(t2, e2, i2) {
        return void 0 === i2 && (i2 = { x: 0, y: 0 }), { top: t2.top - e2.height - i2.y, right: t2.right - e2.width + i2.x, bottom: t2.bottom - e2.height + i2.y, left: t2.left - e2.width - i2.x };
      }
      function Jt(t2) {
        return [tt, it, et, nt].some(function(e2) {
          return t2[e2] >= 0;
        });
      }
      var te = { name: "hide", enabled: true, phase: "main", requiresIfExists: ["preventOverflow"], fn: function(t2) {
        var e2 = t2.state, i2 = t2.name, n2 = e2.rects.reference, s2 = e2.rects.popper, o2 = e2.modifiersData.preventOverflow, r2 = Yt(e2, { elementContext: "reference" }), a2 = Yt(e2, { altBoundary: true }), l2 = Zt(r2, n2), c2 = Zt(a2, s2, o2), d2 = Jt(l2), h2 = Jt(c2);
        e2.modifiersData[i2] = { referenceClippingOffsets: l2, popperEscapeOffsets: c2, isReferenceHidden: d2, hasPopperEscaped: h2 }, e2.attributes.popper = Object.assign({}, e2.attributes.popper, { "data-popper-reference-hidden": d2, "data-popper-escaped": h2 });
      } }, ee = { name: "offset", enabled: true, phase: "main", requires: ["popperOffsets"], fn: function(t2) {
        var e2 = t2.state, i2 = t2.options, n2 = t2.name, s2 = i2.offset, o2 = void 0 === s2 ? [0, 0] : s2, r2 = rt.reduce(function(t3, i3) {
          return t3[i3] = function(t4, e3, i4) {
            var n3 = pt(t4), s3 = [nt, tt].indexOf(n3) >= 0 ? -1 : 1, o3 = "function" == typeof i4 ? i4(Object.assign({}, e3, { placement: t4 })) : i4, r3 = o3[0], a3 = o3[1];
            return r3 = r3 || 0, a3 = (a3 || 0) * s3, [nt, it].indexOf(n3) >= 0 ? { x: a3, y: r3 } : { x: r3, y: a3 };
          }(i3, e2.rects, o2), t3;
        }, {}), a2 = r2[e2.placement], l2 = a2.x, c2 = a2.y;
        null != e2.modifiersData.popperOffsets && (e2.modifiersData.popperOffsets.x += l2, e2.modifiersData.popperOffsets.y += c2), e2.modifiersData[n2] = r2;
      } }, ie = { name: "popperOffsets", enabled: true, phase: "read", fn: function(t2) {
        var e2 = t2.state, i2 = t2.name;
        e2.modifiersData[i2] = Xt({ reference: e2.rects.reference, element: e2.rects.popper, strategy: "absolute", placement: e2.placement });
      }, data: {} }, ne = { name: "preventOverflow", enabled: true, phase: "main", fn: function(t2) {
        var e2 = t2.state, i2 = t2.options, n2 = t2.name, s2 = i2.mainAxis, o2 = void 0 === s2 || s2, r2 = i2.altAxis, a2 = void 0 !== r2 && r2, l2 = i2.boundary, c2 = i2.rootBoundary, d2 = i2.altBoundary, h2 = i2.padding, u2 = i2.tether, f2 = void 0 === u2 || u2, p2 = i2.tetherOffset, m2 = void 0 === p2 ? 0 : p2, g2 = Yt(e2, { boundary: l2, rootBoundary: c2, padding: h2, altBoundary: d2 }), _2 = pt(e2.placement), b2 = Kt(e2.placement), v2 = !b2, y2 = At(_2), w2 = "x" === y2 ? "y" : "x", E2 = e2.modifiersData.popperOffsets, T2 = e2.rects.reference, A2 = e2.rects.popper, L2 = "function" == typeof m2 ? m2(Object.assign({}, e2.rects, { placement: e2.placement })) : m2, O2 = { x: 0, y: 0 };
        if (E2) {
          if (o2 || a2) {
            var k2 = "y" === y2 ? tt : nt, C2 = "y" === y2 ? et : it, x2 = "y" === y2 ? "height" : "width", D2 = E2[y2], N2 = E2[y2] + g2[k2], S2 = E2[y2] - g2[C2], I2 = f2 ? -A2[x2] / 2 : 0, j2 = "start" === b2 ? T2[x2] : A2[x2], P2 = "start" === b2 ? -A2[x2] : -T2[x2], M2 = e2.elements.arrow, H2 = f2 && M2 ? gt(M2) : { width: 0, height: 0 }, R2 = e2.modifiersData["arrow#persistent"] ? e2.modifiersData["arrow#persistent"].padding : { top: 0, right: 0, bottom: 0, left: 0 }, B2 = R2[k2], W2 = R2[C2], q2 = Ct(0, T2[x2], H2[x2]), z2 = v2 ? T2[x2] / 2 - I2 - q2 - B2 - L2 : j2 - q2 - B2 - L2, U2 = v2 ? -T2[x2] / 2 + I2 + q2 + W2 + L2 : P2 + q2 + W2 + L2, $2 = e2.elements.arrow && Tt(e2.elements.arrow), F2 = $2 ? "y" === y2 ? $2.clientTop || 0 : $2.clientLeft || 0 : 0, V2 = e2.modifiersData.offset ? e2.modifiersData.offset[e2.placement][y2] : 0, K2 = E2[y2] + z2 - V2 - F2, X2 = E2[y2] + U2 - V2;
            if (o2) {
              var Y2 = Ct(f2 ? Ot(N2, K2) : N2, D2, f2 ? Lt(S2, X2) : S2);
              E2[y2] = Y2, O2[y2] = Y2 - D2;
            }
            if (a2) {
              var Q2 = "x" === y2 ? tt : nt, G2 = "x" === y2 ? et : it, Z2 = E2[w2], J2 = Z2 + g2[Q2], st2 = Z2 - g2[G2], ot2 = Ct(f2 ? Ot(J2, K2) : J2, Z2, f2 ? Lt(st2, X2) : st2);
              E2[w2] = ot2, O2[w2] = ot2 - Z2;
            }
          }
          e2.modifiersData[n2] = O2;
        }
      }, requiresIfExists: ["offset"] };
      function se(t2, e2, i2) {
        void 0 === i2 && (i2 = false);
        var n2, s2, o2 = yt(e2), r2 = mt(t2), a2 = ht(e2), l2 = { scrollLeft: 0, scrollTop: 0 }, c2 = { x: 0, y: 0 };
        return (a2 || !a2 && !i2) && (("body" !== lt(e2) || Ut(o2)) && (l2 = (n2 = e2) !== ct(n2) && ht(n2) ? { scrollLeft: (s2 = n2).scrollLeft, scrollTop: s2.scrollTop } : qt(n2)), ht(e2) ? ((c2 = mt(e2)).x += e2.clientLeft, c2.y += e2.clientTop) : o2 && (c2.x = zt(o2))), { x: r2.left + l2.scrollLeft - c2.x, y: r2.top + l2.scrollTop - c2.y, width: r2.width, height: r2.height };
      }
      var oe = { placement: "bottom", modifiers: [], strategy: "absolute" };
      function re() {
        for (var t2 = arguments.length, e2 = new Array(t2), i2 = 0; i2 < t2; i2++) e2[i2] = arguments[i2];
        return !e2.some(function(t3) {
          return !(t3 && "function" == typeof t3.getBoundingClientRect);
        });
      }
      function ae(t2) {
        void 0 === t2 && (t2 = {});
        var e2 = t2, i2 = e2.defaultModifiers, n2 = void 0 === i2 ? [] : i2, s2 = e2.defaultOptions, o2 = void 0 === s2 ? oe : s2;
        return function(t3, e3, i3) {
          void 0 === i3 && (i3 = o2);
          var s3, r2, a2 = { placement: "bottom", orderedModifiers: [], options: Object.assign({}, oe, o2), modifiersData: {}, elements: { reference: t3, popper: e3 }, attributes: {}, styles: {} }, l2 = [], c2 = false, d2 = { state: a2, setOptions: function(i4) {
            h2(), a2.options = Object.assign({}, o2, a2.options, i4), a2.scrollParents = { reference: dt(t3) ? $t(t3) : t3.contextElement ? $t(t3.contextElement) : [], popper: $t(e3) };
            var s4, r3, c3 = function(t4) {
              var e4 = function(t5) {
                var e5 = /* @__PURE__ */ new Map(), i5 = /* @__PURE__ */ new Set(), n3 = [];
                return t5.forEach(function(t6) {
                  e5.set(t6.name, t6);
                }), t5.forEach(function(t6) {
                  i5.has(t6.name) || function t7(s5) {
                    i5.add(s5.name), [].concat(s5.requires || [], s5.requiresIfExists || []).forEach(function(n4) {
                      if (!i5.has(n4)) {
                        var s6 = e5.get(n4);
                        s6 && t7(s6);
                      }
                    }), n3.push(s5);
                  }(t6);
                }), n3;
              }(t4);
              return at.reduce(function(t5, i5) {
                return t5.concat(e4.filter(function(t6) {
                  return t6.phase === i5;
                }));
              }, []);
            }((s4 = [].concat(n2, a2.options.modifiers), r3 = s4.reduce(function(t4, e4) {
              var i5 = t4[e4.name];
              return t4[e4.name] = i5 ? Object.assign({}, i5, e4, { options: Object.assign({}, i5.options, e4.options), data: Object.assign({}, i5.data, e4.data) }) : e4, t4;
            }, {}), Object.keys(r3).map(function(t4) {
              return r3[t4];
            })));
            return a2.orderedModifiers = c3.filter(function(t4) {
              return t4.enabled;
            }), a2.orderedModifiers.forEach(function(t4) {
              var e4 = t4.name, i5 = t4.options, n3 = void 0 === i5 ? {} : i5, s5 = t4.effect;
              if ("function" == typeof s5) {
                var o3 = s5({ state: a2, name: e4, instance: d2, options: n3 });
                l2.push(o3 || function() {
                });
              }
            }), d2.update();
          }, forceUpdate: function() {
            if (!c2) {
              var t4 = a2.elements, e4 = t4.reference, i4 = t4.popper;
              if (re(e4, i4)) {
                a2.rects = { reference: se(e4, Tt(i4), "fixed" === a2.options.strategy), popper: gt(i4) }, a2.reset = false, a2.placement = a2.options.placement, a2.orderedModifiers.forEach(function(t5) {
                  return a2.modifiersData[t5.name] = Object.assign({}, t5.data);
                });
                for (var n3 = 0; n3 < a2.orderedModifiers.length; n3++) if (true !== a2.reset) {
                  var s4 = a2.orderedModifiers[n3], o3 = s4.fn, r3 = s4.options, l3 = void 0 === r3 ? {} : r3, h3 = s4.name;
                  "function" == typeof o3 && (a2 = o3({ state: a2, options: l3, name: h3, instance: d2 }) || a2);
                } else a2.reset = false, n3 = -1;
              }
            }
          }, update: (s3 = function() {
            return new Promise(function(t4) {
              d2.forceUpdate(), t4(a2);
            });
          }, function() {
            return r2 || (r2 = new Promise(function(t4) {
              Promise.resolve().then(function() {
                r2 = void 0, t4(s3());
              });
            })), r2;
          }), destroy: function() {
            h2(), c2 = true;
          } };
          if (!re(t3, e3)) return d2;
          function h2() {
            l2.forEach(function(t4) {
              return t4();
            }), l2 = [];
          }
          return d2.setOptions(i3).then(function(t4) {
            !c2 && i3.onFirstUpdate && i3.onFirstUpdate(t4);
          }), d2;
        };
      }
      var le = ae(), ce = ae({ defaultModifiers: [Mt, ie, jt, ft] }), de = ae({ defaultModifiers: [Mt, ie, jt, ft, ee, Gt, ne, Nt, te] }), he = Object.freeze({ __proto__: null, popperGenerator: ae, detectOverflow: Yt, createPopperBase: le, createPopper: de, createPopperLite: ce, top: tt, bottom: et, right: it, left: nt, auto: "auto", basePlacements: st, start: "start", end: "end", clippingParents: "clippingParents", viewport: "viewport", popper: "popper", reference: "reference", variationPlacements: ot, placements: rt, beforeRead: "beforeRead", read: "read", afterRead: "afterRead", beforeMain: "beforeMain", main: "main", afterMain: "afterMain", beforeWrite: "beforeWrite", write: "write", afterWrite: "afterWrite", modifierPhases: at, applyStyles: ft, arrow: Nt, computeStyles: jt, eventListeners: Mt, flip: Gt, hide: te, offset: ee, popperOffsets: ie, preventOverflow: ne });
      const ue = new RegExp("ArrowUp|ArrowDown|Escape"), fe = _() ? "top-end" : "top-start", pe = _() ? "top-start" : "top-end", me = _() ? "bottom-end" : "bottom-start", ge = _() ? "bottom-start" : "bottom-end", _e = _() ? "left-start" : "right-start", be = _() ? "right-start" : "left-start", ve = { offset: [0, 2], boundary: "clippingParents", reference: "toggle", display: "dynamic", popperConfig: null, autoClose: true }, ye = { offset: "(array|string|function)", boundary: "(string|element)", reference: "(string|element|object)", display: "string", popperConfig: "(null|object|function)", autoClose: "(boolean|string)" };
      class we extends R {
        constructor(t2, e2) {
          super(t2), this._popper = null, this._config = this._getConfig(e2), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar(), this._addEventListeners();
        }
        static get Default() {
          return ve;
        }
        static get DefaultType() {
          return ye;
        }
        static get NAME() {
          return "dropdown";
        }
        toggle() {
          u(this._element) || (this._element.classList.contains("show") ? this.hide() : this.show());
        }
        show() {
          if (u(this._element) || this._menu.classList.contains("show")) return;
          const t2 = we.getParentFromElement(this._element), e2 = { relatedTarget: this._element };
          if (!H.trigger(this._element, "show.bs.dropdown", e2).defaultPrevented) {
            if (this._inNavbar) U.setDataAttribute(this._menu, "popper", "none");
            else {
              if (void 0 === he) throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org)");
              let e3 = this._element;
              "parent" === this._config.reference ? e3 = t2 : a(this._config.reference) ? e3 = l(this._config.reference) : "object" == typeof this._config.reference && (e3 = this._config.reference);
              const i2 = this._getPopperConfig(), n2 = i2.modifiers.find((t3) => "applyStyles" === t3.name && false === t3.enabled);
              this._popper = de(e3, this._menu, i2), n2 && U.setDataAttribute(this._menu, "popper", "static");
            }
            "ontouchstart" in document.documentElement && !t2.closest(".navbar-nav") && [].concat(...document.body.children).forEach((t3) => H.on(t3, "mouseover", p)), this._element.focus(), this._element.setAttribute("aria-expanded", true), this._menu.classList.toggle("show"), this._element.classList.toggle("show"), H.trigger(this._element, "shown.bs.dropdown", e2);
          }
        }
        hide() {
          if (u(this._element) || !this._menu.classList.contains("show")) return;
          const t2 = { relatedTarget: this._element };
          this._completeHide(t2);
        }
        dispose() {
          this._popper && this._popper.destroy(), super.dispose();
        }
        update() {
          this._inNavbar = this._detectNavbar(), this._popper && this._popper.update();
        }
        _addEventListeners() {
          H.on(this._element, "click.bs.dropdown", (t2) => {
            t2.preventDefault(), this.toggle();
          });
        }
        _completeHide(t2) {
          H.trigger(this._element, "hide.bs.dropdown", t2).defaultPrevented || ("ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach((t3) => H.off(t3, "mouseover", p)), this._popper && this._popper.destroy(), this._menu.classList.remove("show"), this._element.classList.remove("show"), this._element.setAttribute("aria-expanded", "false"), U.removeDataAttribute(this._menu, "popper"), H.trigger(this._element, "hidden.bs.dropdown", t2));
        }
        _getConfig(t2) {
          if (t2 = { ...this.constructor.Default, ...U.getDataAttributes(this._element), ...t2 }, d("dropdown", t2, this.constructor.DefaultType), "object" == typeof t2.reference && !a(t2.reference) && "function" != typeof t2.reference.getBoundingClientRect) throw new TypeError("dropdown".toUpperCase() + ': Option "reference" provided type "object" without a required "getBoundingClientRect" method.');
          return t2;
        }
        _getMenuElement() {
          return t.next(this._element, ".dropdown-menu")[0];
        }
        _getPlacement() {
          const t2 = this._element.parentNode;
          if (t2.classList.contains("dropend")) return _e;
          if (t2.classList.contains("dropstart")) return be;
          const e2 = "end" === getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();
          return t2.classList.contains("dropup") ? e2 ? pe : fe : e2 ? ge : me;
        }
        _detectNavbar() {
          return null !== this._element.closest(".navbar");
        }
        _getOffset() {
          const { offset: t2 } = this._config;
          return "string" == typeof t2 ? t2.split(",").map((t3) => Number.parseInt(t3, 10)) : "function" == typeof t2 ? (e2) => t2(e2, this._element) : t2;
        }
        _getPopperConfig() {
          const t2 = { placement: this._getPlacement(), modifiers: [{ name: "preventOverflow", options: { boundary: this._config.boundary } }, { name: "offset", options: { offset: this._getOffset() } }] };
          return "static" === this._config.display && (t2.modifiers = [{ name: "applyStyles", enabled: false }]), { ...t2, ..."function" == typeof this._config.popperConfig ? this._config.popperConfig(t2) : this._config.popperConfig };
        }
        _selectMenuItem(e2) {
          const i2 = t.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)", this._menu).filter(h);
          if (!i2.length) return;
          let n2 = i2.indexOf(e2.target);
          "ArrowUp" === e2.key && n2 > 0 && n2--, "ArrowDown" === e2.key && n2 < i2.length - 1 && n2++, n2 = -1 === n2 ? 0 : n2, i2[n2].focus();
        }
        static dropdownInterface(t2, e2) {
          let i2 = w.get(t2, "bs.dropdown");
          if (i2 || (i2 = new we(t2, "object" == typeof e2 ? e2 : null)), "string" == typeof e2) {
            if (void 0 === i2[e2]) throw new TypeError(`No method named "${e2}"`);
            i2[e2]();
          }
        }
        static jQueryInterface(t2) {
          return this.each(function() {
            we.dropdownInterface(this, t2);
          });
        }
        static clearMenus(e2) {
          if (e2 && (2 === e2.button || "keyup" === e2.type && "Tab" !== e2.key)) return;
          const i2 = t.find('[data-bs-toggle="dropdown"]');
          for (let t2 = 0, n2 = i2.length; t2 < n2; t2++) {
            const n3 = w.get(i2[t2], "bs.dropdown");
            if (!n3 || false === n3._config.autoClose) continue;
            if (!n3._element.classList.contains("show")) continue;
            const s2 = { relatedTarget: n3._element };
            if (e2) {
              const t3 = e2.composedPath(), i3 = t3.includes(n3._menu);
              if (t3.includes(n3._element) || "inside" === n3._config.autoClose && !i3 || "outside" === n3._config.autoClose && i3) continue;
              if (n3._menu.contains(e2.target) && ("keyup" === e2.type && "Tab" === e2.key || /input|select|option|textarea|form/i.test(e2.target.tagName))) continue;
              "click" === e2.type && (s2.clickEvent = e2);
            }
            n3._completeHide(s2);
          }
        }
        static getParentFromElement(t2) {
          return s(t2) || t2.parentNode;
        }
        static dataApiKeydownHandler(e2) {
          if (/input|textarea/i.test(e2.target.tagName) ? "Space" === e2.key || "Escape" !== e2.key && ("ArrowDown" !== e2.key && "ArrowUp" !== e2.key || e2.target.closest(".dropdown-menu")) : !ue.test(e2.key)) return;
          const i2 = this.classList.contains("show");
          if (!i2 && "Escape" === e2.key) return;
          if (e2.preventDefault(), e2.stopPropagation(), u(this)) return;
          const n2 = () => this.matches('[data-bs-toggle="dropdown"]') ? this : t.prev(this, '[data-bs-toggle="dropdown"]')[0];
          if ("Escape" === e2.key) return n2().focus(), void we.clearMenus();
          i2 || "ArrowUp" !== e2.key && "ArrowDown" !== e2.key ? i2 && "Space" !== e2.key ? we.getInstance(n2())._selectMenuItem(e2) : we.clearMenus() : n2().click();
        }
      }
      H.on(document, "keydown.bs.dropdown.data-api", '[data-bs-toggle="dropdown"]', we.dataApiKeydownHandler), H.on(document, "keydown.bs.dropdown.data-api", ".dropdown-menu", we.dataApiKeydownHandler), H.on(document, "click.bs.dropdown.data-api", we.clearMenus), H.on(document, "keyup.bs.dropdown.data-api", we.clearMenus), H.on(document, "click.bs.dropdown.data-api", '[data-bs-toggle="dropdown"]', function(t2) {
        t2.preventDefault(), we.dropdownInterface(this);
      }), b(we);
      const Ee = () => {
        const t2 = document.documentElement.clientWidth;
        return Math.abs(window.innerWidth - t2);
      }, Te = (t2 = Ee()) => {
        Ae(), Le("body", "paddingRight", (e2) => e2 + t2), Le(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top", "paddingRight", (e2) => e2 + t2), Le(".sticky-top", "marginRight", (e2) => e2 - t2);
      }, Ae = () => {
        const t2 = document.body.style.overflow;
        t2 && U.setDataAttribute(document.body, "overflow", t2), document.body.style.overflow = "hidden";
      }, Le = (e2, i2, n2) => {
        const s2 = Ee();
        t.find(e2).forEach((t2) => {
          if (t2 !== document.body && window.innerWidth > t2.clientWidth + s2) return;
          const e3 = t2.style[i2], o2 = window.getComputedStyle(t2)[i2];
          U.setDataAttribute(t2, i2, e3), t2.style[i2] = n2(Number.parseFloat(o2)) + "px";
        });
      }, Oe = () => {
        ke("body", "overflow"), ke("body", "paddingRight"), ke(".fixed-top, .fixed-bottom, .is-fixed, .sticky-top", "paddingRight"), ke(".sticky-top", "marginRight");
      }, ke = (e2, i2) => {
        t.find(e2).forEach((t2) => {
          const e3 = U.getDataAttribute(t2, i2);
          void 0 === e3 ? t2.style.removeProperty(i2) : (U.removeDataAttribute(t2, i2), t2.style[i2] = e3);
        });
      }, Ce = { isVisible: true, isAnimated: false, rootElement: document.body, clickCallback: null }, xe = { isVisible: "boolean", isAnimated: "boolean", rootElement: "element", clickCallback: "(function|null)" };
      class De {
        constructor(t2) {
          this._config = this._getConfig(t2), this._isAppended = false, this._element = null;
        }
        show(t2) {
          this._config.isVisible ? (this._append(), this._config.isAnimated && m(this._getElement()), this._getElement().classList.add("show"), this._emulateAnimation(() => {
            v(t2);
          })) : v(t2);
        }
        hide(t2) {
          this._config.isVisible ? (this._getElement().classList.remove("show"), this._emulateAnimation(() => {
            this.dispose(), v(t2);
          })) : v(t2);
        }
        _getElement() {
          if (!this._element) {
            const t2 = document.createElement("div");
            t2.className = "modal-backdrop", this._config.isAnimated && t2.classList.add("fade"), this._element = t2;
          }
          return this._element;
        }
        _getConfig(t2) {
          return (t2 = { ...Ce, ..."object" == typeof t2 ? t2 : {} }).rootElement = t2.rootElement || document.body, d("backdrop", t2, xe), t2;
        }
        _append() {
          this._isAppended || (this._config.rootElement.appendChild(this._getElement()), H.on(this._getElement(), "mousedown.bs.backdrop", () => {
            v(this._config.clickCallback);
          }), this._isAppended = true);
        }
        dispose() {
          this._isAppended && (H.off(this._element, "mousedown.bs.backdrop"), this._getElement().parentNode.removeChild(this._element), this._isAppended = false);
        }
        _emulateAnimation(t2) {
          if (!this._config.isAnimated) return void v(t2);
          const e2 = o(this._getElement());
          H.one(this._getElement(), "transitionend", () => v(t2)), c(this._getElement(), e2);
        }
      }
      const Ne = { backdrop: true, keyboard: true, focus: true }, Se = { backdrop: "(boolean|string)", keyboard: "boolean", focus: "boolean" };
      class Ie extends R {
        constructor(e2, i2) {
          super(e2), this._config = this._getConfig(i2), this._dialog = t.findOne(".modal-dialog", this._element), this._backdrop = this._initializeBackDrop(), this._isShown = false, this._ignoreBackdropClick = false, this._isTransitioning = false;
        }
        static get Default() {
          return Ne;
        }
        static get NAME() {
          return "modal";
        }
        toggle(t2) {
          return this._isShown ? this.hide() : this.show(t2);
        }
        show(t2) {
          if (this._isShown || this._isTransitioning) return;
          this._isAnimated() && (this._isTransitioning = true);
          const e2 = H.trigger(this._element, "show.bs.modal", { relatedTarget: t2 });
          this._isShown || e2.defaultPrevented || (this._isShown = true, Te(), document.body.classList.add("modal-open"), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), H.on(this._element, "click.dismiss.bs.modal", '[data-bs-dismiss="modal"]', (t3) => this.hide(t3)), H.on(this._dialog, "mousedown.dismiss.bs.modal", () => {
            H.one(this._element, "mouseup.dismiss.bs.modal", (t3) => {
              t3.target === this._element && (this._ignoreBackdropClick = true);
            });
          }), this._showBackdrop(() => this._showElement(t2)));
        }
        hide(t2) {
          if (t2 && t2.preventDefault(), !this._isShown || this._isTransitioning) return;
          if (H.trigger(this._element, "hide.bs.modal").defaultPrevented) return;
          this._isShown = false;
          const e2 = this._isAnimated();
          e2 && (this._isTransitioning = true), this._setEscapeEvent(), this._setResizeEvent(), H.off(document, "focusin.bs.modal"), this._element.classList.remove("show"), H.off(this._element, "click.dismiss.bs.modal"), H.off(this._dialog, "mousedown.dismiss.bs.modal"), this._queueCallback(() => this._hideModal(), this._element, e2);
        }
        dispose() {
          [window, this._dialog].forEach((t2) => H.off(t2, ".bs.modal")), this._backdrop.dispose(), super.dispose(), H.off(document, "focusin.bs.modal");
        }
        handleUpdate() {
          this._adjustDialog();
        }
        _initializeBackDrop() {
          return new De({ isVisible: Boolean(this._config.backdrop), isAnimated: this._isAnimated() });
        }
        _getConfig(t2) {
          return t2 = { ...Ne, ...U.getDataAttributes(this._element), ...t2 }, d("modal", t2, Se), t2;
        }
        _showElement(e2) {
          const i2 = this._isAnimated(), n2 = t.findOne(".modal-body", this._dialog);
          this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", true), this._element.setAttribute("role", "dialog"), this._element.scrollTop = 0, n2 && (n2.scrollTop = 0), i2 && m(this._element), this._element.classList.add("show"), this._config.focus && this._enforceFocus(), this._queueCallback(() => {
            this._config.focus && this._element.focus(), this._isTransitioning = false, H.trigger(this._element, "shown.bs.modal", { relatedTarget: e2 });
          }, this._dialog, i2);
        }
        _enforceFocus() {
          H.off(document, "focusin.bs.modal"), H.on(document, "focusin.bs.modal", (t2) => {
            document === t2.target || this._element === t2.target || this._element.contains(t2.target) || this._element.focus();
          });
        }
        _setEscapeEvent() {
          this._isShown ? H.on(this._element, "keydown.dismiss.bs.modal", (t2) => {
            this._config.keyboard && "Escape" === t2.key ? (t2.preventDefault(), this.hide()) : this._config.keyboard || "Escape" !== t2.key || this._triggerBackdropTransition();
          }) : H.off(this._element, "keydown.dismiss.bs.modal");
        }
        _setResizeEvent() {
          this._isShown ? H.on(window, "resize.bs.modal", () => this._adjustDialog()) : H.off(window, "resize.bs.modal");
        }
        _hideModal() {
          this._element.style.display = "none", this._element.setAttribute("aria-hidden", true), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._isTransitioning = false, this._backdrop.hide(() => {
            document.body.classList.remove("modal-open"), this._resetAdjustments(), Oe(), H.trigger(this._element, "hidden.bs.modal");
          });
        }
        _showBackdrop(t2) {
          H.on(this._element, "click.dismiss.bs.modal", (t3) => {
            this._ignoreBackdropClick ? this._ignoreBackdropClick = false : t3.target === t3.currentTarget && (true === this._config.backdrop ? this.hide() : "static" === this._config.backdrop && this._triggerBackdropTransition());
          }), this._backdrop.show(t2);
        }
        _isAnimated() {
          return this._element.classList.contains("fade");
        }
        _triggerBackdropTransition() {
          if (H.trigger(this._element, "hidePrevented.bs.modal").defaultPrevented) return;
          const t2 = this._element.scrollHeight > document.documentElement.clientHeight;
          t2 || (this._element.style.overflowY = "hidden"), this._element.classList.add("modal-static");
          const e2 = o(this._dialog);
          H.off(this._element, "transitionend"), H.one(this._element, "transitionend", () => {
            this._element.classList.remove("modal-static"), t2 || (H.one(this._element, "transitionend", () => {
              this._element.style.overflowY = "";
            }), c(this._element, e2));
          }), c(this._element, e2), this._element.focus();
        }
        _adjustDialog() {
          const t2 = this._element.scrollHeight > document.documentElement.clientHeight, e2 = Ee(), i2 = e2 > 0;
          (!i2 && t2 && !_() || i2 && !t2 && _()) && (this._element.style.paddingLeft = e2 + "px"), (i2 && !t2 && !_() || !i2 && t2 && _()) && (this._element.style.paddingRight = e2 + "px");
        }
        _resetAdjustments() {
          this._element.style.paddingLeft = "", this._element.style.paddingRight = "";
        }
        static jQueryInterface(t2, e2) {
          return this.each(function() {
            const i2 = Ie.getInstance(this) || new Ie(this, "object" == typeof t2 ? t2 : {});
            if ("string" == typeof t2) {
              if (void 0 === i2[t2]) throw new TypeError(`No method named "${t2}"`);
              i2[t2](e2);
            }
          });
        }
      }
      H.on(document, "click.bs.modal.data-api", '[data-bs-toggle="modal"]', function(t2) {
        const e2 = s(this);
        ["A", "AREA"].includes(this.tagName) && t2.preventDefault(), H.one(e2, "show.bs.modal", (t3) => {
          t3.defaultPrevented || H.one(e2, "hidden.bs.modal", () => {
            h(this) && this.focus();
          });
        }), (Ie.getInstance(e2) || new Ie(e2)).toggle(this);
      }), b(Ie);
      const je = { backdrop: true, keyboard: true, scroll: false }, Pe = { backdrop: "boolean", keyboard: "boolean", scroll: "boolean" };
      class Me extends R {
        constructor(t2, e2) {
          super(t2), this._config = this._getConfig(e2), this._isShown = false, this._backdrop = this._initializeBackDrop(), this._addEventListeners();
        }
        static get NAME() {
          return "offcanvas";
        }
        static get Default() {
          return je;
        }
        toggle(t2) {
          return this._isShown ? this.hide() : this.show(t2);
        }
        show(t2) {
          this._isShown || H.trigger(this._element, "show.bs.offcanvas", { relatedTarget: t2 }).defaultPrevented || (this._isShown = true, this._element.style.visibility = "visible", this._backdrop.show(), this._config.scroll || (Te(), this._enforceFocusOnElement(this._element)), this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", true), this._element.setAttribute("role", "dialog"), this._element.classList.add("show"), this._queueCallback(() => {
            H.trigger(this._element, "shown.bs.offcanvas", { relatedTarget: t2 });
          }, this._element, true));
        }
        hide() {
          this._isShown && (H.trigger(this._element, "hide.bs.offcanvas").defaultPrevented || (H.off(document, "focusin.bs.offcanvas"), this._element.blur(), this._isShown = false, this._element.classList.remove("show"), this._backdrop.hide(), this._queueCallback(() => {
            this._element.setAttribute("aria-hidden", true), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._element.style.visibility = "hidden", this._config.scroll || Oe(), H.trigger(this._element, "hidden.bs.offcanvas");
          }, this._element, true)));
        }
        dispose() {
          this._backdrop.dispose(), super.dispose(), H.off(document, "focusin.bs.offcanvas");
        }
        _getConfig(t2) {
          return t2 = { ...je, ...U.getDataAttributes(this._element), ..."object" == typeof t2 ? t2 : {} }, d("offcanvas", t2, Pe), t2;
        }
        _initializeBackDrop() {
          return new De({ isVisible: this._config.backdrop, isAnimated: true, rootElement: this._element.parentNode, clickCallback: () => this.hide() });
        }
        _enforceFocusOnElement(t2) {
          H.off(document, "focusin.bs.offcanvas"), H.on(document, "focusin.bs.offcanvas", (e2) => {
            document === e2.target || t2 === e2.target || t2.contains(e2.target) || t2.focus();
          }), t2.focus();
        }
        _addEventListeners() {
          H.on(this._element, "click.dismiss.bs.offcanvas", '[data-bs-dismiss="offcanvas"]', () => this.hide()), H.on(this._element, "keydown.dismiss.bs.offcanvas", (t2) => {
            this._config.keyboard && "Escape" === t2.key && this.hide();
          });
        }
        static jQueryInterface(t2) {
          return this.each(function() {
            const e2 = w.get(this, "bs.offcanvas") || new Me(this, "object" == typeof t2 ? t2 : {});
            if ("string" == typeof t2) {
              if (void 0 === e2[t2] || t2.startsWith("_") || "constructor" === t2) throw new TypeError(`No method named "${t2}"`);
              e2[t2](this);
            }
          });
        }
      }
      H.on(document, "click.bs.offcanvas.data-api", '[data-bs-toggle="offcanvas"]', function(e2) {
        const i2 = s(this);
        if (["A", "AREA"].includes(this.tagName) && e2.preventDefault(), u(this)) return;
        H.one(i2, "hidden.bs.offcanvas", () => {
          h(this) && this.focus();
        });
        const n2 = t.findOne(".offcanvas.show");
        n2 && n2 !== i2 && Me.getInstance(n2).hide(), (w.get(i2, "bs.offcanvas") || new Me(i2)).toggle(this);
      }), H.on(window, "load.bs.offcanvas.data-api", () => {
        t.find(".offcanvas.show").forEach((t2) => (w.get(t2, "bs.offcanvas") || new Me(t2)).show());
      }), b(Me);
      const He = /* @__PURE__ */ new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"]), Re = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/i, Be = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i, We = (t2, e2) => {
        const i2 = t2.nodeName.toLowerCase();
        if (e2.includes(i2)) return !He.has(i2) || Boolean(Re.test(t2.nodeValue) || Be.test(t2.nodeValue));
        const n2 = e2.filter((t3) => t3 instanceof RegExp);
        for (let t3 = 0, e3 = n2.length; t3 < e3; t3++) if (n2[t3].test(i2)) return true;
        return false;
      };
      function qe(t2, e2, i2) {
        if (!t2.length) return t2;
        if (i2 && "function" == typeof i2) return i2(t2);
        const n2 = new window.DOMParser().parseFromString(t2, "text/html"), s2 = Object.keys(e2), o2 = [].concat(...n2.body.querySelectorAll("*"));
        for (let t3 = 0, i3 = o2.length; t3 < i3; t3++) {
          const i4 = o2[t3], n3 = i4.nodeName.toLowerCase();
          if (!s2.includes(n3)) {
            i4.parentNode.removeChild(i4);
            continue;
          }
          const r2 = [].concat(...i4.attributes), a2 = [].concat(e2["*"] || [], e2[n3] || []);
          r2.forEach((t4) => {
            We(t4, a2) || i4.removeAttribute(t4.nodeName);
          });
        }
        return n2.body.innerHTML;
      }
      const ze = new RegExp("(^|\\s)bs-tooltip\\S+", "g"), Ue = /* @__PURE__ */ new Set(["sanitize", "allowList", "sanitizeFn"]), $e = { animation: "boolean", template: "string", title: "(string|element|function)", trigger: "string", delay: "(number|object)", html: "boolean", selector: "(string|boolean)", placement: "(string|function)", offset: "(array|string|function)", container: "(string|element|boolean)", fallbackPlacements: "array", boundary: "(string|element)", customClass: "(string|function)", sanitize: "boolean", sanitizeFn: "(null|function)", allowList: "object", popperConfig: "(null|object|function)" }, Fe = { AUTO: "auto", TOP: "top", RIGHT: _() ? "left" : "right", BOTTOM: "bottom", LEFT: _() ? "right" : "left" }, Ve = { animation: true, template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>', trigger: "hover focus", title: "", delay: 0, html: false, selector: false, placement: "top", offset: [0, 0], container: false, fallbackPlacements: ["top", "right", "bottom", "left"], boundary: "clippingParents", customClass: "", sanitize: true, sanitizeFn: null, allowList: { "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i], a: ["target", "href", "title", "rel"], area: [], b: [], br: [], col: [], code: [], div: [], em: [], hr: [], h1: [], h2: [], h3: [], h4: [], h5: [], h6: [], i: [], img: ["src", "srcset", "alt", "title", "width", "height"], li: [], ol: [], p: [], pre: [], s: [], small: [], span: [], sub: [], sup: [], strong: [], u: [], ul: [] }, popperConfig: null }, Ke = { HIDE: "hide.bs.tooltip", HIDDEN: "hidden.bs.tooltip", SHOW: "show.bs.tooltip", SHOWN: "shown.bs.tooltip", INSERTED: "inserted.bs.tooltip", CLICK: "click.bs.tooltip", FOCUSIN: "focusin.bs.tooltip", FOCUSOUT: "focusout.bs.tooltip", MOUSEENTER: "mouseenter.bs.tooltip", MOUSELEAVE: "mouseleave.bs.tooltip" };
      class Xe extends R {
        constructor(t2, e2) {
          if (void 0 === he) throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");
          super(t2), this._isEnabled = true, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this._config = this._getConfig(e2), this.tip = null, this._setListeners();
        }
        static get Default() {
          return Ve;
        }
        static get NAME() {
          return "tooltip";
        }
        static get Event() {
          return Ke;
        }
        static get DefaultType() {
          return $e;
        }
        enable() {
          this._isEnabled = true;
        }
        disable() {
          this._isEnabled = false;
        }
        toggleEnabled() {
          this._isEnabled = !this._isEnabled;
        }
        toggle(t2) {
          if (this._isEnabled) if (t2) {
            const e2 = this._initializeOnDelegatedTarget(t2);
            e2._activeTrigger.click = !e2._activeTrigger.click, e2._isWithActiveTrigger() ? e2._enter(null, e2) : e2._leave(null, e2);
          } else {
            if (this.getTipElement().classList.contains("show")) return void this._leave(null, this);
            this._enter(null, this);
          }
        }
        dispose() {
          clearTimeout(this._timeout), H.off(this._element.closest(".modal"), "hide.bs.modal", this._hideModalHandler), this.tip && this.tip.parentNode && this.tip.parentNode.removeChild(this.tip), this._popper && this._popper.destroy(), super.dispose();
        }
        show() {
          if ("none" === this._element.style.display) throw new Error("Please use show on visible elements");
          if (!this.isWithContent() || !this._isEnabled) return;
          const t2 = H.trigger(this._element, this.constructor.Event.SHOW), i2 = f(this._element), n2 = null === i2 ? this._element.ownerDocument.documentElement.contains(this._element) : i2.contains(this._element);
          if (t2.defaultPrevented || !n2) return;
          const s2 = this.getTipElement(), o2 = e(this.constructor.NAME);
          s2.setAttribute("id", o2), this._element.setAttribute("aria-describedby", o2), this.setContent(), this._config.animation && s2.classList.add("fade");
          const r2 = "function" == typeof this._config.placement ? this._config.placement.call(this, s2, this._element) : this._config.placement, a2 = this._getAttachment(r2);
          this._addAttachmentClass(a2);
          const { container: l2 } = this._config;
          w.set(s2, this.constructor.DATA_KEY, this), this._element.ownerDocument.documentElement.contains(this.tip) || (l2.appendChild(s2), H.trigger(this._element, this.constructor.Event.INSERTED)), this._popper ? this._popper.update() : this._popper = de(this._element, s2, this._getPopperConfig(a2)), s2.classList.add("show");
          const c2 = "function" == typeof this._config.customClass ? this._config.customClass() : this._config.customClass;
          c2 && s2.classList.add(...c2.split(" ")), "ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach((t3) => {
            H.on(t3, "mouseover", p);
          });
          const d2 = this.tip.classList.contains("fade");
          this._queueCallback(() => {
            const t3 = this._hoverState;
            this._hoverState = null, H.trigger(this._element, this.constructor.Event.SHOWN), "out" === t3 && this._leave(null, this);
          }, this.tip, d2);
        }
        hide() {
          if (!this._popper) return;
          const t2 = this.getTipElement();
          if (H.trigger(this._element, this.constructor.Event.HIDE).defaultPrevented) return;
          t2.classList.remove("show"), "ontouchstart" in document.documentElement && [].concat(...document.body.children).forEach((t3) => H.off(t3, "mouseover", p)), this._activeTrigger.click = false, this._activeTrigger.focus = false, this._activeTrigger.hover = false;
          const e2 = this.tip.classList.contains("fade");
          this._queueCallback(() => {
            this._isWithActiveTrigger() || ("show" !== this._hoverState && t2.parentNode && t2.parentNode.removeChild(t2), this._cleanTipClass(), this._element.removeAttribute("aria-describedby"), H.trigger(this._element, this.constructor.Event.HIDDEN), this._popper && (this._popper.destroy(), this._popper = null));
          }, this.tip, e2), this._hoverState = "";
        }
        update() {
          null !== this._popper && this._popper.update();
        }
        isWithContent() {
          return Boolean(this.getTitle());
        }
        getTipElement() {
          if (this.tip) return this.tip;
          const t2 = document.createElement("div");
          return t2.innerHTML = this._config.template, this.tip = t2.children[0], this.tip;
        }
        setContent() {
          const e2 = this.getTipElement();
          this.setElementContent(t.findOne(".tooltip-inner", e2), this.getTitle()), e2.classList.remove("fade", "show");
        }
        setElementContent(t2, e2) {
          if (null !== t2) return a(e2) ? (e2 = l(e2), void (this._config.html ? e2.parentNode !== t2 && (t2.innerHTML = "", t2.appendChild(e2)) : t2.textContent = e2.textContent)) : void (this._config.html ? (this._config.sanitize && (e2 = qe(e2, this._config.allowList, this._config.sanitizeFn)), t2.innerHTML = e2) : t2.textContent = e2);
        }
        getTitle() {
          let t2 = this._element.getAttribute("data-bs-original-title");
          return t2 || (t2 = "function" == typeof this._config.title ? this._config.title.call(this._element) : this._config.title), t2;
        }
        updateAttachment(t2) {
          return "right" === t2 ? "end" : "left" === t2 ? "start" : t2;
        }
        _initializeOnDelegatedTarget(t2, e2) {
          const i2 = this.constructor.DATA_KEY;
          return (e2 = e2 || w.get(t2.delegateTarget, i2)) || (e2 = new this.constructor(t2.delegateTarget, this._getDelegateConfig()), w.set(t2.delegateTarget, i2, e2)), e2;
        }
        _getOffset() {
          const { offset: t2 } = this._config;
          return "string" == typeof t2 ? t2.split(",").map((t3) => Number.parseInt(t3, 10)) : "function" == typeof t2 ? (e2) => t2(e2, this._element) : t2;
        }
        _getPopperConfig(t2) {
          const e2 = { placement: t2, modifiers: [{ name: "flip", options: { fallbackPlacements: this._config.fallbackPlacements } }, { name: "offset", options: { offset: this._getOffset() } }, { name: "preventOverflow", options: { boundary: this._config.boundary } }, { name: "arrow", options: { element: `.${this.constructor.NAME}-arrow` } }, { name: "onChange", enabled: true, phase: "afterWrite", fn: (t3) => this._handlePopperPlacementChange(t3) }], onFirstUpdate: (t3) => {
            t3.options.placement !== t3.placement && this._handlePopperPlacementChange(t3);
          } };
          return { ...e2, ..."function" == typeof this._config.popperConfig ? this._config.popperConfig(e2) : this._config.popperConfig };
        }
        _addAttachmentClass(t2) {
          this.getTipElement().classList.add("bs-tooltip-" + this.updateAttachment(t2));
        }
        _getAttachment(t2) {
          return Fe[t2.toUpperCase()];
        }
        _setListeners() {
          this._config.trigger.split(" ").forEach((t2) => {
            if ("click" === t2) H.on(this._element, this.constructor.Event.CLICK, this._config.selector, (t3) => this.toggle(t3));
            else if ("manual" !== t2) {
              const e2 = "hover" === t2 ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN, i2 = "hover" === t2 ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
              H.on(this._element, e2, this._config.selector, (t3) => this._enter(t3)), H.on(this._element, i2, this._config.selector, (t3) => this._leave(t3));
            }
          }), this._hideModalHandler = () => {
            this._element && this.hide();
          }, H.on(this._element.closest(".modal"), "hide.bs.modal", this._hideModalHandler), this._config.selector ? this._config = { ...this._config, trigger: "manual", selector: "" } : this._fixTitle();
        }
        _fixTitle() {
          const t2 = this._element.getAttribute("title"), e2 = typeof this._element.getAttribute("data-bs-original-title");
          (t2 || "string" !== e2) && (this._element.setAttribute("data-bs-original-title", t2 || ""), !t2 || this._element.getAttribute("aria-label") || this._element.textContent || this._element.setAttribute("aria-label", t2), this._element.setAttribute("title", ""));
        }
        _enter(t2, e2) {
          e2 = this._initializeOnDelegatedTarget(t2, e2), t2 && (e2._activeTrigger["focusin" === t2.type ? "focus" : "hover"] = true), e2.getTipElement().classList.contains("show") || "show" === e2._hoverState ? e2._hoverState = "show" : (clearTimeout(e2._timeout), e2._hoverState = "show", e2._config.delay && e2._config.delay.show ? e2._timeout = setTimeout(() => {
            "show" === e2._hoverState && e2.show();
          }, e2._config.delay.show) : e2.show());
        }
        _leave(t2, e2) {
          e2 = this._initializeOnDelegatedTarget(t2, e2), t2 && (e2._activeTrigger["focusout" === t2.type ? "focus" : "hover"] = e2._element.contains(t2.relatedTarget)), e2._isWithActiveTrigger() || (clearTimeout(e2._timeout), e2._hoverState = "out", e2._config.delay && e2._config.delay.hide ? e2._timeout = setTimeout(() => {
            "out" === e2._hoverState && e2.hide();
          }, e2._config.delay.hide) : e2.hide());
        }
        _isWithActiveTrigger() {
          for (const t2 in this._activeTrigger) if (this._activeTrigger[t2]) return true;
          return false;
        }
        _getConfig(t2) {
          const e2 = U.getDataAttributes(this._element);
          return Object.keys(e2).forEach((t3) => {
            Ue.has(t3) && delete e2[t3];
          }), (t2 = { ...this.constructor.Default, ...e2, ..."object" == typeof t2 && t2 ? t2 : {} }).container = false === t2.container ? document.body : l(t2.container), "number" == typeof t2.delay && (t2.delay = { show: t2.delay, hide: t2.delay }), "number" == typeof t2.title && (t2.title = t2.title.toString()), "number" == typeof t2.content && (t2.content = t2.content.toString()), d("tooltip", t2, this.constructor.DefaultType), t2.sanitize && (t2.template = qe(t2.template, t2.allowList, t2.sanitizeFn)), t2;
        }
        _getDelegateConfig() {
          const t2 = {};
          if (this._config) for (const e2 in this._config) this.constructor.Default[e2] !== this._config[e2] && (t2[e2] = this._config[e2]);
          return t2;
        }
        _cleanTipClass() {
          const t2 = this.getTipElement(), e2 = t2.getAttribute("class").match(ze);
          null !== e2 && e2.length > 0 && e2.map((t3) => t3.trim()).forEach((e3) => t2.classList.remove(e3));
        }
        _handlePopperPlacementChange(t2) {
          const { state: e2 } = t2;
          e2 && (this.tip = e2.elements.popper, this._cleanTipClass(), this._addAttachmentClass(this._getAttachment(e2.placement)));
        }
        static jQueryInterface(t2) {
          return this.each(function() {
            let e2 = w.get(this, "bs.tooltip");
            const i2 = "object" == typeof t2 && t2;
            if ((e2 || !/dispose|hide/.test(t2)) && (e2 || (e2 = new Xe(this, i2)), "string" == typeof t2)) {
              if (void 0 === e2[t2]) throw new TypeError(`No method named "${t2}"`);
              e2[t2]();
            }
          });
        }
      }
      b(Xe);
      const Ye = new RegExp("(^|\\s)bs-popover\\S+", "g"), Qe = { ...Xe.Default, placement: "right", offset: [0, 8], trigger: "click", content: "", template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>' }, Ge = { ...Xe.DefaultType, content: "(string|element|function)" }, Ze = { HIDE: "hide.bs.popover", HIDDEN: "hidden.bs.popover", SHOW: "show.bs.popover", SHOWN: "shown.bs.popover", INSERTED: "inserted.bs.popover", CLICK: "click.bs.popover", FOCUSIN: "focusin.bs.popover", FOCUSOUT: "focusout.bs.popover", MOUSEENTER: "mouseenter.bs.popover", MOUSELEAVE: "mouseleave.bs.popover" };
      class Je extends Xe {
        static get Default() {
          return Qe;
        }
        static get NAME() {
          return "popover";
        }
        static get Event() {
          return Ze;
        }
        static get DefaultType() {
          return Ge;
        }
        isWithContent() {
          return this.getTitle() || this._getContent();
        }
        setContent() {
          const e2 = this.getTipElement();
          this.setElementContent(t.findOne(".popover-header", e2), this.getTitle());
          let i2 = this._getContent();
          "function" == typeof i2 && (i2 = i2.call(this._element)), this.setElementContent(t.findOne(".popover-body", e2), i2), e2.classList.remove("fade", "show");
        }
        _addAttachmentClass(t2) {
          this.getTipElement().classList.add("bs-popover-" + this.updateAttachment(t2));
        }
        _getContent() {
          return this._element.getAttribute("data-bs-content") || this._config.content;
        }
        _cleanTipClass() {
          const t2 = this.getTipElement(), e2 = t2.getAttribute("class").match(Ye);
          null !== e2 && e2.length > 0 && e2.map((t3) => t3.trim()).forEach((e3) => t2.classList.remove(e3));
        }
        static jQueryInterface(t2) {
          return this.each(function() {
            let e2 = w.get(this, "bs.popover");
            const i2 = "object" == typeof t2 ? t2 : null;
            if ((e2 || !/dispose|hide/.test(t2)) && (e2 || (e2 = new Je(this, i2), w.set(this, "bs.popover", e2)), "string" == typeof t2)) {
              if (void 0 === e2[t2]) throw new TypeError(`No method named "${t2}"`);
              e2[t2]();
            }
          });
        }
      }
      b(Je);
      const ti = { offset: 10, method: "auto", target: "" }, ei = { offset: "number", method: "string", target: "(string|element)" };
      class ii extends R {
        constructor(t2, e2) {
          super(t2), this._scrollElement = "BODY" === this._element.tagName ? window : this._element, this._config = this._getConfig(e2), this._selector = `${this._config.target} .nav-link, ${this._config.target} .list-group-item, ${this._config.target} .dropdown-item`, this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, H.on(this._scrollElement, "scroll.bs.scrollspy", () => this._process()), this.refresh(), this._process();
        }
        static get Default() {
          return ti;
        }
        static get NAME() {
          return "scrollspy";
        }
        refresh() {
          const e2 = this._scrollElement === this._scrollElement.window ? "offset" : "position", i2 = "auto" === this._config.method ? e2 : this._config.method, s2 = "position" === i2 ? this._getScrollTop() : 0;
          this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), t.find(this._selector).map((e3) => {
            const o2 = n(e3), r2 = o2 ? t.findOne(o2) : null;
            if (r2) {
              const t2 = r2.getBoundingClientRect();
              if (t2.width || t2.height) return [U[i2](r2).top + s2, o2];
            }
            return null;
          }).filter((t2) => t2).sort((t2, e3) => t2[0] - e3[0]).forEach((t2) => {
            this._offsets.push(t2[0]), this._targets.push(t2[1]);
          });
        }
        dispose() {
          H.off(this._scrollElement, ".bs.scrollspy"), super.dispose();
        }
        _getConfig(t2) {
          if ("string" != typeof (t2 = { ...ti, ...U.getDataAttributes(this._element), ..."object" == typeof t2 && t2 ? t2 : {} }).target && a(t2.target)) {
            let { id: i2 } = t2.target;
            i2 || (i2 = e("scrollspy"), t2.target.id = i2), t2.target = "#" + i2;
          }
          return d("scrollspy", t2, ei), t2;
        }
        _getScrollTop() {
          return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
        }
        _getScrollHeight() {
          return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        }
        _getOffsetHeight() {
          return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
        }
        _process() {
          const t2 = this._getScrollTop() + this._config.offset, e2 = this._getScrollHeight(), i2 = this._config.offset + e2 - this._getOffsetHeight();
          if (this._scrollHeight !== e2 && this.refresh(), t2 >= i2) {
            const t3 = this._targets[this._targets.length - 1];
            this._activeTarget !== t3 && this._activate(t3);
          } else {
            if (this._activeTarget && t2 < this._offsets[0] && this._offsets[0] > 0) return this._activeTarget = null, void this._clear();
            for (let e3 = this._offsets.length; e3--; ) this._activeTarget !== this._targets[e3] && t2 >= this._offsets[e3] && (void 0 === this._offsets[e3 + 1] || t2 < this._offsets[e3 + 1]) && this._activate(this._targets[e3]);
          }
        }
        _activate(e2) {
          this._activeTarget = e2, this._clear();
          const i2 = this._selector.split(",").map((t2) => `${t2}[data-bs-target="${e2}"],${t2}[href="${e2}"]`), n2 = t.findOne(i2.join(","));
          n2.classList.contains("dropdown-item") ? (t.findOne(".dropdown-toggle", n2.closest(".dropdown")).classList.add("active"), n2.classList.add("active")) : (n2.classList.add("active"), t.parents(n2, ".nav, .list-group").forEach((e3) => {
            t.prev(e3, ".nav-link, .list-group-item").forEach((t2) => t2.classList.add("active")), t.prev(e3, ".nav-item").forEach((e4) => {
              t.children(e4, ".nav-link").forEach((t2) => t2.classList.add("active"));
            });
          })), H.trigger(this._scrollElement, "activate.bs.scrollspy", { relatedTarget: e2 });
        }
        _clear() {
          t.find(this._selector).filter((t2) => t2.classList.contains("active")).forEach((t2) => t2.classList.remove("active"));
        }
        static jQueryInterface(t2) {
          return this.each(function() {
            const e2 = ii.getInstance(this) || new ii(this, "object" == typeof t2 ? t2 : {});
            if ("string" == typeof t2) {
              if (void 0 === e2[t2]) throw new TypeError(`No method named "${t2}"`);
              e2[t2]();
            }
          });
        }
      }
      H.on(window, "load.bs.scrollspy.data-api", () => {
        t.find('[data-bs-spy="scroll"]').forEach((t2) => new ii(t2));
      }), b(ii);
      class ni extends R {
        static get NAME() {
          return "tab";
        }
        show() {
          if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains("active")) return;
          let e2;
          const i2 = s(this._element), n2 = this._element.closest(".nav, .list-group");
          if (n2) {
            const i3 = "UL" === n2.nodeName || "OL" === n2.nodeName ? ":scope > li > .active" : ".active";
            e2 = t.find(i3, n2), e2 = e2[e2.length - 1];
          }
          const o2 = e2 ? H.trigger(e2, "hide.bs.tab", { relatedTarget: this._element }) : null;
          if (H.trigger(this._element, "show.bs.tab", { relatedTarget: e2 }).defaultPrevented || null !== o2 && o2.defaultPrevented) return;
          this._activate(this._element, n2);
          const r2 = () => {
            H.trigger(e2, "hidden.bs.tab", { relatedTarget: this._element }), H.trigger(this._element, "shown.bs.tab", { relatedTarget: e2 });
          };
          i2 ? this._activate(i2, i2.parentNode, r2) : r2();
        }
        _activate(e2, i2, n2) {
          const s2 = (!i2 || "UL" !== i2.nodeName && "OL" !== i2.nodeName ? t.children(i2, ".active") : t.find(":scope > li > .active", i2))[0], o2 = n2 && s2 && s2.classList.contains("fade"), r2 = () => this._transitionComplete(e2, s2, n2);
          s2 && o2 ? (s2.classList.remove("show"), this._queueCallback(r2, e2, true)) : r2();
        }
        _transitionComplete(e2, i2, n2) {
          if (i2) {
            i2.classList.remove("active");
            const e3 = t.findOne(":scope > .dropdown-menu .active", i2.parentNode);
            e3 && e3.classList.remove("active"), "tab" === i2.getAttribute("role") && i2.setAttribute("aria-selected", false);
          }
          e2.classList.add("active"), "tab" === e2.getAttribute("role") && e2.setAttribute("aria-selected", true), m(e2), e2.classList.contains("fade") && e2.classList.add("show");
          let s2 = e2.parentNode;
          if (s2 && "LI" === s2.nodeName && (s2 = s2.parentNode), s2 && s2.classList.contains("dropdown-menu")) {
            const i3 = e2.closest(".dropdown");
            i3 && t.find(".dropdown-toggle", i3).forEach((t2) => t2.classList.add("active")), e2.setAttribute("aria-expanded", true);
          }
          n2 && n2();
        }
        static jQueryInterface(t2) {
          return this.each(function() {
            const e2 = w.get(this, "bs.tab") || new ni(this);
            if ("string" == typeof t2) {
              if (void 0 === e2[t2]) throw new TypeError(`No method named "${t2}"`);
              e2[t2]();
            }
          });
        }
      }
      H.on(document, "click.bs.tab.data-api", '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]', function(t2) {
        ["A", "AREA"].includes(this.tagName) && t2.preventDefault(), u(this) || (w.get(this, "bs.tab") || new ni(this)).show();
      }), b(ni);
      const si = { animation: "boolean", autohide: "boolean", delay: "number" }, oi = { animation: true, autohide: true, delay: 5e3 };
      class ri extends R {
        constructor(t2, e2) {
          super(t2), this._config = this._getConfig(e2), this._timeout = null, this._hasMouseInteraction = false, this._hasKeyboardInteraction = false, this._setListeners();
        }
        static get DefaultType() {
          return si;
        }
        static get Default() {
          return oi;
        }
        static get NAME() {
          return "toast";
        }
        show() {
          H.trigger(this._element, "show.bs.toast").defaultPrevented || (this._clearTimeout(), this._config.animation && this._element.classList.add("fade"), this._element.classList.remove("hide"), m(this._element), this._element.classList.add("showing"), this._queueCallback(() => {
            this._element.classList.remove("showing"), this._element.classList.add("show"), H.trigger(this._element, "shown.bs.toast"), this._maybeScheduleHide();
          }, this._element, this._config.animation));
        }
        hide() {
          this._element.classList.contains("show") && (H.trigger(this._element, "hide.bs.toast").defaultPrevented || (this._element.classList.remove("show"), this._queueCallback(() => {
            this._element.classList.add("hide"), H.trigger(this._element, "hidden.bs.toast");
          }, this._element, this._config.animation)));
        }
        dispose() {
          this._clearTimeout(), this._element.classList.contains("show") && this._element.classList.remove("show"), super.dispose();
        }
        _getConfig(t2) {
          return t2 = { ...oi, ...U.getDataAttributes(this._element), ..."object" == typeof t2 && t2 ? t2 : {} }, d("toast", t2, this.constructor.DefaultType), t2;
        }
        _maybeScheduleHide() {
          this._config.autohide && (this._hasMouseInteraction || this._hasKeyboardInteraction || (this._timeout = setTimeout(() => {
            this.hide();
          }, this._config.delay)));
        }
        _onInteraction(t2, e2) {
          switch (t2.type) {
            case "mouseover":
            case "mouseout":
              this._hasMouseInteraction = e2;
              break;
            case "focusin":
            case "focusout":
              this._hasKeyboardInteraction = e2;
          }
          if (e2) return void this._clearTimeout();
          const i2 = t2.relatedTarget;
          this._element === i2 || this._element.contains(i2) || this._maybeScheduleHide();
        }
        _setListeners() {
          H.on(this._element, "click.dismiss.bs.toast", '[data-bs-dismiss="toast"]', () => this.hide()), H.on(this._element, "mouseover.bs.toast", (t2) => this._onInteraction(t2, true)), H.on(this._element, "mouseout.bs.toast", (t2) => this._onInteraction(t2, false)), H.on(this._element, "focusin.bs.toast", (t2) => this._onInteraction(t2, true)), H.on(this._element, "focusout.bs.toast", (t2) => this._onInteraction(t2, false));
        }
        _clearTimeout() {
          clearTimeout(this._timeout), this._timeout = null;
        }
        static jQueryInterface(t2) {
          return this.each(function() {
            let e2 = w.get(this, "bs.toast");
            if (e2 || (e2 = new ri(this, "object" == typeof t2 && t2)), "string" == typeof t2) {
              if (void 0 === e2[t2]) throw new TypeError(`No method named "${t2}"`);
              e2[t2](this);
            }
          });
        }
      }
      return b(ri), { Alert: B, Button: W, Carousel: Q, Collapse: J, Dropdown: we, Modal: Ie, Offcanvas: Me, Popover: Je, ScrollSpy: ii, Tab: ni, Toast: ri, Tooltip: Xe };
    });
  }
});
export default require_bootstrap_bundle_min();
/*! Bundled license information:

bootstrap/dist/js/bootstrap.bundle.min.js:
  (*!
    * Bootstrap v5.0.1 (https://getbootstrap.com/)
    * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
    * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    *)
*/
//# sourceMappingURL=bootstrap_dist_js_bootstrap__bundle__min__js.js.map
