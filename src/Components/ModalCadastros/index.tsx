import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/24/solid'

interface PropsModal {
  title: string;
  children: React.ReactNode
};

const ModalCadastro = ({ title, children }: PropsModal) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="login_button print:hidden" type="button" onClick={() => setOpen(true)}>
        <span className='flex gap-1 items-center'>
          <PlusIcon className='size-5' />
          {title}
        </span>
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-auto m-auto">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              {children}

              <div className="px-4 pb-2 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto cursor-pointer"
                >
                  Cancelar
                </button>

              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
};

export default ModalCadastro;
