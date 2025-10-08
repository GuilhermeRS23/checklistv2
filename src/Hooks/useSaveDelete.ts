import { MessagemToastify } from "../Components/Toastify";
import { useDeleteTesteMutation, useUpdateTesteMutation } from "../services/testeService";

const useDeleteSave = () => {
  const [updateTeste, { isLoading }] = useUpdateTesteMutation();
  const [deleteTeste] = useDeleteTesteMutation();

  const functionSaveTest = async (id: string, description: string, resultado: string, observacao: string | undefined) => {
    const data = { id, description, resultado, observacao };
    const res = await updateTeste(data);
    if ("error" in res) {
      MessagemToastify("Ocorreu erro ao salvar o Teste!", "error");
      console.error(res.data);
      return;
    };
    MessagemToastify("Teste salvo com Sucesso!", "success");
  };

  const functionDeleteTest = async (id: string) => {
    const responta = confirm("Tem certeza que deseja excluir esse teste?");
    if (!responta) return;

    const res = await deleteTeste(id);
    if ("error" in res) {
      MessagemToastify("Ocorreu erro ao excluir o teste!", "error");
      console.error(res.error);
      return;
    }

    MessagemToastify("Teste excluído com Sucesso!", "success");
  };

  return { functionDeleteTest, functionSaveTest, isLoading };
};

export default useDeleteSave;
