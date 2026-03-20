
import React from "react";
import { Select } from "radix-ui";
import { ChevronDown } from "lucide-react";
import countries from "../../country.js";

// Store imports
import useGlobalStore from "../store/globalStore.js";
import useAuthStore from "../store/auth/authStore.js";

function CountrySelect() {

  const country = useAuthStore((state) => state.country);
  const setCountry = useAuthStore((state) => state.setCountry);

  return (
    <Select.Root
      name="dialCode"
      value={country?.alpha2}
      onValueChange={(value) => {
        let selected = countries.find((c) => c.alpha2 === value);
        setCountry(selected);
      }}
    >
      <Select.Trigger className="flex items-center justify-between w-xs max-w-xs h-14 max-h-14 px-6 py-2 bg-white border border-black rounded-4xl data-placeholder:text-xs data-placeholder:font-normal data-placeholder:text-green-500">
        <Select.Value placeholder="Select country">
          {country ? (
            <CustomValue country={country} />
          ) : (
            <span className="text-green-600">Select country</span>
          )}
        </Select.Value>

        <Select.Icon asChild>
          <ChevronDown strokeWidth={3} size={16} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={5}
          className="w-(--radix-select-trigger-width) h-60 bg-white shadow-md/50 rounded-2xl overflow-hidden"
        >
          <Select.Viewport className="pl-3 pr-4 py-3">
            {countries.map((country) => (
              <SelectItem key={country.alpha2} country={country}>
                {country.name}
              </SelectItem>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export default CountrySelect;


const CustomValue = React.forwardRef(({country, ...porps}, ref) => {
  return (
    <span className="flex">
      <img src={country.flag} alt={country.alpha2} className="w-5 mr-2" />
      {country.name}
    </span>
  )}
);


const SelectItem = React.forwardRef(({ children, country, ...props }, ref) => {
  return (
    <Select.Item
      {...props}
      ref={ref}
      value={country.alpha2}
      className="flex justify-between items-center w-full min-h-10 h-fit max-h-12 text-sm font-normal px-2 py-3 rounded-lg outline-none hover:bg-authHoverBg"
    >

      <div className="flex-center space-x-1">
        <img 
          src={country.flag} 
          alt={country.alpha2}
          className="w-4"
        />
        <Select.ItemText>{children}</Select.ItemText>
      </div>

      <span className="text-[#a9a9a9] text-sm font-normal">{country.dialCode}</span>

    </Select.Item>
  )
})