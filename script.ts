(async () => {
   const apiKey = "XjVJqqCc4zaj9K8hW8ZL2CwYekN8nuJQ";
   const searchQuery = "cat";

   const searchEndpoint = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchQuery}`;

   fetch(searchEndpoint)
      .then((response) => response.json())
      .then((data) => console.log(data));
})();
