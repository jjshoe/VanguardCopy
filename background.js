chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: () => {

      function getCookie(name) {
        return document.cookie
          .split("; ")
          .find(row => row.startsWith(name + "="))
          ?.split("=")[1];
      }

      const csrfToken = getCookie("XSRF-TOKEN");

      if (!csrfToken) {
        console.error("Vanguard Copy: no CSRF token found in cookie 'XSRF-TOKEN'");
        return;
      }

      const url = "https://personal1.vanguard.com/xs1-secure-site-consumer-api/graphql";

      const body = {
        operationName: "holdingsInfo",
        variables: { excludeCustomView: false },
        query: `query holdingsInfo($excludeCustomView: Boolean!) {
          accountsInfo(excludeCustomView: $excludeCustomView) {
            accounts {
              positions {
                name
                quantity
                price
                currentBalance
                ticker
              }
            }
          }
        }`
      };

      fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken
        },
        body: JSON.stringify(body)
      })
        .then(res => res.json())
        .then(data => {
          console.log("Vanguard holdingsInfo result:", data);

          const accounts = data?.data?.accountsInfo?.accounts || [];
          const rows = [];

          for (const acct of accounts) {
            for (const p of (acct.positions || [])) {
              const ticker = p?.ticker ?? "";
              const name = p?.name ?? "";
              const quantity = p?.quantity ?? "";
              const price = p?.price ?? "";
              const currentBalance = p?.currentBalance ?? "";

              rows.push([ticker, name, quantity, price, currentBalance].join("\t"));
            }
          }

          const tsv = rows.join("\n");
          const ta = document.createElement("textarea");
          ta.id = "vanguard-copy";
          ta.textContent = tsv;
          document.body.appendChild(ta);
        })
        .catch(err => console.error("Vanguard Copy fetch failed:", err));
    }
  });
});

