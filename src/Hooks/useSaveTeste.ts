import { MessagemToastify } from "../Components/Toastify";
import { useUpdateTesteMutation } from "../services/testeService";

const useSaveTeste = () => {
  const [updateTeste, { isLoading, isSuccess }] = useUpdateTesteMutation();

  const functionSaveTest = async (id: string, resultado: string, observacao: string | undefined, description?: string) => {
    const data = { id, description, resultado, observacao };
    const res = await updateTeste(data);
    if ("error" in res) {
      MessagemToastify("Ocorreu erro ao salvar o teste!", "error");
      console.error(res.data);
      return;
    };
    MessagemToastify("Teste salvo com sucesso!", "success");
  };

  return { functionSaveTest, isLoading, isSuccess };
};

export default useSaveTeste;
