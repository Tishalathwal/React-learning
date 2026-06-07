# 💱 Currency Converter — Quick Notes

---

## What Does This Project Do?
Enter an amount → Select currencies → Click Convert → Get the result
Swap button interchanges the From ↔ To currencies

---

## 1. Custom Hook — `useCurrencyInfo.js`

```js
function useCurrencyInfo(currency) {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
      .then((res) => res.json())           // raw text → JS object
      .then((res) => setData(res[currency])); // store only that currency's rates
  }, [currency]); // re-runs whenever currency changes

  return data; // returns { inr: 83.5, eur: 0.92, ... }
}
```

**Key Points:**
- Name starts with `use` = Custom Hook
- `[currency]` dependency = re-fetch when currency changes
- `.json()` = converts raw API response into a JS object
- `res[currency]` = picks only the relevant currency's data from the full response

---

## 2. InputBox Component — `InputBox.jsx`

One component used in both "From" and "To" boxes — only the props differ

**Important Props:**
| Prop | Purpose |
|---|---|
| `label` | Shows "From" or "To" text |
| `amount` | Value shown in the input field |
| `onAmountChange` | Notifies parent when user types |
| `onCurrencyChange` | Notifies parent when dropdown changes |
| `currencyOptions` | List of currencies for the dropdown |
| `amountDisable` | Prevents typing in the "To" box |

---

## 3. App.jsx — Main Logic

```js
const [amount, setAmount] = useState(0)               // user's input amount
const [from, setFrom] = useState("usd")                // from currency
const [to, setTo] = useState("inr")                    // to currency
const [convertedAmount, setConvertedAmount] = useState(0) // result

const currencyInfo = useCurrencyInfo(from)             // call custom hook
const options = Object.keys(currencyInfo)              // get dropdown list

const convert = () => {
  setConvertedAmount(amount * currencyInfo[to])        // 100 * 83.5 = 8350
}

const swap = () => {
  setFrom(to); setTo(from)
  setAmount(convertedAmount); setConvertedAmount(amount)
}
```

---

## Complete Flow
```
useCurrencyInfo("usd") → API fetch → { inr: 83.5, eur: 0.92... }
Object.keys() → ["inr", "eur"...] → shown in dropdown
Convert click → amount × rate = result
Swap click → from ↔ to interchange
```

---

## API Used
```
https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json
```
Free API — No key needed — 200+ currencies supported

---
