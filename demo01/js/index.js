//Vue.directive('select', {
//	twoWay: true,
//	priority: 1000,
//	params: ['options'],
//	bind: function() {
//		var self = this
//		$(this.el)
//			.select2({
//				data: this.params.options
//			})
//			.on('change', function() {
//				self.set(this.value)
//			})
//	},
//	update: function(value) {
//		$(this.el).val(value).trigger('change')
//	},
//	unbind: function() {
//		$(this.el).off().select2('destroy')
//	}
//});

var vm = new Vue({
	el: '#main',
	data: {
		site: true,
		selected: 0,
		options: [{
			id: 1,
			text: 'hello'
		}, {
			id: 2,
			text: 'what'
		}],
		currentView: 'home'
	},
	methods: {
		cut: function(location) {
			if (location) {
//				this.site = location;
				$('.bottom-line').addClass('bottom-line-left');
				$('.bottom-line').removeClass('bottom-line-right');
				this.currentView = 'home';
			} else {
//				this.site = location;
				$('.bottom-line').removeClass('bottom-line-left');
				$('.bottom-line').addClass('bottom-line-right');
				this.currentView = 'posts';
			}
		}
	},
	created: function() {

	},
	components: {
		home: {
			template: '<div class="left-content">'
						+ ' <div class="wipe" id="wipe1"></div>'
						+ '<div class="wipe" id="wipe2"></div>'
						+ '<div class="wipe" id="wipe3"></div>'
					+ '{{index}}</div>',
			props: ['index'],
			data: function(){
				return {
					name: 'Simon'
				}
			}
		},
		posts: {
			template: '<div class="right-content">'
						+ '<h1 class="ribbon">'
						+ '   <strong class="ribbon-content">Everybody loves ribbons</strong>'
						+ '</h1>'
					+ '</div>'
		},
    	archive: {
    		template: '<div>这是一个组件3</div>'
    	}
	}
});

$(function() {

});