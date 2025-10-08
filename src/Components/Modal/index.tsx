import { useState } from "react";
import { useSelector } from "react-redux";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { LuTextSearch } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";
import { FaRegEdit, FaRegSave } from "react-icons/fa";
import { ArrowPathIcon, DocumentArrowDownIcon } from "@heroicons/react/20/solid";
import { RootReducer } from "../../store";
import useDeleteSave from "../../Hooks/useSaveDelete";

type PropsModal = { teste: ITeste }
const Modal = ({ teste }: PropsModal) => {
  const [openModal, setOpenModal] = useState(false);
  const [tempObs, setTempObs] = useState(teste.observacao);
  const [tempResult, setTempResult] = useState(teste.resultado);
  const { functionSaveTest, isLoading } = useDeleteSave();
  const { user } = useSelector((state: RootReducer) => state.user);

  return (
    <>
      <span className='flex gap-1 items-center cursor-pointer'>
        <LuTextSearch size={25} onClick={() => setOpenModal(true)} title="Exibir Teste" className="mx-auto" />
      </span>

      <Dialog open={openModal} onClose={setOpenModal} className="relative z-auto">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left  dark:bg-gray-700 shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200
              md:w-full md:max-w-3xl
              data-leave:ease-in sm:my-5 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >

              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Caso de Uso
                  </h3>
                  <button onClick={() => setOpenModal(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" data-modal-hide="static-modal">
                    <IoCloseSharp size={25} />
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
              </div>

              {/* <!-- Modal Content --> */}
              <div className="p-4 md:p-5 space-y-4">
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200">
                  {teste.description}
                </p>

                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <label htmlFor="resultado" className="block font-Oswald dark:text-gray-200 text-md">
                      Resultado:
                    </label>
                    <select id="resultado" className="block py-2.5 px-1 text-md text-gray-950 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-200 dark:bg-gray-700 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                      value={tempResult}
                      onChange={(e) => setTempResult(e.target.value)}
                    >
                      <option value="Não Testado">Não Testado</option>
                      <option value="Passou">Passou</option>
                      <option value="Não Passou">Não Passou</option>
                    </select>
                  </div>

                  {teste.files && (
                    <span>
                      <a href={teste.files} target="_blank" rel="noopener noreferrer"
                        title="Instrução" className="mx-auto flex gap-2 justify-around px-2
                     w-full items-center rounded-md bg-blue-600 py-2 font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:w-auto cursor-pointe">
                        <DocumentArrowDownIcon className="size-5" /> Instrução
                      </a>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">

                  <label htmlFor="text" className="block font-Oswald dark:text-gray-200">
                    Observações:
                  </label>
                  <input className="login_input"
                    id="obs"
                    type="text"
                    placeholder="Sem observações"
                    value={tempObs}
                    onChange={(e) => setTempObs(e.target.value)}
                  />
                </div>
              </div>

              {/* <!-- Modal Footer --> */}
              <div className="px-4 pb-2 sm:flex sm:flex-row-reverse sm:px-6">
                {user &&
                  <>
                    <button
                      type="button"
                      onClick={() => alert("Em desenvolvimento")}
                      className="inline-flex w-full gap-1 items-center justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-amber-500 sm:ml-3 sm:w-auto cursor-pointer"
                    >
                      <FaRegEdit /> Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => functionSaveTest(teste._id, teste.description, tempResult, tempObs)}
                      className="inline-flex w-full gap-1 items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto cursor-pointer disabled:cursor-no-drop"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <ArrowPathIcon className="size-5 animate-spin" />
                          Salvando...
                        </>
                      ) :
                        <>
                          <FaRegSave /> Salvar
                        </>
                      }
                    </button>
                  </>
                }

              </div>
            </DialogPanel>
          </div>
        </div >
      </Dialog >
    </>
  )
};

export default Modal;
