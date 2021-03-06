// Awesomplete - Lea Verou - MIT license
"use strict";

(function () {
  function m(a, b) {
    for (var c in a) {
      var g = a[c],
          e = this.input.getAttribute("data-" + c.toLowerCase());this[c] = "number" === typeof g ? parseInt(e) : !1 === g ? null !== e : g instanceof Function ? null : e;this[c] || 0 === this[c] || (this[c] = c in b ? b[c] : g);
    }
  }function d(a, b) {
    return "string" === typeof a ? (b || document).querySelector(a) : a || null;
  }function h(a, b) {
    return k.call((b || document).querySelectorAll(a));
  }function l() {
    h("input.awesomplete").forEach(function (a) {
      new Awesomplete(a);
    });
  }var f = function f(a, b) {
    var c = this;this.input = d(a);this.input.setAttribute("autocomplete", "off");this.input.setAttribute("aria-autocomplete", "list");b = b || {};m.call(this, { minChars: 2, maxItems: 10, autoFirst: !1, filter: f.FILTER_CONTAINS, sort: f.SORT_BYLENGTH, item: function item(a, b) {
        return d.create("li", { innerHTML: a.replace(RegExp(d.regExpEscape(b.trim()), "gi"), "<mark>$&</mark>"), "aria-selected": "false" });
      }, replace: function replace(a) {
        this.input.value = a;
      } }, b);this.index = -1;this.container = d.create("div", { className: "awesomplete", around: a });this.ul = d.create("ul", { hidden: "",
      inside: this.container });this.status = d.create("span", { className: "visually-hidden", role: "status", "aria-live": "assertive", "aria-relevant": "additions", inside: this.container });d.bind(this.input, { input: this.evaluate.bind(this), blur: this.close.bind(this), keydown: function keydown(a) {
        var b = a.keyCode;if (c.opened) if (13 === b && c.selected) a.preventDefault(), c.select();else if (27 === b) c.close();else if (38 === b || 40 === b) a.preventDefault(), c[38 === b ? "previous" : "next"]();
      } });d.bind(this.input.form, { submit: this.close.bind(this) });
    d.bind(this.ul, { mousedown: function mousedown(a) {
        a = a.target;if (a !== this) {
          for (; a && !/li/i.test(a.nodeName);) a = a.parentNode;a && c.select(a);
        }
      } });this.input.hasAttribute("list") ? (this.list = "#" + a.getAttribute("list"), a.removeAttribute("list")) : this.list = this.input.getAttribute("data-list") || b.list || [];f.all.push(this);
  };f.prototype = Object.defineProperties({ close: function close() {
      this.ul.setAttribute("hidden", "");this.index = -1;d.fire(this.input, "awesomplete-close");
    }, open: function open() {
      this.ul.removeAttribute("hidden");this.autoFirst && -1 === this.index && this.goto(0);d.fire(this.input, "awesomplete-open");
    }, next: function next() {
      this.goto(this.index < this.ul.children.length - 1 ? this.index + 1 : -1);
    }, previous: function previous() {
      var a = this.ul.children.length;this.goto(this.selected ? this.index - 1 : a - 1);
    }, goto: function goto(a) {
      var b = this.ul.children;this.selected && b[this.index].setAttribute("aria-selected", "false");this.index = a;-1 < a && 0 < b.length && (b[a].setAttribute("aria-selected", "true"), this.status.textContent = b[a].textContent);d.fire(this.input, "awesomplete-highlight");
    }, select: function select(a) {
      if (a = a || this.ul.children[this.index]) {
        var b;d.fire(this.input, "awesomplete-select", { text: a.textContent, preventDefault: function preventDefault() {
            b = !0;
          } });b || (this.replace(a.textContent), this.close(), d.fire(this.input, "awesomplete-selectcomplete"));
      }
    }, evaluate: function evaluate() {
      var a = this,
          b = this.input.value;b.length >= this.minChars && 0 < this._list.length ? (this.index = -1, this.ul.innerHTML = "", this._list.filter(function (c) {
        return a.filter(c, b);
      }).sort(this.sort).every(function (c, d) {
        a.ul.appendChild(a.item(c, b));return d < a.maxItems - 1;
      }), 0 === this.ul.children.length ? this.close() : this.open()) : this.close();
    } }, {
    list: {
      set: function set(a) {
        Array.isArray(a) ? this._list = a : "string" === typeof a && -1 < a.indexOf(",") ? this._list = a.split(/\s*,\s*/) : (a = d(a)) && a.children && (this._list = k.apply(a.children).map(function (a) {
          return a.textContent.trim();
        }));
        document.activeElement === this.input && this.evaluate();
      },
      configurable: true,
      enumerable: true
    },
    selected: {
      get: function get() {
        return -1 < this.index;
      },
      configurable: true,
      enumerable: true
    },
    opened: {
      get: function get() {
        return this.ul && null == this.ul.getAttribute("hidden");
      },
      configurable: true,
      enumerable: true
    }
  });f.all = [];f.FILTER_CONTAINS = function (a, b) {
    return RegExp(d.regExpEscape(b.trim()), "i").test(a);
  };
  f.FILTER_STARTSWITH = function (a, b) {
    return RegExp("^" + d.regExpEscape(b.trim()), "i").test(a);
  };f.SORT_BYLENGTH = function (a, b) {
    return a.length !== b.length ? a.length - b.length : a < b ? -1 : 1;
  };var k = Array.prototype.slice;d.create = function (a, b) {
    var c = document.createElement(a),
        g;for (g in b) {
      var e = b[g];"inside" === g ? d(e).appendChild(c) : "around" === g ? (e = d(e), e.parentNode.insertBefore(c, e), c.appendChild(e)) : g in c ? c[g] = e : c.setAttribute(g, e);
    }return c;
  };d.bind = function (a, b) {
    if (a) for (var c in b) {
      var d = b[c];c.split(/\s+/).forEach(function (b) {
        a.addEventListener(b, d);
      });
    }
  };d.fire = function (a, b, c) {
    var d = document.createEvent("HTMLEvents");d.initEvent(b, !0, !0);for (var e in c) d[e] = c[e];a.dispatchEvent(d);
  };d.regExpEscape = function (a) {
    return a.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
  };"undefined" !== typeof Document && ("loading" !== document.readyState ? l() : document.addEventListener("DOMContentLoaded", l));f.$ = d;f.$$ = h;"undefined" !== typeof self && (self.Awesomplete = f);"object" === typeof exports && (module.exports = f);return f;
})();

//# sourceMappingURL=awesomplete.min-compiled.js.map