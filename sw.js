const cacheName = self.location.pathname
const pages = [

  "/docs/section-1/",
    "/docs/section-1/section-2/",
    "/docs/section-1/section-2/leaf-page-1/",
    "/docs/section-1/section-2/leaf-page-2/",
    "/docs/section-1/section-3/",
    "/docs/section-1/section-3/leaf-page-1/",
    "/docs/section-1/section-3/leaf-page-2/",
    "/posts/blog-post-4/",
    "/tags/blog/",
    "/tags/post/",
    "/tags/",
    "/posts/blog-post-3/",
    "/posts/blog-post-2/",
    "/posts/blog-post-1/",
    "/",
    "/docs/",
    "/posts/",
    "/book.min.7dca40f168e2fd532b7b1937df678e5fcb9289577e924bd85f799138b6137fa6.css",
  "/en.search-data.min.7d61b62995eefe17aebdb27749ca34893eb8ba767079a66327b83e2d28096bf8.json",
  "/en.search.min.f6c544533dedc79b23472d5baa399ff9c5849545ed1e99d8b70efb8d8b345fb7.js",
  
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  caches.open(cacheName).then((cache) => {
    return cache.addAll(pages);
  });
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  /**
   * @param {Response} response
   * @returns {Promise<Response>}
   */
  function saveToCache(response) {
    if (cacheable(response)) {
      return caches
        .open(cacheName)
        .then((cache) => cache.put(request, response.clone()))
        .then(() => response);
    } else {
      return response;
    }
  }

  /**
   * @param {Error} error
   */
  function serveFromCache(error) {
    return caches.open(cacheName).then((cache) => cache.match(request.url));
  }

  /**
   * @param {Response} response
   * @returns {Boolean}
   */
  function cacheable(response) {
    return response.type === "basic" && response.ok && !response.headers.has("Content-Disposition")
  }

  event.respondWith(fetch(request).then(saveToCache).catch(serveFromCache));
});
