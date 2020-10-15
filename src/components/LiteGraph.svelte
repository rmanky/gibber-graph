<script>
  import { onMount } from 'svelte';
  
  import * as Editor from "../js/canvas.js";
  
  import * as Gibb from "../js/gibb.js";
  
  export let user;
  
  // $(document).ready(function(){
  //     $("#dropdown").on("click", function()
  //       $(this).append("<option>1</option><option>2</option>");
  //     });
  //   });
  
  onMount(async () => {
    Gibb.init();
    Editor.init(user);
   });
  
</script>

<style>
</style>

<div id="main">
</div>