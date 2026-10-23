<script lang="ts">
  import { getAll, create } from "./remote";
  const { text } = create.fields;
</script>

<form {...create}>
  <input {...text.as("text")} placeholder="beskrivning" />

  <button>ny motion</button>
</form>

<ol>
  {#each await getAll() as motion}
    <li>
      <a href="/{motion.id}"
        >Motion: {motion.text}</a
      >
    </li>
  {/each}
</ol>

