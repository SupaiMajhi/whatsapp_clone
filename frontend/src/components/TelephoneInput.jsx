
import countries from "../../country.js"

//store imports
import useAuthStore from "../store/auth/authStore.js"

const TelephoneInput = ({ register }) => {

  const country = useAuthStore((state) => state.country);

  let found = countries.find(c => c.alpha2 === country);

  return (
    <div className="relative w-xs max-w-xs min-h-14 max-h-14 flex items-center border rounded-4xl bg-white">
        <p className="absolute left-5 top-1/2 -translate-y-1/2 h-full flex items-center rounded-l-4xl">{found.dialCode}</p>
        <input
          {...register("phone")}
          type="tel"
          autoComplete="off"
          className="flex-1 h-full pl-12 text-sm  font-normal rounded-inherit outline-none"
        />
    </div>
  );
}

export default TelephoneInput;