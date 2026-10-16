<script lang="ts">
  import { getAll, yeet } from "./remote";
  let { sessions, current } = await getAll();
</script>

<a href="/">gå till startsidan</a>

<hr />

<h1>aktiva inloggningar</h1>

<ol>
  {#each sessions as session}
    <li>
      <form {...yeet.for(session.id)}>
        <button>
          {"ta bort " + (session.id == current
            ? "nuvarande"
            : "annan inloggning")}
        </button>
      </form>
    </li>
  {/each}
</ol>
