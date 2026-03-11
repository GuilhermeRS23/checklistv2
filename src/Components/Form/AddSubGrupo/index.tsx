import { FormEvent, useState } from "react";
import { MessagemToastify } from "../../../Components/Toastify";
import { useGetAllGruposQuery, usePostSubGrupoMutation } from "../../../services/testeService";
import Input from "../../Input";
import Button from "../../../Components/Button";

const AddSubGrupo = () => {
  const { data: grupos } = useGetAllGruposQuery();
  const [subGrupo, setSubGrupo] = useState("");
  const [grupoId, setGrupoId] = useState("");
  const [postSubGrupo] = usePostSubGrupoMutation();

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

    if (!grupoId) {
      MessagemToastify("Campo Grupo não pode está vazio!", "error");
      return;
    }

    try {
      const resSubGrupoNome = { nome: subGrupo[0].toUpperCase() + subGrupo.substring(1), grupoId };
      await postSubGrupo(resSubGrupoNome);
      MessagemToastify('SubGrupo cadastrado com sucesso!', "success");
      setGrupoId("");
      setSubGrupo("");
    } catch (error) {
      console.error(error)
      MessagemToastify("Ocorreu erro ao cadastrar o subgrupo!", "error")
    }
  };

  if (!grupos) return [];

  return (
    <div className="p-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-6 my-5"
      >

        <h1 className="dark:text-gray-900">Cadastrar SubGrupo</h1>
        <Input
          id="subGrupo"
          label="SubGrupo"
          placeholder="Adicionar subgrupo..."
          type="text"
          setValor={setSubGrupo}
          value={subGrupo}
        />

        <div className="w-full">
          <label htmlFor="grupo" className="block font-Oswald dark:text-gray-400">
            Associe a um Grupo
          </label>
          <select id='grupo' className="login_input"
            onChange={(event) => setGrupoId(event.target.value)}
            value={grupoId}
          >
            <option value="">Associar subgrupo...</option>
            {grupos.map((grupo) => (
              <option key={grupo._id} value={grupo._id}>{grupo.nome}</option>
            ))}
          </select>
        </div>
        <Button type="submit"
          disabled={false}
        >Adicionar Subgrupo</Button>
      </form>
    </div>
  );
};

export default AddSubGrupo;
