import * as Select from "@radix-ui/react-select";
import DownArrow from "../assets/svg/downArrow.svg?react";

// Store imports
import useGlobalStore from "../store/globalStore.js";
import useAuthStore from "../store/auth/authStore.js";

function CountrySelect({ onChange, countries }) {

  const setCountry = useAuthStore((state) => state.setCountry);
  const country = useAuthStore((state) => state.country);
  const theme = useGlobalStore((state) => state.theme);

  return (
    <Select.Root
      defaultValue="IN"
      value={country?.alpha2 ?? ""}
      onValueChange={(value) => {
        const selected = countries.find((c) => c.alpha2 === value);
        setCountry(selected);
        onChange(selected.dialCode);
      }}
    >
      <Select.Trigger className="w-full h-12.5 flex justify-between items-center gap-2 rounded-3xl border px-5">
        {country ? (
          <div className="flex items-center gap-2">
            <img src={country?.flag} alt={country?.name} className="w-6" />
            <span className="text-neutral-700 text-md font-normal">
              {country?.name}
            </span>
          </div>
        ) : (
          <span className="text-[0.9rem] font-normal text-green-500 tracking-wide">
            Select country
          </span>
        )}
        <Select.Icon asChild>
          <DownArrow className={`w-7 h-7 ${theme === "light" ? "text-txtDark" : "text-txtLight"}`} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content position="popper" sideOffset={6} className="content">
          <Select.Viewport className="viewport">
            {countries.map((country) => (
              <Select.Item
                key={country.alpha2}
                value={country.alpha2}
                className="flex justify-between items-center gap-3 px-5 py-2 rounded-lg data-highlighted:bg-stone-300/50 outline-none transition-colors duration-75"
              >
                <div className="flex justify-center items-center gap-2 text-neutral-700 font-normal">
                  <img
                    src={country.flag}
                    alt={country.alpha2}
                    style={{ width: "20px" }}
                  />
                  <Select.ItemText>{country.name}</Select.ItemText>
                </div>

                <span className="text-neutral-600 font-light text-[0.85rem]">
                  {country.dialCode}
                </span>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

export default CountrySelect;
