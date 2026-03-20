

const TelephoneInput = () => {
  return (
    <div className="flex-1 items-center w-xs max-w-xs h-14 max-h-14 border rounded-4xl bg-red-300">
        <input
          type="tel"
          className="w-full h-full px-6 bg-white rounded-inherit"
          placeholder="Phone"
          pattern="[0-9]*"
          minLength="10"
          maxLength="10"
          title="Must be 10 digits"
          required
        />
      <p className="validator-hint">Must be 10 digits</p>
    </div>
  );
}

export default TelephoneInput;