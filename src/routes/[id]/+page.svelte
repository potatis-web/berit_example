<script lang="ts">
  import { create, getItem, getCount } from "./remote";
  import { vote } from "./common";
  const { votes, id } = create.fields;
  const { params } = $props();
  const motion = $derived(await getItem(params.id));
  const count = $derived(await getCount(params.id));

</script>

<h1>motion: {motion.text}</h1>

<form {...create}>
  {#each vote as votingOption (votingOption)}
    <label>
      <input {...votes.as("radio", votingOption)}> Jag röstar {votingOption} motionen
    </label>
    <br>
  {/each}
  <input {...id.as("hidden", params.id)} />
  <br>
  <button>rösta</button>
</form>

<h2>Totala röster: {count.all}</h2>
<h2>Rösternas värde: {count.value}</h2>
<h2>Röster:</h2>
<ol>
  {#each motion.votes as vote}
    <li>"{vote.user.name}" röstar {vote.value > 0 ? "för" : "emot"} motionen</li>
  {/each}
</ol>
