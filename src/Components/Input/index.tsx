interface PropsInput {
  id: string;
  type: "email" | "password" | "text" | "file" | "area";
  placeholder: string;
  label: string;
  value: string;
  required?: boolean;
  setValor: (e: string) => void;
  onchangeObservation?: (id: string, e: React.ChangeEvent<HTMLSelectElement>) => Promise<void> | undefined;
};

const Input = ({ id, type, placeholder, label, value, required = true, setValor,
}: PropsInput) => {
  return (
    <div className="w-full px-1">
      <label htmlFor={type}
        className="block font-Oswald dark:text-gray-400">
        {label}
      </label>

      {type === "area" ? (
        <textarea className="login_input resize-none"
          id={id} rows={6}
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValor && setValor(event.target.value)}
          minLength={3}
          required={required}
        ></textarea>
      ) : (

        <input className="login_input"
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValor && setValor(event.target.value)}
          minLength={3}
          required={required}
        />
      )
      }
    </div >
  );
};

export default Input;
