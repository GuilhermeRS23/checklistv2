import { ReactNode } from "react"
import ModalCadastro from "../../../Components/ModalCadastros";
import AddGrupo from "../../../Components/Form/AddGrupo";
import AddSubGrupo from "../../../Components/Form/AddSubGrupo";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"; // Corrected import path
import LoadingPNG from "/loading.png"
import Modal from "../../Modal";

interface PropsTableDefault {
  children?: ReactNode;
  listaDe: ITeste[];
  title: string;
  hasUser: boolean;
  admin: boolean;
  hasGruposSelecionado: string;
  loading: boolean;
  hasSession: IDadosSessao | undefined;
  onchangeResult?: (id: string, e: React.ChangeEvent<HTMLSelectElement>) => Promise<void> | undefined;
  onchangeObservation?: (id: string, e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | undefined;
  onchangeReset?: () => void | undefined;
  buttonSave: (id: string, resultado: string, observacao: string | undefined) => void;
  buttonDelete: (id: string) => void;
  startSession: () => void;
  finishTest: () => void;
};

const TableListTests = (
  { children, listaDe, hasSession,
    loading, title, hasUser, admin, hasGruposSelecionado,
    buttonDelete, onchangeResult, onchangeObservation,
    onchangeReset, buttonSave, startSession, finishTest }: PropsTableDefault) => {

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-auto max-w-9/10 my-10">
      <div className="flex justify-between items-center m-2">
        <h1 className="text-xl">{title}</h1>

        {(!hasUser && !admin) &&
          <ModalCadastro title="Adicionar Grupos">
            <AddGrupo />
            <AddSubGrupo />
          </ModalCadastro>
        }
      </div>

      {children}

      <div className="m-2 flex gap-5 print:hidden">
        <button className="button bg-green-500 disabled:bg-green-300"
          disabled={!hasGruposSelecionado || hasUser || listaDe.length === 0}
          onClick={() => startSession()}>
          Iniciar Testes
        </button>

        <button className="button bg-yellow-500 disabled:bg-yellow-300"
          disabled={!hasGruposSelecionado || hasUser || listaDe.length === 0}
          onClick={() => onchangeReset && onchangeReset()}>
          Resetar Testes
        </button>

        <button className="button bg-amber-500 disabled:bg-amber-300"
          disabled={!hasGruposSelecionado || hasUser || listaDe.length === 0}
          onClick={() => window.print()}>
          Imprimir PDF
        </button>
      </div>

      {loading ?
        <span className="flex justify-center gap-2 items-center font-Kanit m-5 dark:text-gray-200">
          <img className="size-10 animate-spin"
            src={LoadingPNG} alt="Loading" />
          Carregando testes...
        </span> :
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Casos de Uso</th>
              <th scope="col" className="px-6 py-3">Visualizar</th>
              <th scope="col" className="px-6 py-3">Resultado</th>
              <th scope="col" className="px-6 py-3 print:hidden">Observações</th>
              <th scope="col" className="px-6 py-3 print:hidden">Instruções</th>
              <th scope="col" className="px-6 py-3 print:hidden">Ações</th>
            </tr>
          </thead>
          <tbody>
            {listaDe.map((item) => (
              <tr key={item._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200" >
                  {item.description}
                </th>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200 print:hidden">
                  <Modal teste={item} />
                </td>
                <td className="px-2 py-4">
                  <label htmlFor="resultado" className="sr-only">
                    Resultado
                  </label>
                  <select id="resultado" className="block py-2.5 px-1 w-full text-sm text-gray-950 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                    value={item.resultado}
                    onChange={(e) => onchangeResult && onchangeResult(item._id, e)}
                  >
                    <option value="Não Testado">Não Testado</option>
                    <option value="Passou">Passou</option>
                    <option value="Não Passou">Não Passou</option>
                  </select>
                </td>
                <td className="px-2 py-4 w-2/10">
                  <div className="w-full md:w-8/10 m-auto">
                    <label htmlFor="text"
                      className="block font-Oswald dark:text-gray-400">
                    </label>
                    <input className="login_input"
                      id="obs"
                      type="text"
                      placeholder="Observações..."
                      value={item.observacao}
                      onChange={(e) => onchangeObservation && onchangeObservation(item._id, e)}
                    />
                  </div>
                </td>

                <td className="py-4 w-10 print:hidden">
                  {item.files ?
                    <a href={item.files} target="_blank" rel="noopener noreferrer"
                      title="Instrução" className="mx-auto">
                      <DocumentArrowDownIcon className="size-5" />
                    </a> :
                    <ExclamationCircleIcon className="size-5 mx-auto" title="Instrução indisponivel para esse teste" />}
                </td>

                <td className="py-4 px-2 w-15 print:hidden">
                  <span className="flex gap-2 justify-around md:flex-col px-2">
                    <button className="button disabled:bg-green-400/25 disabled:cursor-not-allowed bg-green-400"
                      onClick={() => buttonSave(item._id, item.resultado, item.observacao)}
                      disabled={hasUser}>Salvar</button>

                    {!admin &&
                      <button className="button bg-red-400"
                        onClick={() => buttonDelete(item._id)}>Excluir</button>
                    }
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }

      {loading || listaDe.length === 0 &&
        <p className="text-2xl m-5 dark:text-gray-200 flex justify-center">Nenhum teste encontrado</p>
      }

      {hasSession &&
        <button className="button bg-red-500 mt-2"
          onClick={() => finishTest()}>Finalizar Teste</button>
      }
    </div>
  )
};

export default TableListTests;
