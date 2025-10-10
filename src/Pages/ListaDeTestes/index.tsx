import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { MessagemToastify } from "../../Components/Toastify";
import { RootReducer } from "../../store";
import {
  useDeleteTesteMutation,
  useGetAllGruposQuery,
  useGetAllSubGruposQuery,
  useGetAllTesteQuery,
} from "../../services/testeService";
import { useFinishSessionMutation, usePostSessionMutation } from "../../services/sessionService";
import TableListTests from "../../Components/Tables/TableListTests";
import ModalCadastro from "../../Components/ModalCadastros";
import InputFilter from "../../Components/InputFilter";
import AddTeste from "../../Components/Form/AddTeste";
import AlertErro from "../../Pages/Error/AlertError";
import useSaveTeste from "../../Hooks/useSaveTeste";


export default function ListaDeTestes() {
  const [testeTemp, setTesteTemp] = useState<ITeste[]>([]);
  const { data: testes, isLoading: loadingTestes } = useGetAllTesteQuery();
  const { data: grupos } = useGetAllGruposQuery();
  const { data: subGrupos } = useGetAllSubGruposQuery();
  const { functionSaveTest, isLoading: saveLoading } = useSaveTeste();
  const [deleteTeste, { isLoading: deleteLoading }] = useDeleteTesteMutation();
  const [postSession] = usePostSessionMutation();
  const [finishSession] = useFinishSessionMutation();
  const [grupoSelecionado, setGrupoSelecionado] = useState("");
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState("");
  const [resultadoSelecionado, setResultadoSelecionado] = useState("");
  const [sessionAtiva, setSessionAtiva] = useState<IDadosSessao>();
  const { user } = useSelector((state: RootReducer) => state.user);
  const messageError = (!user ? "Você precisar está logado para acessar essa funcionalidade" : "Você não tem permissão para acessar essa funcionalidade , entre em contato com o administrador do sistema.");

  const handleGrupoSelecionado = (newValue: string) => {
    localStorage.setItem("grupoSelecionado", newValue);
    setGrupoSelecionado(newValue);
  };

  const handleSubGrupoSelecionado = (newValue: string) => {
    localStorage.setItem("subgrupoSelecionado", newValue);
    setSubGrupoSelecionado(newValue);
  };

  const gruposFiltrado = useMemo(() => {
    if (!grupos) return [];
    return grupos;
  }, [grupos]);
  // Memoized values should be called unconditionally
  const subGruposFiltrados = useMemo(() => {
    if (!subGrupos) return [];
    return subGrupos.filter(
      (subgrupo) =>
        subgrupo.grupoId === grupoSelecionado ||
        (subgrupo.grupo && subgrupo.grupo._id === grupoSelecionado)
    );
  }, [subGrupos, grupoSelecionado]);

  const testesFiltrados = useMemo(() => {
    if (!testes) return [];
    return testeTemp.filter(
      ({ grupo, subGrupo, resultado }) =>
        (!grupoSelecionado || grupo._id === grupoSelecionado) &&
        (!subGrupoSelecionado || subGrupo._id === subGrupoSelecionado) &&
        (!resultadoSelecionado || resultado === resultadoSelecionado)
    );
  }, [testes, testeTemp, grupoSelecionado, subGrupoSelecionado, resultadoSelecionado]);

  const nomeGrupo = useMemo(() => {
    if (!grupos) return "Grupo não encontrado";
    return grupos.find((g) => g._id === grupoSelecionado)?.nome || "";
  }, [grupos, grupoSelecionado]);

  const nomeSubGrupo = useMemo(() => {
    if (!subGrupos) return "";
    return subGrupos.find((s) => s._id === subGrupoSelecionado)?.nome || "";
  }, [subGrupos, subGrupoSelecionado]);

  // Inicializa testeTemp quando testes chegam
  useEffect(() => { if (testes) setTesteTemp(testes) }, [testes]);

  const handleChange = async (id: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    setTesteTemp((prev) =>
      prev.map((teste) => (teste._id === id ? { ...teste, resultado: e.target.value } : teste))
    );
  };

  const handleChangeObs = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setTesteTemp((prev) =>
      prev.map((teste) => (teste._id === id ? { ...teste, observacao: e.target.value } : teste))
    );
  };

  const resetarTestes = () => {
    setTesteTemp((prev) =>
      prev.map((teste) => ({ ...teste, resultado: "Não Testado", observacao: "" }))
    );
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

  const iniciarTestes = async () => {
    if (!user?._id) {
      MessagemToastify("É necessário estar logado para iniciar a sessão!", "error");
      return;
    };

    const dadosSession = {
      grupo: nomeGrupo,
      subGrupo: nomeSubGrupo,
      tecnico: user._id,
      testes: testesFiltrados
    };

    const res = await postSession(dadosSession);
    if ("error" in res) {
      MessagemToastify("Ocorreu erro ao tentar iniciar essa sessão!", "error");
      console.error(res.error);
      return;
    };
    MessagemToastify("Sessão de testes iniciada!", "success");
    setSessionAtiva(res.data);
  };

  const finalizarTestes = async () => {
    if (!sessionAtiva) return;
    if (testesFiltrados.some((t) => t.resultado === "Não Testado")) {
      MessagemToastify(
        "Não é possível finalizar teste com Resultado como 'Não Testado'",
        "error"
      );
      return;
    };

    // const testesAtualizados = testesFiltrados.map((teste) => ({
    //   _id: teste._id,
    //   description: teste.description,
    //   resultado: teste.resultado,
    //   observacao: teste.observacao
    // }));

    const sessionId = sessionAtiva._id;
    const data = { sessionId, testesAtualizados: testesFiltrados };
    const res = await finishSession(data);
    if ("error" in res) {
      MessagemToastify("Erro ao finalizar a sessão.", "error");
      console.error(res.error);
      return;
    };

    MessagemToastify("Sessão de testes finalizada!", "success");
    setSessionAtiva(undefined);

  };

  const saveFilter = () => {
    const grupoTemp = localStorage.getItem("grupoSelecionado");
    const subgrupoTemp = localStorage.getItem("subgrupoSelecionado");
    setGrupoSelecionado(grupoTemp || "");
    if (grupoTemp) {
      setSubGrupoSelecionado(subgrupoTemp || "");
    } else {
      localStorage.removeItem("subgrupoSelecionado");
    }
  };

  useEffect(() => { saveFilter() }, []);

  return (
    <TableListTests
      title="Lista de Testes"
      listaDe={testesFiltrados}
      hasUser={!user}
      admin={!user?.admin}
      saveLoading={saveLoading}
      testestLoading={loadingTestes}
      deleteLoading={deleteLoading}
      hasSession={sessionAtiva}
      hasGruposSelecionado={subGrupoSelecionado}
      onchangeResult={handleChange}
      onchangeObservation={handleChangeObs}
      buttonSave={functionSaveTest}
      buttonDelete={functionDeleteTest}
      onchangeReset={resetarTestes}
      startSession={iniciarTestes}
      finishTest={finalizarTestes}
    >
      <div className="m-2 flex gap-5 justify-between print:hidden max-[769px]:flex-col">
        <InputFilter
          id="grupo"
          labelTitulo="Grupo"
          listaDe={gruposFiltrado}
          selectText="Todos os Grupos..."
          value={grupoSelecionado}
          setValor={handleGrupoSelecionado}
        />

        <InputFilter
          id="subGrupo"
          labelTitulo="SubGrupo"
          listaDe={subGruposFiltrados}
          selectText="Todos subgrupos..."
          value={subGrupoSelecionado}
          setValor={handleSubGrupoSelecionado}
          disabled={!grupoSelecionado}
        />

        <div className="w-full items-center max-[769px]:flex">
          <label htmlFor="resultado" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ">
            Resultado
          </label>
          <select id="resultado"
            className="print:bg-transparent print:border-0 print:font-medium
           block p-2 w-full text-sm text-gray-800 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-100 dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
            onChange={(event) => setResultadoSelecionado(event.target.value)}
            value={resultadoSelecionado}
          >
            <option value="">Todas</option>
            <option value="Não Testado">Não Testado</option>
            <option value="Passou">Passou</option>
            <option value="Não Passou">Não Passou</option>
          </select>
        </div>

        <div className="w-full content-center">
          {subGrupoSelecionado && (
            <ModalCadastro title="Adicionar Teste">
              {user && user.admin ?
                <AddTeste
                  grupo={grupoSelecionado}
                  subgrupo={subGrupoSelecionado}
                /> :
                <AlertErro message={messageError} />
              }
            </ModalCadastro>
          )}
        </div>

        <span className="w-full content-around text-end text-md px-5 font-Oswald dark:text-blue-50">Total de Testes: {testesFiltrados.length}</span>
      </div>

      {/* Secção para impressão */}
      <div className="w-full justify-between hidden print:flex mb-5">
        <InputFilter id="grupo"
          labelTitulo="Grupo"
          listaDe={gruposFiltrado}
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

        <span className="w-full content-around text-end text-md px-5 font-Oswald dark:text-blue-50">
          Total de Testes: {testesFiltrados.length}</span>
      </div>
    </TableListTests>
  );
};
