

const TelephoneInput = ({ className='' }) => {
  return (
    <>
        <input
          type="tel"
          className={`tabular-nums ${className}`}
          placeholder="Phone"
          pattern="[0-9]*"
          minLength="10"
          maxLength="10"
          title="Must be 10 digits"
          required
        />
      <p className="validator-hint">Must be 10 digits</p>
    </>
  );
}

export default TelephoneInput;