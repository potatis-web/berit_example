<script lang="ts">
  import { register } from "./remote";
  import { login } from "./a.remote";
  const { name: nameRegister, password: passwordRegister } = register.fields;
  const { name: nameLogin, password: passwordLogin } = login.fields;
</script>

<h1>Registrera</h1>

<form {...register}>
  <input {...nameRegister.as("text")} placeholder="namn" />
  <input {...passwordRegister.as("password")} placeholder="lösenord" />

  <button>Registrera</button>
</form>

<h1>Logga in</h1>

<form {...login}>
  <input {...nameLogin.as("text")} placeholder="namn" />
  <input {...passwordLogin.as("password")} placeholder="lösenord" />

  <button>Logga in</button>
</form>