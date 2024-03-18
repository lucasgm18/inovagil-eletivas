import { useNavigate } from "react-router-dom";
import { useClasses } from "../hooks/useClasses";
import { toast } from "sonner";
import { Copy } from "lucide-react";
function Data() {
  const navigation = useNavigate();
  const { csvData } = useClasses();
  function handleCopiarMatriculas(item: {
    turma: string;
    alunos: { nome: string; matricula: string }[];
    professor: string;
    quantidade: number;
  }) {
    navigator.clipboard.writeText(
      `Eletiva\tProfessor\tQuantidade de alunos matriculados\n${item.turma}\t${
        item.professor
      }\t${item.quantidade}\n\nNome\tMatrícula\n${item.alunos
        .map((aluno) => {
          return `${aluno.nome.trim()}\t${aluno.matricula.trim()}`;
        })
        .join("\n")}`
    );
    toast.success("Matriculas copiadas com sucesso");
  }

  return (
    <div className="w-full bg-slate-900 flex-col flex items-center justify-center flex-1 min-h-screen text-zinc-50 space-y-6">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg md:w-[70%] w-full px-2">
        <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Turma
              </th>

              <th scope="col" className="px-6 py-3">
                Professor
              </th>

              <th scope="col" className="px-6 py-3">
                Quantidade de alunos
              </th>

              <th scope="col" className="px-6 py-3">
                Alunos matriculados
              </th>
              <th scope="col" className="px-6 py-3">
                Copiar
              </th>
            </tr>
          </thead>
          <tbody>
            {csvData.map((item) => {
              return (
                <tr
                  key={item.turma}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {item.turma}
                  </th>
                  <td className="px-6 py-4">{item.professor}</td>
                  <td className="px-6 py-4">{item.quantidade}</td>
                  <td className="px-6 py-4">
                    {item.alunos
                      .map((aluno) => {
                        return `${aluno.nome} - ${aluno.matricula}`;
                      })
                      .join("\n")}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center">
                    <Copy
                      onClick={() => {
                        handleCopiarMatriculas(item);
                      }}
                      className="text-zinc-300 hover:cursor-pointer hover:text-zinc-100"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <a
        className="bg-green-800 px-4 py-2 rounded hover:bg-green-700 hover:cursor-pointer hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 outline-none focus-visible:ring-lime-400"
        target="_blank"
        href="http://localhost:3333/export/download/2"
      >
        Download
      </a>
      <button
        className="bg-green-800 px-4 py-2 rounded hover:bg-green-700 hover:cursor-pointer hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 outline-none focus-visible:ring-lime-400"
        type="button"
        onClick={() => navigation("/")}
      >
        Início
      </button>
    </div>
  );
}

export default Data;
