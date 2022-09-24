<script lang="ts">
	import { displayChapters, initialize, injectLinks } from '../static/Navigation';

	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  	if (request.message === 'TabUpdated') {
			let domain: string = window.location.hostname;
			domain = domain.replace('http://', '').replace('https://', '').replace('www.','').split(/[/?#]/)[0];
			
			if (domain.substring(0, 6) === "amazon") {
				injectLinks(domain);
				return;
			} else if (domain.substring(0, 7) !== "youtube") {
				return
			}

			let type: string = initialize();
			if (type === "video") {
				// do nothing
				displayChapters();
			}
  	}
	});
</script>