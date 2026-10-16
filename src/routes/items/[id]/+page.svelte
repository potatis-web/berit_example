<script lang="ts">
  import { create, getItem } from "./remote";
  const { price, itemId } = create.fields;
  const { params } = $props();
  const item = $derived(await getItem(params.id));
</script>

<h1>{item.description}, utgångspris: {item.asking_price}</h1>

<form {...create}>
  <input {...price.as("number")} placeholder="bud" />
  <input {...itemId.as("hidden", params.id)} />

  <button>nytt pris</button>
</form>

<ol>
  {#each item.bids as bid}
    <li>{bid.price}kr - {bid.creator?.name}</li>
  {/each}
</ol>
