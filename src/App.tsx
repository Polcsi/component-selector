import { useState } from 'react'
import { Select, SelectOption } from './Select'

const options = [
  {label: "First", value: 1},
  {label: "Second", value: 2},
  {label: "Third", value: 3},
  {label: "Fourth", value: 4},
  {label: "Fifth", value: 5},
  {label: "Sixth", value: 6},
]

function App() {
  const [value, setValue] = useState<SelectOption | undefined>(options[0]);
  const [valueArr, setValueArr] = useState<SelectOption[]>([options[0]]);

  return  <>
    <Select options={options} value={value} onChange={o => setValue(o)}/>
    <br />
    <Select multiple={true} options={options} value={valueArr} onChange={o => setValueArr(o)}/>
    
  </>
}

export default App
