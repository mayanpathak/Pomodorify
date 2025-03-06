import { DownArrowIcon, UpArrowIcon } from "../assets/Icons";
import { useState } from 'react';



export function TitleInput({value, onChange, placeholder}) {
    return(
        <input
            type="text" name="title" value={value} onChange={onChange}
            placeholder={placeholder}
            className="m-0 p-0 focus:outline-none font-bold placeholder:text-lg  placeholder:text-[#A1A1AA] input-lg bg-white input-md w-full max-w"  />
    )
}

export function ContentInput({value, onChange, placeholder}) {
    return(
        <textarea name="content" value={value} onChange={onChange}
        className="w-full p-1 m-0 border text-zinc-700 border-zinc-400 outline-none rounded bg-white" rows="4" placeholder={placeholder} /> 
    )
}

export function NumberInput({ value, onChange }) {
    // Increment the pomodoro count
    const handleIncrement = () => {
        onChange(value + 1);
    };

    // Decrement the pomodoro count but don't allow it to go below 1
    const handleDecrement = () => {
        if (value > 1) {
            onChange(value - 1);
        }
    };

    return (
        <>
            {/* Input Field */}

            {/* Decrement Button */}
            <button
                type="button"
                onClick={handleDecrement}
                className="btn m-1 rounded-full border-zinc-700 bg-white btn-xs hover:bg-white"
            >
                <DownArrowIcon ClassProp={"text-zinc-700"} />
            </button>

            {/* Increment Button */}
            <button
                type="button"
                onClick={handleIncrement}
                className="btn m-1 rounded-full bg-white btn-xs hover:bg-white"
            >
                <UpArrowIcon ClassProp={"text-zinc-700"} />
            </button>
            
            <input
                type="number"
                name="pomodoro"
                value={value}
                readOnly
                onChange={(e) => onChange(Number(e.target.value))}
                className="input font-bold input-lg w-auto text-left bg-white"
            />

        </>
    );
}

export function SecondaryButton({value, onClick}) {
    return (
        <button className="btn hover:bg-zinc-400 text-white bg-zinc-400 border-none btn-sm" onClick={onClick}>{value}</button>
    )
}

export function ZincButton({value, onClick}) {
    return (
        <button onClick={onClick} className="btn hover:bg-zinc-700 border-none text-white bg-zinc-700  btn-sm">{value}</button>
    )
}

export function HeaderText({value, color}) {
    return (
        <h3 className={`font-bold text-md  ${color}`}>{value}</h3>
    )
}

export function SecondaryText({value}) {
    return (
        <h3 className="font-bold text-sm py-1 mx-2 text-zinc-400">{value}</h3>
    )
}

export function  SmallNumberInput({value, onChange,}) {
    return (
        <input type="number" onChange={onChange}  min="1" value={value} className="h-9 input input-bordered text-zinc-700 bg-zinc-200 w-24" />
    )
}


export function SliderInput({value, defaultValue, onChange }) {
    return (
      <div className="flex items-center">
        <span className="mr-4 font-bold text-sm text-zinc-400 ">{defaultValue}</span> 

        <input
          type="range"
          min={0}
          max={100}
          defaultValue={defaultValue}
          onChange={(e) => onChange(e.target.value)}
          className="range range-xs w-full bg-zinc-200"
          value={value}
        />
      </div>
    );
  }

  export function DropdownInput({ items = [], selectedValue, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(
      items.find(item => item.value === selectedValue)?.label || 'Click to select'
    );
  
    const toggleDropdown = () => {
      setIsOpen((prev) => !prev);
    };
  
    const handleItemClick = (item) => {
      if (item && item.value) {
        setSelectedItem(item.label);
        onChange(item.value); // Ensure item.value exists before calling onChange
        setIsOpen(false);
      }
    };
  
    return (
      <div className="relative inline-block text-left">
        <SecondaryButton value={selectedItem} onClick={toggleDropdown} />
        {isOpen && (
          <ul
            role="menu" className="absolute w-full bg-white rounded-md shadow-lg z-10">
            {items.map((item) => (
              <li key={item.value}> {/* Use item.value as a unique key */}
                <a
                  role="menuitem"
                  onClick={() => handleItemClick(item)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  