import { FormEvent, useState } from "react";
import { usePostTesteMutation } from "../../../services/testeService";
import { MessagemToastify } from "../../../Components/Toastify";
import Button from "../../../Components/Button";
import Input from "../../Input";

const AddTeste = (body: { grupo: string, subgrupo: string }) => {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState("");
  const [postTeste, { isLoading }] = usePostTesteMutation();

  const handeSubmit = async (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const testeData = {
      grupoID: body.grupo,
      subGrupoID: body.subgrupo,
      description: description[0].toUpperCase() + description.substring(1),
      resultado: "Não Testado", // Campo fixo
      observacao: "",
      files: files
    };

    try {
      await postTeste(testeData);
      MessagemToastify("Teste adicionado com Sucesso!", "success");
      setDescription('');
      setFiles('');

    } catch (error) {
      console.error(error)
      MessagemToastify("Ocorreu erro ao tentar adiconar teste!", "error");
    }
  };

  return (
    <div className="p-5">
      <form
        onSubmit={handeSubmit}
        className="flex flex-col items-center justify-center gap-6"
      >
        <h1 className="dark:text-gray-800">Adicionar Teste</h1>

        <Input id="teste"
          type="area"
          label="Casos de Uso"
          placeholder="Descreva o teste a ser feito..."
          setValor={setDescription}
          value={description}
        />

        <Input id="link"
          label="Link"
          placeholder="Link para manual..."
          type="text"
          setValor={setFiles}
          value={files}
          required={false} />

        <Button type="submit"
          disabled={isLoading}>
          Adicionar Teste
        </Button>
      </form>
    </div>
  )
};

export default AddTeste;
