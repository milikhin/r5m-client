!function(t){"use strict";var i=function(t,i){this.element=t,this.type=i};i.prototype={add:function(t){this.callback=t,this.element.addEventListener(this.type,this.callback,!1)},remove:function(){this.element.removeEventListener(this.type,this.callback,!1)}};var n=function(t){this.element=t,this.transitionEnd=this.whichTransitionEnd(),this.event=new i(this.element,this.transitionEnd)};n.prototype={whichTransitionEnd:function(){var t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var i in t)if(void 0!==this.element.style[i])return t[i]},bind:function(t){this.event.add(t)},unbind:function(){this.event.remove()}};var e={list:[],getPosition:function(t){if(Array.prototype.indexOf)return this.list.indexOf(t);for(var i=0,n=this.list.length;n>i;i++)if(this.list[i]===t)return i;return-1},insert:function(t){var i=this.getPosition(t),e=-1!==i;return e||(this.list.push(t),this.list.push(new n(t)),i=this.getPosition(t)),this.list[i+1]}};t.transitionEnd=function(t){if(!t)throw"You need to pass an element as parameter!";var i=t[0]||t,n=e.insert(i);return n}}(window);