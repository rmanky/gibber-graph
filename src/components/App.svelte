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

<style>
</style>

<main>
  {#if !user.loggedIn}
  
    <div class="wrapper fadeInDown">
  <div class="card text-center">
  <div class="card-body">
    <h5 class="card-title display-4">Gibber Graph</h5>
    <p class="card-text">Gibberish <i class="fas fa-heart" style="color: red;"></i> LiteGraph<br></p>
    <a href="/auth/github" class="btn btn-primary">Login with Github <i class="fab fa-github" ></a>
  </div>
  <div class="card-footer text-muted">
    <a target="_blank" href="https://github.com/rmanky">Robear Mankaryous</a>, 
    <a target="_blank" href="https://github.com/afsimoneau">Alexander Simoneau</a>,
    <a target="_blank" href="https://github.com/kylemikableh">Kyle Mikolajczyk</a>,
    <a target = "_blank" href = "https://github.com/afreglett">Alexa Freglette 
  </div>
</div>
    </div>
    
  {/if}
  {#if user.loggedIn}
    <LiteGraph {user}/>
  {/if} 
</main>
