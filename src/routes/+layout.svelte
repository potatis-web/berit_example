<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
    import { logout } from './remote';

	let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div>
    <a href="/">gå till motioner</a>
    <a href="/auth">gå till auth</a>
    <div>
      
      {#if data.name}
        
        <p>{data.name}</p>
        <button onclick={async () => await logout()}>log out</button>
      {:else}
        <p>ej inloggad</p>
      {/if}
    </div>
</div>

{@render children()}
