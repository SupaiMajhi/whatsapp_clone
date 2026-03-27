
import countries from "../../country.js"

//store imports
import useAuthStore from "../store/auth/authStore.js"

const TelephoneInput = ({ register }) => {

  const country = useAuthStore((state) => state.country);

  let found = countries.find(c => c.alpha2 === country);

  return (
    <div className="relative w-xs max-w-xs min-h-14 max-h-14 text-base font-medium flex items-center border rounded-4xl bg-white">
        <span className="absolute top-1/2 left-0 -translate-y-1/2 w-fit h-full flex justify-center items-center rounded-l-4xl pl-5 pr-1 outline-none pointer-events-none">
          {found.dialCode}
        </span>
        <input
          {...register("phone")}
          type="tel"
          autoComplete="off"
          className="flex-1 pl-16 h-full rounded-inherit outline-none"
        />
    </div>
  );
}

export default TelephoneInput;