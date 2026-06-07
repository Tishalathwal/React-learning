import { useState } from "react"
import useCurrencyInfo from "./hooks/useCurrencyInfo"
import InputBox from "./components/InputBox"

function App() {

  // User ne kitna amount type kiya — default 0
  const [amount, setAmount] = useState(0)

  // "From" currency — default usd
  const [from, setFrom] = useState("usd")

  // "To" currency — default inr
  const [to, setTo] = useState("inr")

  // Convert hone ke baad result — default 0
  const [convertedAmount, setConvertedAmount] = useState(0)

  // Custom hook call kar rahe hain
  // "from" currency ke saare rates aa jaayenge
  // Jab bhi "from" change hoga, hook dobara API call karega
  const currencyInfo = useCurrencyInfo(from)

  // currencyInfo object ki saari keys nikaal rahe hain
  // Yeh keys = currency names = dropdown options
  // Example: ["inr", "eur", "gbp", "jpy", ...]
  const options = Object.keys(currencyInfo)

  // Swap function — "From" aur "To" interchange karo
  const swap = () => {
    setFrom(to)                    // jo "to" tha woh ab "from" banega
    setTo(from)                    // jo "from" tha woh ab "to" banega
    setConvertedAmount(amount)     // purana amount → result box mein
    setAmount(convertedAmount)     // purana result → amount box mein
  }

  // Convert function — calculation karo
  const convert = () => {
    // amount × us currency ka rate
    // Example: 100 × currencyInfo["inr"] = 100 × 83.5 = 8350
    setConvertedAmount(amount * currencyInfo[to])
  }

  return (
    <div
      className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=1400')`,
      }}
    >

      <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30">

        <form
          onSubmit={(e) => {
            e.preventDefault() // page reload band karo
            convert()          // convert function call karo
          }}
        >

          {/* FROM box */}
          <div className="w-full mb-1">
            <InputBox
              label="From"
              amount={amount}
              currencyOptions={options}
              onAmountChange={(amount) => setAmount(amount)}
              onCurrencyChange={(currency) => setFrom(currency)}
              selectCurrency={from}
            />
          </div>

          {/* SWAP button*/}
          <div className="relative w-full h-0.5">
            <button
              type="button"
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
              onClick={swap}
            >
              Swap
            </button>
          </div>

          {/* TO box */}
          <div className="w-full mb-4 mt-1">
            <InputBox
              label="To"
              amount={convertedAmount}
              currencyOptions={options}
              onCurrencyChange={(currency) => setTo(currency)}
              selectCurrency={to}
              amountDisable={true}
            />
          </div>

          {/* CONVERT button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Convert {from.toUpperCase()} to {to.toUpperCase()}
          </button>

        </form>
      </div>
    </div>
  )
}

export default App