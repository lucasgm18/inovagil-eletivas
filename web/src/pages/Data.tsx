import { useNavigate } from "react-router-dom";
import { useClasses } from "../hooks/useClasses";

function Data() {
  const navigation = useNavigate();
  const { csvData } = useClasses();

  return (
    <div className="w-full bg-slate-900 flex-col flex items-center justify-center flex-1 min-h-screen text-zinc-50 space-y-6">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                Matriculas
              </th>
            </tr>
          </thead>
          <tbody>
            {csvData.map((item) => {
              return (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {item.turma}
                  </th>
                  <td className="px-6 py-4">{item.professor}</td>
                  <td className="px-6 py-4">{item.quantidade}</td>
                  <td className="px-6 py-4">
                    {item.alunos.join(", ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
