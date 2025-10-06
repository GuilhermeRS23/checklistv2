import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { LuTextSearch } from "react-icons/lu";
import { FaRegSave, FaRegTrashAlt } from "react-icons/fa";
import useDeleteSave from "../../Hooks/useSaveDelete";

type PropsModal = { teste: ITeste }
const Modal = ({ teste }: PropsModal) => {
  const [openModal, setOpenModal] = useState(false);
  const { functionDeleteTest, functionSaveTest } = useDeleteSave();

  return (
    <>
      <span className='flex gap-1 items-center cursor-pointer'>
        <LuTextSearch size={25} onClick={() => setOpenModal(true)} title="Exibir Teste" />
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
                  <button onClick={() => setOpenModal(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="static-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
              </div>

              {/* <!-- Modal Content --> */}
              <div className="p-4 md:p-5 space-y-4">
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200">
                  {teste.description}
                </p>

                <div className="flex items-center gap-2">
                  <label htmlFor="resultado" className="block font-Oswald dark:text-gray-200 text-md">
                    Resultado:
                  </label>
                  <select id="resultado" className="block py-2.5 px-1 text-md text-gray-950 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-200 dark:bg-gray-700 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                    value={teste.resultado}
                  >
                    <option value="Não Testado">Não Testado</option>
                    <option value="Passou">Passou</option>
                    <option value="Não Passou">Não Passou</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="text" className="block font-Oswald dark:text-gray-200">
                    Observações:
                  </label>
                  <input className="login_input"
                    id="obs"
                    type="text"
                    placeholder="Sem observações"
                  />
                </div>
              </div>

              {/* <!-- Modal Footer --> */}
              <div className="px-4 pb-2 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => functionDeleteTest(teste._id)}
                  className="inline-flex w-full gap-1 items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto cursor-pointer"
                >
                  <FaRegTrashAlt /> Excluir
                </button>

                <button
                  type="button"
                  title="Em desenvolvimento"
                  disabled
                  onClick={() => functionSaveTest(teste._id, teste.description, teste.resultado, teste.observacao)}
                  className="inline-flex w-full gap-1 items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto cursor-pointer disabled:cursor-no-drop"
                >
                  <FaRegSave /> Salvar
                </button>

              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
};

export default Modal;
