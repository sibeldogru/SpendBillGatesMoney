import { useMemo, useState } from "react";
import "./App.css";
import { PRODUCTS } from "./products.js";

const START_BALANCE = 100_000_000_000;

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function App() {
  const [balance, setBalance] = useState(START_BALANCE);
  const [cart, setCart] = useState({});

  const buy = (product) => {
    if (product.price > balance) return;

    setBalance((b) => b - product.price);
    setCart((c) => ({
      ...c,
      [product.id]: (c[product.id] ?? 0) + 1,
    }));
  };

  const sell = (product) => {
    const qty = cart[product.id] ?? 0;
    if (qty === 0) return;

    setBalance((b) => b + product.price);
    setCart((c) => {
      const copy = { ...c };
      if (qty === 1) delete copy[product.id];
      else copy[product.id] = qty - 1;
      return copy;
    });
  };

  const purchasedItems = useMemo(() => {
    return PRODUCTS.filter((p) => cart[p.id]);
  }, [cart]);

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="top">
        <img
          className="avatar"
          src="/src/assets/products/bill-gates.jpg"
          alt="Bill Gates"
        />
        <h1>Spend Bill Gates' Money</h1>
      </header>

      {/* BALANCE */}
      <div className="balance-bar">{formatMoney(balance)}</div>

      {/* PRODUCTS */}
      <div className="product-grid">
        {PRODUCTS.map((p) => {
          const qty = cart[p.id] ?? 0;

          return (
            <div key={p.id} className="product-card">
              <img className="product-img" src={p.image} alt={p.name} />

              <h3>{p.name}</h3>
              <span className="price">{formatMoney(p.price)}</span>

              <div className="controls">
                <button
                  className="sell"
                  disabled={qty === 0}
                  onClick={() => sell(p)}
                >
                  Sell
                </button>

                <input type="text" value={qty} readOnly />

                <button
                  className="buy"
                  disabled={p.price > balance}
                  onClick={() => buy(p)}
                >
                  Buy
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SUMMARY */}
      <section className="summary">
        <h2>Purchased Items</h2>

        {purchasedItems.length === 0 ? (
          <p className="empty">No items purchased yet.</p>
        ) : (
          <ul>
            {purchasedItems.map((item) => (
              <li key={item.id}>
                {item.name} × {cart[item.id]} ={" "}
                {formatMoney(cart[item.id] * item.price)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
