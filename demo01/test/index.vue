<template id="some-tpl"> 
	{{ title }}
</template> 

<script>
	var vm1 = new Vue {
		el: '#some-tpl',
		data: {
			title: {
				title: '标题'
			}
		}
	}
</script>