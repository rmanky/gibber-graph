<script>  
  import { onMount } from 'svelte';
  
  import LiteGraph from "./LiteGraph.svelte";
  
  let user = {
    loggedIn: false,
    username: "not logged in"
  };
  
  
  onMount(async () => {
    const res = await fetch("/auth/user", {credentials: 'include'});
    const results = await res.json();
    if (!results.failed) {
      user.loggedIn = true;
      user.username = results.username;
    } else {
      user.loggedIn = false;
      user.username = "";
    }
  });
</script>

<main>
  {#if !user.loggedIn}
    <p>
      Hello, please login!
    </p>
    <form class="form-inline" action="/auth/github">
      <button style="background-color: blue; color: white">
        Log In with GitHub
        <i class="fab fa-github" />
      </button>
    </form>
  {/if}
  {#if user.loggedIn}
  <h3>Hello,</h3>
  <h1 id="username">{user.username}</h1>
    <form class="form-inline" action="/auth/logout">
      <button style="background-color: red">
        Log Out
        <i class="fab fa-github" />
      </button>
    </form>
  
   <label for="dropdown">Dropdown:</label>
  <select name="previous_graphs" id="dropdown" onchange="loadStuff(this.value)">
    <option value="graph1">Graph1</option>

    </select> 
    <LiteGraph />
  {/if} 
</main>
