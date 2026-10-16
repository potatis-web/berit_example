<script lang="ts">
  import { register } from "./remote";
  const { name, phone, password } = register.fields;
</script>

<form {...register}>
  <input {...phone.as("text")} placeholder="telefonnummer" />
  <input {...name.as("text")} placeholder="namn" />
  <input {...password.as("password")} placeholder="lösenord" />

  <button>Registrera</button>
</form>
