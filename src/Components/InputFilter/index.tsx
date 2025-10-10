interface PropsInputFilter {
  listaDe: IGrupo[];
  selectText: string;
  labelTitulo: string
  id: string;
  disabled?: boolean;
  value: string;
  setValor: (e: string) => void;
};

const InputFilter = ({ listaDe, selectText, labelTitulo, id, setValor, disabled, value }: PropsInputFilter) => {
  return (
    <div className="w-full items-center max-[769px]:flex">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {labelTitulo}
      </label>
      <select id={id} className="print:bg-transparent print:border-0 print:font-medium
           block p-2 w-full text-sm text-gray-800 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-100 dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
        onChange={(event) => setValor(event.target.value)}
        value={value}
        disabled={disabled}
      >
        <option value="">{selectText}</option>
        {listaDe.map((grupo) => (
          <option key={grupo._id} value={grupo._id}>{grupo.nome}</option>
        ))}
      </select>
    </div>
  )
};

export default InputFilter;
