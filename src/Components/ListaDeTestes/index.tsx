import { useContext, useEffect, useMemo, useState } from "react";
import { deleteTeste, getAllListaTestes, updateTeste } from "../../API/testesServices";
import { IGrupo, ISubGrupo, ITeste } from "../../Interfaces/ITestes";
import { getAllGrupos, getAllSubGrupos } from "../../API/gruposServices";
import { UserContext } from "../../Hooks/Context/UserContex";
import { DadosSessao, postSession } from "../../API/sessionService";
import InputFilter from "../InputFilter";
import TableListTests from "../TableListTests";
import ModalCadastro from "../ModalCadastros";
import AddTeste from "../Form/AddTeste";
import AlertErro from "../../Pages/Error/AlertError";

export default function ListaDeTestes() {
  const [testes, setTestes] = useState<ITeste[]>([]);
  const [grupos, setGrupos] = useState<IGrupo[]>([]);
  const [subGrupos, setSubGrupos] = useState<ISubGrupo[]>([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState<string>("");
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState<string>("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionAtiva, setSessionAtiva] = useState<DadosSessao>();
  const { user } = useContext(UserContext);

  const HEAD_TABLE = [
    "Grupo", "Casos de Uso", "Resultado", "Observações", "Ações"
  ];

  const findAllTestAttributes = async () => {
    setLoading(true);
    try {
      const dataGrupos = await getAllGrupos();
      const dataSubGrupos = await getAllSubGrupos();
      const dataTests = await getAllListaTestes();

      setGrupos(dataGrupos.data);
      setSubGrupos(dataSubGrupos.data);
      setTestes(dataTests.data);
    } catch (error) {
      console.error("Ocorreu um erro ao obter as informações! ", error)
    } finally {
      setLoading(false);
    }
  };

  const handleGrupoSelecionado = (newValue: string) => setGrupoSelecionado(newValue);
  const handleSubGrupoSelecionado = (newValue: string) => setSubGrupoSelecionado(newValue);

  // Filtrar os subgrupos com base no grupo selecionado
  const subGruposFiltrados = useMemo(() => {
    return subGrupos.filter(subgrupo =>
      subgrupo.grupoId === grupoSelecionado || (subgrupo.grupo && subgrupo.grupo._id === grupoSelecionado)
    );
  }, [subGrupos, grupoSelecionado]);

  // Filtragem de itens baseada nos valores dos selects de grupo e subgrupo
  const testesFiltrados = testes.filter(({ grupo, subGrupo }) =>
    (!grupoSelecionado || grupo._id === grupoSelecionado) &&
    (!subGrupoSelecionado || subGrupo._id === subGrupoSelecionado)
  );

  // Função para mudar campo de resultados de um teste
  const handleChange = async (id: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setTestes((prevTestes) =>
        prevTestes.map((teste) =>
          teste._id === id ? { ...teste, resultado: e.target.value } : teste
        ));
    } catch (error) {
      console.log(error);
    }
  };

  // Função para mudar campo de observaçao de um teste
  const handleChangeObs = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setTestes((prevTestes) =>
        prevTestes.map((teste) =>
          teste._id === id ? { ...teste, observacao: e.target.value } : teste
        ));
    } catch (error) {
      console.log(error);
    }
  };

  const resetarTestes = () => {
    setTestes((prevTestes) =>
      prevTestes.map((teste) => ({ ...teste, resultado: 'Não Testado', observacao: '' }))
    );
  };

  const functionSaveTest = async (id: string, resultado: string, observacao: string | undefined) => {
    try {
      const data = { resultado, observacao }
      await updateTeste(id, data);
      alert("Teste salvo com Sucesso!");
    } catch (error) {
      console.error(error)
      alert("Ocorreu erro ao salvar o Teste!")
    }
  };

  const functionDeleteTest = async (id: string) => {
    setUpdate(false);
    try {
      await deleteTeste(id);
      alert("Teste excluido com Sucesso!")
      setUpdate(true);
    } catch (error) {
      console.error(error);
      alert("Ocorreu erro ao excluir o teste!");
    }
  };

  const iniciarTestes = async () => {
    try {
      const response = { grupoID: grupoSelecionado, subGrupoID: subGrupoSelecionado, tecnico: user?._id, testes: testesFiltrados };
      await postSession(response);
      console.log(response);
      setSessionAtiva(response); // Armazena a sessão iniciada
      alert('Sessão de testes iniciada!');
    } catch (error) {
      console.error('Erro ao iniciar a sessão de testes:', error);
    }
  };

  useEffect(() => {
    findAllTestAttributes();
  }, [update]);

  return (
    <TableListTests
      title="Lista de Testes"
      listaCabecalho={HEAD_TABLE}
      listaDe={testesFiltrados}
      hasUser={!user}
      admin={!user?.admin}
      loading={loading}
      hasGruposSelecionado={subGrupoSelecionado}
      onchangeResult={handleChange}
      onchangeObservation={handleChangeObs}
      buttonSave={functionSaveTest}
      buttonDelete={functionDeleteTest}
      onchangeReset={resetarTestes}
      startSession={iniciarTestes}
    >

      <div className="max-w-xl m-2 flex gap-5">
        <InputFilter id="grupo"
          labelTitulo="Grupo"
          listaDe={grupos}
          selectText="Todos os Grupos..."
          value={grupoSelecionado}
          setValor={handleGrupoSelecionado} />

        <InputFilter id="subGrupo"
          labelTitulo="SubGrupo"
          listaDe={subGruposFiltrados}
          selectText="Todos subgrupos..."
          value={subGrupoSelecionado}
          setValor={handleSubGrupoSelecionado}
          disabled={!grupoSelecionado} />


        <div className="w-full content-center">
          {subGrupoSelecionado &&
            <ModalCadastro title="Adicionar Teste">
              {user ?
                <AddTeste
                  grupo={grupoSelecionado}
                  subgrupo={subGrupoSelecionado}
                /> :
                <AlertErro />
              }
            </ModalCadastro>
          }
        </div>
      </div>
    </TableListTests>
  );
};
