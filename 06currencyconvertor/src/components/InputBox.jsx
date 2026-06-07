function InputBox({
  label,            // Text shown above the box — "From" or "To"
  amount,           // The number shown inside the input field
  onAmountChange,   // Function to call when user types a number
  onCurrencyChange, // Function to call when user changes the currency
  currencyOptions = [],    // List of currencies for dropdown — default empty array
  selectCurrency = "usd",  // Currently selected currency — default is "usd"
  amountDisable = false,   // Should input be disabled? — default is NO
  currencyDisable = false, // Should dropdown be disabled? — default is NO
}) {
  return (
    // Main container — white background, rounded corners, flex layout
    <div className="bg-white p-3 rounded-lg text-sm flex">

      {/* ---- LEFT SIDE — Label + Amount Input ---- */}
      <div className="w-1/2">

        {/* Label text — "From" or "To" */}
        <label className="text-black/40 mb-2 inline-block">
          {label}
        </label>

        {/* Number input field
            - disabled: user cannot type if amountDisable is true
            - value: shows the amount received from parent
            - onChange: when user types, send the new number to parent
            - Number() because input always gives string, we need number */}
        <input
          className="outline-none w-full bg-transparent py-1.5"
          type="number"
          placeholder="Amount"
          disabled={amountDisable}
          value={amount}
          onChange={(e) => onAmountChange(Number(e.target.value))}
        />
      </div>

      {/* ---- RIGHT SIDE — Currency Type + Dropdown ---- */}
      <div className="w-1/2 flex flex-wrap justify-end text-right">

        {/* Small label above dropdown */}
        <p className="text-black/40 mb-2 w-full">
          Currency Type
        </p>

        {/* Currency dropdown
            - value: shows currently selected currency
            - disabled: user cannot change if currencyDisable is true
            - onChange: when user selects a currency, send it to parent */}
        <select
          className="rounded-lg px-1 py-1 bg-gray-100 cursor-pointer outline-none"
          value={selectCurrency}
          disabled={currencyDisable}
          onChange={(e) => onCurrencyChange(e.target.value)}
        >
          {/* Loop through currencyOptions array
              Each currency becomes one <option> in dropdown
              Example: ["usd", "inr", "eur"] becomes:
              <option value="usd">usd</option>
              <option value="inr">inr</option>
              <option value="eur">eur</option> */}
          {currencyOptions.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}

export default InputBox;