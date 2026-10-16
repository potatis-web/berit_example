<script lang="ts">
  import { getAll, create } from "./remote";
  const { text, cost } = create.fields;
</script>

<form {...create}>
  <input {...text.as("text")} placeholder="beskrivning" />
  <input {...cost.as("number")} placeholder="önskat pris" />

  <button>ny auktion</button>
</form>

<ol>
  {#each await getAll() as auction}
    <li>
      <a href="/items/{auction.id}"
        >{auction.description} - {auction.asking_price}kr</a
      >
    </li>
  {/each}
</ol>
