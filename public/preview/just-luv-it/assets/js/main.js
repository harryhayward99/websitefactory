(function () {
  var STORAGE_KEY = "jli-demo-basket-v1";
  var JLI = (window.JLI = window.JLI || {});

  function readBasket() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function writeBasket(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateBasketCount();
    renderBasket();
  }

  function basketCount(items) {
    return (items || readBasket()).reduce(function (sum, item) {
      return sum + item.qty;
    }, 0);
  }

  function basketTotal(items) {
    return (items || readBasket()).reduce(function (sum, item) {
      var product = JLI.getProduct(item.slug);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
  }

  function updateBasketCount() {
    var count = basketCount();
    document.querySelectorAll("[data-basket-count]").forEach(function (el) {
      el.textContent = String(count);
      el.hidden = count === 0;
    });
  }

  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  JLI.addToBasket = function (slug, qty) {
    qty = Math.max(1, Number(qty) || 1);
    var product = JLI.getProduct(slug);
    if (!product) return;
    var items = readBasket();
    var existing = items.find(function (item) {
      return item.slug === slug;
    });
    if (existing) existing.qty += qty;
    else items.push({ slug: slug, qty: qty });
    writeBasket(items);
    showToast("Added to basket — demo only");
    openPanel("basket");
  };

  JLI.removeFromBasket = function (slug) {
    writeBasket(
      readBasket().filter(function (item) {
        return item.slug !== slug;
      })
    );
  };

  JLI.setQty = function (slug, qty) {
    qty = Math.max(1, Number(qty) || 1);
    var items = readBasket().map(function (item) {
      if (item.slug === slug) item.qty = qty;
      return item;
    });
    writeBasket(items);
  };

  function productCard(product) {
    return (
      '<article class="product-card">' +
      '<a class="product-media" href="product.html?slug=' +
      encodeURIComponent(product.slug) +
      '">' +
      '<img src="' +
      product.image +
      '" alt="' +
      escapeHtml(product.fullName) +
      '" loading="lazy" />' +
      "</a>" +
      '<div class="product-meta">' +
      "<h3><a href=\"product.html?slug=" +
      encodeURIComponent(product.slug) +
      '">' +
      escapeHtml(product.name) +
      "</a></h3>" +
      '<div class="product-row">' +
      '<span class="price">' +
      JLI.formatPrice(product.price) +
      "</span>" +
      '<button type="button" class="btn btn-ghost" data-add="' +
      product.slug +
      '" style="padding:0.45rem 0.85rem;font-size:0.85rem">Add</button>' +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  JLI.renderProductGrid = function (target, products) {
    var el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    if (!products.length) {
      el.innerHTML = '<p class="basket-empty">No products match that filter.</p>';
      return;
    }
    el.innerHTML = products.map(productCard).join("");
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderBasket() {
    var list = document.getElementById("basket-items");
    var total = document.getElementById("basket-total");
    if (!list) return;
    var items = readBasket();
    if (!items.length) {
      list.innerHTML = '<p class="basket-empty">Your demo basket is empty.</p>';
      if (total) total.textContent = JLI.formatPrice(0);
      return;
    }
    list.innerHTML = items
      .map(function (item) {
        var product = JLI.getProduct(item.slug);
        if (!product) return "";
        return (
          '<div class="basket-item">' +
          '<img src="' +
          product.image +
          '" alt="" />' +
          "<div>" +
          "<h3>" +
          escapeHtml(product.name) +
          "</h3>" +
          "<p>" +
          item.qty +
          " × " +
          JLI.formatPrice(product.price) +
          "</p>" +
          "</div>" +
          '<button type="button" class="basket-remove" data-remove="' +
          product.slug +
          '">Remove</button>' +
          "</div>"
        );
      })
      .join("");
    if (total) total.textContent = JLI.formatPrice(basketTotal(items));
  }

  function renderSearchResults(query) {
    var box = document.getElementById("search-results");
    if (!box) return;
    query = (query || "").trim();
    if (!query) {
      box.innerHTML = '<p class="basket-empty">Type to search this curated selection.</p>';
      return;
    }
    var matches = JLI.filterProducts({ query: query }).slice(0, 8);
    if (!matches.length) {
      box.innerHTML = '<p class="basket-empty">No matches in the demo catalogue.</p>';
      return;
    }
    box.innerHTML = matches
      .map(function (product) {
        return (
          '<a class="search-result" href="product.html?slug=' +
          encodeURIComponent(product.slug) +
          '">' +
          '<img src="' +
          product.image +
          '" alt="" />' +
          "<div><strong>" +
          escapeHtml(product.name) +
          "</strong><div class=\"price\">" +
          JLI.formatPrice(product.price) +
          "</div></div>" +
          "</a>"
        );
      })
      .join("");
  }

  function openPanel(name) {
    closePanels();
    var panel = document.getElementById(name + "-panel");
    if (!panel) return;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var focusable = panel.querySelector("input, button, a");
    if (focusable) focusable.focus();
  }

  function closePanels() {
    ["search", "basket", "nav"].forEach(function (name) {
      var panel = document.getElementById(name + "-panel");
      if (!panel) return;
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
    });
    document.body.style.overflow = "";
  }

  function bindGlobalUi() {
    document.querySelectorAll("[data-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openPanel(btn.getAttribute("data-open"));
      });
    });

    document.querySelectorAll("[data-close]").forEach(function (btn) {
      btn.addEventListener("click", closePanels);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePanels();
    });

    document.body.addEventListener("click", function (e) {
      var add = e.target.closest("[data-add]");
      if (add) {
        e.preventDefault();
        JLI.addToBasket(add.getAttribute("data-add"), 1);
        return;
      }
      var remove = e.target.closest("[data-remove]");
      if (remove) {
        JLI.removeFromBasket(remove.getAttribute("data-remove"));
      }
    });

    var searchInput = document.getElementById("global-search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        renderSearchResults(searchInput.value);
      });
    }

    var checkout = document.getElementById("demo-checkout");
    if (checkout) {
      checkout.addEventListener("click", function () {
        showToast("Checkout is simulated in this preview");
      });
    }
  }

  function markCurrentNav() {
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === path) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function initHeroTypes() {
    var root = document.getElementById("hero-types");
    var pairEl = document.getElementById("hero-types-pair");
    var prevBtn = document.getElementById("hero-types-prev");
    var nextBtn = document.getElementById("hero-types-next");
    if (!root || !pairEl || !window.JLI || !JLI.getProduct) return;

    function productImage(slug) {
      var p = JLI.getProduct(slug);
      return p ? p.image : "";
    }

    var types = [
      {
        id: "garden",
        label: "Garden",
        href: "shop.html?category=garden",
        image: productImage("colin-cockerel"),
        note: "Wire ornaments & outdoor finds"
      },
      {
        id: "home",
        label: "Home",
        href: "shop.html?category=home",
        image: productImage("aqua-fruit-bowl"),
        note: "Bowls, glass & tableware"
      },
      {
        id: "decorations",
        label: "Decorations",
        href: "shop.html?category=decorations",
        image: productImage("ziggy-sheep"),
        note: "Felt characters & hanging pieces"
      },
      {
        id: "seasonal",
        label: "Seasonal",
        href: "shop.html?category=seasonal",
        image: productImage("harvey-hamster"),
        note: "Christmas gifts ready to wrap"
      },
      {
        id: "gifts",
        label: "Gifts",
        href: "shop.html?category=gifts",
        image: productImage("freya-goose"),
        note: "Thoughtful handmade presents"
      }
    ].filter(function (t) {
      return t.image;
    });

    if (types.length < 3) return;

    var visible = 3;
    var startIndex = 0;
    var timer = null;
    var animating = false;
    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function typeAt(index) {
      return types[((index % types.length) + types.length) % types.length];
    }

    function cardHtml(type) {
      return (
        '<a class="hero-type-card" href="' +
        type.href +
        '">' +
        '<img src="' +
        type.image +
        '" alt="" width="320" height="320" loading="lazy" />' +
        "<span>" +
        type.label +
        "</span>" +
        "</a>"
      );
    }

    function paint(count) {
      count = count || visible;
      var html = "";
      for (var i = 0; i < count; i++) {
        html += cardHtml(typeAt(startIndex + i));
      }
      pairEl.innerHTML = html;
      pairEl.classList.remove("is-sliding");
      pairEl.style.transform = "translateX(0)";
    }

    function stepDistance() {
      var card = pairEl.querySelector(".hero-type-card");
      if (!card) return 0;
      var styles = window.getComputedStyle(pairEl);
      var gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return card.getBoundingClientRect().width + gap;
    }

    function finishSlide(nextStart) {
      startIndex = ((nextStart % types.length) + types.length) % types.length;
      paint(visible);
      animating = false;
    }

    function showSet(nextStart, direction) {
      if (animating) return;
      animating = true;
      var dir = direction >= 0 ? 1 : -1;

      if (reduceMotion) {
        finishSlide(nextStart);
        return;
      }

      var distance = stepDistance();
      if (!distance) {
        finishSlide(nextStart);
        return;
      }

      if (dir > 0) {
        pairEl.insertAdjacentHTML("beforeend", cardHtml(typeAt(startIndex + visible)));
        pairEl.classList.remove("is-sliding");
        pairEl.style.transform = "translateX(0)";
        void pairEl.offsetWidth;
        pairEl.classList.add("is-sliding");
        pairEl.style.transform = "translateX(-" + distance + "px)";
      } else {
        pairEl.insertAdjacentHTML("afterbegin", cardHtml(typeAt(startIndex - 1)));
        pairEl.classList.remove("is-sliding");
        pairEl.style.transform = "translateX(-" + distance + "px)";
        void pairEl.offsetWidth;
        pairEl.classList.add("is-sliding");
        pairEl.style.transform = "translateX(0)";
      }

      var settled = false;
      function settle() {
        if (settled) return;
        settled = true;
        pairEl.removeEventListener("transitionend", onEnd);
        window.clearTimeout(fallback);
        finishSlide(nextStart);
      }

      function onEnd(event) {
        if (event.target !== pairEl || event.propertyName !== "transform") return;
        settle();
      }

      pairEl.addEventListener("transitionend", onEnd);
      var fallback = window.setTimeout(settle, 520);
    }

    function clearTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function startTimer() {
      clearTimer();
      timer = setInterval(function () {
        showSet(startIndex + 1, 1);
      }, 10000);
    }

    paint(visible);
    startTimer();

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        showSet(startIndex - 1, -1);
        startTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        showSet(startIndex + 1, 1);
        startTimer();
      });
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) clearTimer();
      else startTimer();
    });
  }

  function initHeroShopArrow() {
    var arrow = document.querySelector(".hero-shop-arrow");
    if (!arrow) return;
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      arrow.classList.add("is-ready", "is-body-drawn", "is-drawn");
      return;
    }
    window.setTimeout(function () {
      arrow.classList.add("is-ready");
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          arrow.classList.add("is-body-drawn");
          window.setTimeout(function () {
            arrow.classList.add("is-drawn");
          }, 1150);
        });
      });
    }, 3000);
  }

  function starsHtml(count) {
    var n = Math.max(0, Math.min(5, count || 5));
    var html = "";
    for (var i = 0; i < n; i++) {
      html +=
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.6 14.7 9l6 .9-4.3 4.2 1 5.9L12 17.3 6.6 20l1-5.9L3.3 9.9l6-.9L12 3.6Z"/></svg>';
    }
    return html;
  }

  function googleMarkHtml() {
    return (
      '<svg class="reviews-google-mark" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"/>' +
      '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"/>' +
      '<path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.72.13-1.42.36-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z"/>' +
      '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"/>' +
      "</svg>"
    );
  }

  function initSiteReviews() {
    var roots = document.querySelectorAll("[data-reviews-root]");
    if (!roots.length || !JLI.reviews || !JLI.reviews.length) return;
    var meta = JLI.reviewsMeta || { rating: 5, count: JLI.reviews.length };
    var list = JLI.reviews;

    roots.forEach(function (root) {
      var index = 0;
      root.innerHTML =
        '<div class="reviews-panel">' +
        '<div class="reviews-summary">' +
        '<div class="reviews-summary-brand">' +
        googleMarkHtml() +
        "<strong>Just Luv It</strong>" +
        "</div>" +
        '<div class="reviews-score-row">' +
        '<span class="reviews-score">' +
        Number(meta.rating).toFixed(1) +
        "</span>" +
        '<span class="reviews-stars" aria-hidden="true">' +
        starsHtml(meta.rating) +
        "</span>" +
        "</div>" +
        '<p class="reviews-count">Based on ' +
        meta.count +
        " reviews</p>" +
        '<p class="reviews-source">' +
        (meta.sourceNote || "Customer reviews from Google") +
        "</p>" +
        "</div>" +
        '<div class="reviews-carousel">' +
        '<button class="reviews-nav" type="button" data-reviews-prev aria-label="Previous review">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6 9 12l6 6"/></svg>' +
        "</button>" +
        '<div class="reviews-stage">' +
        '<blockquote class="review-slide" data-review-slide></blockquote>' +
        '<p class="reviews-progress" data-reviews-progress></p>' +
        "</div>" +
        '<button class="reviews-nav" type="button" data-reviews-next aria-label="Next review">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6"/></svg>' +
        "</button>" +
        "</div>" +
        "</div>";

      var slide = root.querySelector("[data-review-slide]");
      var progress = root.querySelector("[data-reviews-progress]");
      var prev = root.querySelector("[data-reviews-prev]");
      var next = root.querySelector("[data-reviews-next]");

      function paint() {
        var item = list[((index % list.length) + list.length) % list.length];
        slide.innerHTML =
          '<div class="review-slide-stars" aria-label="' +
          item.stars +
          ' out of 5 stars">' +
          starsHtml(item.stars) +
          "</div>" +
          "<p>“" +
          item.text +
          "”</p>" +
          "<footer>" +
          "<cite>" +
          item.name +
          "</cite>" +
          '<span class="review-meta">' +
          item.when +
          "</span>" +
          "</footer>";
        progress.textContent = index + 1 + " / " + list.length;
      }

      prev.addEventListener("click", function () {
        index = (index - 1 + list.length) % list.length;
        paint();
      });
      next.addEventListener("click", function () {
        index = (index + 1) % list.length;
        paint();
      });
      paint();
    });
  }

  function initHome() {
    initHeroTypes();
    initHeroShopArrow();
    var featured = document.getElementById("featured-grid");
    if (!featured) return;
    var picks = [
      "freya-goose",
      "colin-cockerel",
      "aqua-fruit-bowl",
      "ziggy-sheep",
      "puffin-medium",
      "forest-coasters",
      "hare-ornament",
      "aqua-gecko"
    ]
      .map(JLI.getProduct)
      .filter(Boolean);
    JLI.renderProductGrid(featured, picks);
  }

  function initShop() {
    var grid = document.getElementById("shop-grid");
    if (!grid) return;

    var params = new URLSearchParams(location.search);
    var state = {
      category: params.get("category") || "all",
      query: params.get("q") || "",
      sort: "featured"
    };

    function apply() {
      var list = JLI.filterProducts({
        category: state.category,
        query: state.query
      });
      if (state.sort === "price-asc") {
        list = list.slice().sort(function (a, b) {
          return a.price - b.price;
        });
      } else if (state.sort === "price-desc") {
        list = list.slice().sort(function (a, b) {
          return b.price - a.price;
        });
      } else if (state.sort === "name") {
        list = list.slice().sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });
      }
      JLI.renderProductGrid(grid, list);
      var count = document.getElementById("shop-count");
      if (count) {
        count.textContent =
          list.length + " product" + (list.length === 1 ? "" : "s");
      }
      document.querySelectorAll("[data-filter]").forEach(function (btn) {
        btn.setAttribute(
          "aria-pressed",
          btn.getAttribute("data-filter") === state.category ? "true" : "false"
        );
      });
    }

    document.querySelectorAll("[data-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.category = btn.getAttribute("data-filter");
        var url = new URL(location.href);
        if (state.category === "all") url.searchParams.delete("category");
        else url.searchParams.set("category", state.category);
        history.replaceState({}, "", url);
        apply();
      });
    });

    var shopSearch = document.getElementById("shop-search");
    if (shopSearch) {
      if (state.query) shopSearch.value = state.query;
      shopSearch.addEventListener("input", function () {
        state.query = shopSearch.value;
        var url = new URL(location.href);
        if (state.query) url.searchParams.set("q", state.query);
        else url.searchParams.delete("q");
        history.replaceState({}, "", url);
        apply();
      });
    }

    var sort = document.getElementById("shop-sort");
    if (sort) {
      sort.addEventListener("change", function () {
        state.sort = sort.value;
        apply();
      });
    }

    apply();
  }

  function initProduct() {
    var root = document.getElementById("product-root");
    if (!root) return;
    var slug = new URLSearchParams(location.search).get("slug") || "freya-goose";
    var product = JLI.getProduct(slug) || JLI.products[0];
    document.title = product.fullName + " – Just Luv It preview";

    root.innerHTML =
      '<div class="breadcrumb wrap" style="padding-top:1.5rem">' +
      '<a href="index.html">Home</a><span>/</span>' +
      '<a href="shop.html">Shop</a><span>/</span>' +
      "<span>" +
      escapeHtml(product.name) +
      "</span></div>" +
      '<section class="product-detail wrap">' +
      '<div class="product-gallery"><img src="' +
      product.image +
      '" alt="' +
      escapeHtml(product.fullName) +
      '" /></div>' +
      '<div class="product-info">' +
      "<h1>" +
      escapeHtml(product.fullName) +
      "</h1>" +
      '<div class="price-lg">' +
      JLI.formatPrice(product.price) +
      "</div>" +
      '<p class="blurb">' +
      escapeHtml(product.blurb) +
      "</p>" +
      '<div class="buy-row">' +
      '<div class="qty">' +
      '<button type="button" data-qty-step="-1" aria-label="Decrease quantity">−</button>' +
      '<input id="product-qty" type="number" min="1" value="1" aria-label="Quantity" />' +
      '<button type="button" data-qty-step="1" aria-label="Increase quantity">+</button>' +
      "</div>" +
      '<button type="button" class="btn btn-primary" id="add-product">Add to basket</button>' +
      "</div>" +
      '<div class="product-notes">' +
      "<p>" +
      escapeHtml(product.description) +
      "</p>" +
      "<p>Handmade piece — small variations are part of its character. Free delivery on orders over £75 on the live shop.</p>" +
      '<p class="demo-note">This preview uses a simulated basket. No payment is taken.</p>' +
      "</div>" +
      "</div>" +
      "</section>";

    var qtyInput = document.getElementById("product-qty");
    root.querySelectorAll("[data-qty-step]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = Number(qtyInput.value || 1) + Number(btn.getAttribute("data-qty-step"));
        qtyInput.value = String(Math.max(1, next));
      });
    });
    document.getElementById("add-product").addEventListener("click", function () {
      JLI.addToBasket(product.slug, qtyInput.value);
    });

    var related = JLI.products
      .filter(function (p) {
        return p.slug !== product.slug && p.category === product.category;
      })
      .slice(0, 4);
    if (!related.length) related = JLI.products.slice(0, 4);
    var relatedGrid = document.getElementById("related-grid");
    if (relatedGrid) JLI.renderProductGrid(relatedGrid, related);
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindGlobalUi();
    markCurrentNav();
    updateBasketCount();
    renderBasket();
    initSiteReviews();
    initHome();
    initShop();
    initProduct();
  });
})();
