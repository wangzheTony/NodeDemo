Vue.directive('select', {
	twoWay: true,
	priority: 1000,
	params: ['options'],
	bind: function(){
		var self = this
		$(this.el)
		.select2({
			data: this.params.options
		})
		.on('change', function(){
			self.set(this.value)
		})
	},
	update: function(value){
		$(this.el).val(value).trigger('change')
	},
	unbind: function () {
		$(this.el).off().select2('destroy')
	}
});

var vm = new Vue({
	el: '#main',
	data: {
		site: true,
		selected: 0,
		options: [
			{id: 1, text: 'hello'},
			{id: 2, text: 'what'}
		]
	},
	methods: {
		cut: function(location){
			if(location){
				this.site = location;
				$('.bottom-line').addClass('bottom-line-left');
				$('.bottom-line').removeClass('bottom-line-right');
			} else {
				this.site = location;
				$('.bottom-line').removeClass('bottom-line-left');
				$('.bottom-line').addClass('bottom-line-right');
			}
		}
	},
	created: function(){
		
	}
});


$(function(){
	
});
