import { writable } from 'svelte/store';

export let extensionSettings = writable([
  "enableExtension",
]);