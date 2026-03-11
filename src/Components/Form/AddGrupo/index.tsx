import { FormEvent, useState } from "react";
import { MessagemToastify } from "../../../Components/Toastify";
import { usePostGrupoMutation } from "../../../services/testeService";
import Button from "../../../Components/Button";
import Input from "../../Input";

const AddGrupo = () => {
  const [grupo, setGrupo] = useState("");
  const [postGrupo, { isLoading }] = usePostGrupoMutation();

  const handeSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const resGrupoNome = { nome: grupo[0].toUpperCase() + grupo.substring(1) };
      await postGrupo(resGrupoNome);
      MessagemToastify('Grupo cadastrado com sucesso!', "success")
      setGrupo("");
    } catch (error) {
      console.error(error)
      MessagemToastify("Ocorreu erro ao cadastrar o grupo!", "error");
    }
  };

  return (
    <div className="shadow-md p-5">
      <form
        onSubmit={handeSubmit}
        className="flex flex-col items-center justify-center gap-6"
      >
        <h1 className="dark:text-gray-800">Cadastrar Grupo</h1>
        <Input
          id="grupo"
          label="Grupo"
          placeholder="Adicione um grupo..."
          type="text"
          setValor={setGrupo}
          value={grupo}
        />
        <Button type="submit" disabled={isLoading}>
          Adicionar Grupo
        </Button>
      </form>
    </div>
  );
};

export default AddGrupo;
