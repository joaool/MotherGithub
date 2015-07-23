/*
  backgrid-text-cell
  http://github.com/wyuenho/backgrid

  Copyright (c) 2013 Jimmy Yuen Ho Wong and contributors
  Licensed under the MIT @license.
*/
"use strict";

!(function (a, b) {
  "object" == typeof exports ? module.exports = b(require("underscore"), require("backgrid")) : b(a._, a.Backgrid);
})(undefined, function (a, b) {
  var c = b.Extension.TextareaEditor = b.CellEditor.extend({ tagName: "div", className: "modal fade", template: function template(a) {
      return "<div class=\"modal-dialog\"><div class=\"modal-content\"><form><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button><h3>" + a.column.get("label") + "</h3></div><div class=\"modal-body\"><textarea cols=\"" + a.cols + "\" rows=\"" + a.rows + "\">" + a.content + "</textarea></div><div class=\"modal-footer\"><input class=\"btn btn-primary\" type=\"submit\" value=\"Save\"/></div></form></div></div>";
    }, cols: 80, rows: 10, events: { "keydown textarea": "clearError", submit: "saveOrCancel", "hide.bs.modal": "saveOrCancel", "hidden.bs.modal": "close", "shown.bs.modal": "focus" }, modalOptions: { backdrop: !1 }, render: function render() {
      return (this.$el.html($(this.template({ column: this.column, cols: this.cols, rows: this.rows, content: this.formatter.fromRaw(this.model.get(this.column.get("name"))) }))), this.delegateEvents(), this.$el.modal(this.modalOptions), this);
    }, saveOrCancel: function saveOrCancel(b) {
      b && "submit" == b.type && (b.preventDefault(), b.stopPropagation());var c = this.model,
          d = this.column,
          e = this.$el.find("textarea").val(),
          f = this.formatter.toRaw(e);a.isUndefined(f) ? (c.trigger("backgrid:error", c, d, e), b && (b.preventDefault(), b.stopPropagation())) : !b || "submit" == b.type || "hide" == b.type && f !== (this.model.get(this.column.get("name")) || "").replace(/\r/g, "") && confirm("Would you like to save your changes?") ? (c.set(d.get("name"), f), this.$el.modal("hide")) : "hide" != b.type && this.$el.modal("hide");
    }, clearError: a.debounce(function () {
      a.isUndefined(this.formatter.toRaw(this.$el.find("textarea").val())) || this.$el.parent().removeClass("error");
    }, 150), close: function close(a) {
      var c = this.model;c.trigger("backgrid:edited", c, this.column, new b.Command(a));
    }, focus: function focus() {
      this.$el.find("textarea").focus();
    } });b.Extension.TextCell = b.StringCell.extend({ className: "text-cell", editor: c });
});

//# sourceMappingURL=backgrid-text-cell.min-compiled.js.map