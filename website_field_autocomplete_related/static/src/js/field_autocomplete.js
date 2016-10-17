/* Copyright 2016 LasLabs Inc.
 * License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
 */

odoo.define('website_field_autocomplete_related.field_autocomplete', function(require){
  "use strict";

  var snippet_animation = require('web_editor.snippets.animation');
  var $ = require('$');

  snippet_animation.registry.field_autocomplete = snippet_animation.registry.field_autocomplete.extend({

    $related: false,
    data: {},

    autocomplete: function(request, response) {
      var self = this;
      return this._super(request, response).then(function(records) {
        self.data = {};
        for (var i = 0, len = records.length; i < len; i++) {
          var record = records[i];
          self.data[record.id] = record;
        }
        return records;
      });
    },
    
    /* Update text in related fields
     * @param event Event obj
     * @param ui obj {'value': str, 'label': str}
     */
    autocompleteselect: function(event, ui) {
      event.preventDefault();
      if (!this.$related) {
        return;
      }
      var record = this.data[ui.item.value];
      this.$related.each(function(){
        var fieldName = $(this).data('query-field') || this.name;
        $(this).val(record[fieldName] || '');
      });
    },
    
    start: function() {
      this._super();
      var self = this;
      if (this.valueField != 'id') {
        this.valueField = 'id';
        this.fields.push('id');
      }
      var relationGroup = this.$target.data('relate-group');
      if (relationGroup) {
        this.$related = $('*[data-relate-group="' + relationGroup + '"]');
        this.$related.each(function() {
          self.fields.push($(this).data('query-field') || this.name);
        });
        this.$target.on('autocompleteselect', function(event, ui) {
          self.autocompleteselect(event, ui);
        });
      }
    },
    
  });
    
  return {field_autocomplete: snippet_animation.registry.field_autocomplete};

});
