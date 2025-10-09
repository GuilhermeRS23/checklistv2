import { MessagemToastify } from "../Components/Toastify";
import { useUpdateTesteMutation } from "../services/testeService";

const useSaveTeste = () => {
  const [updateTeste, { isLoading }] = useUpdateTesteMutation();

  const functionSaveTest = async (id: string, resultado: string, observacao: string | undefined, description?: string) => {
    const data = { id, description, resultado, observacao };
    const res = await updateTeste(data);
    if ("error" in res) {
      MessagemToastify("Ocorreu erro ao salvar o Teste!", "error");
      console.error(res.data);
      return;
    };
    MessagemToastify("Teste salvo com Sucesso!", "success");
  };


  return { functionSaveTest, isLoading };
};

export default useSaveTeste;
