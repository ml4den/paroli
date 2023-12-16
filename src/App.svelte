<script>
  import Generator from './lib/Generator.svelte'
</script>

<main>
  <h1>Български генератор на пароли</h1>

  <p>
    Генерирайте сигурни, запомнящи се пароли на български език.
  </p>

  <Generator />
  <p style="font-size: small;">
    <!-- Текст генериран от AI: -->
    Този генератор използва списък с думи и случайни числа за създаване на пароли.
  </p>
  <p style="font-size: small;">
    Това е Svelte проект написан почти изцяло от AI.
  </p>
</main>


<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    font-size: 3rem;
    font-weight: 100  ;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
