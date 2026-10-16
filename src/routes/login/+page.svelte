<script lang="ts">
  import { login } from "./remote";
  const { phone, password } = login.fields;
</script>

<form {...login}>
  <input {...phone.as("text")} placeholder="telefonnummer" />
  <input {...password.as("password")} placeholder="lösenord" />

  <button>Logga in</button>
</form>

<a href="/register">Registrera nytt konto</a>
