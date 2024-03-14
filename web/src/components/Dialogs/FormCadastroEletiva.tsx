import * as Dialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import Input from "../Input";
import Loading from "../Loading";
import { useClasses } from "../../hooks/useClasses";

function FormCadastroEletiva() {
  const { registerEletiva } = useClasses();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [professor, setProfessor] = useState("");
  const [vagas, setVagas] = useState(1);
  const [serie, setSerie] = useState(1);
  const [diaDaSemana, setDiaDaSemana] = useState("SEGUNDA");
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    console.log("Eletiva cadastrada", {
      nome,
      professor,
      vagas,
      serie,
      diaDaSemana,
    });
    registerEletiva({ nome, professor, vagas, serie, diaDaSemana });
    setTimeout(() => {
      setOpen(false);
      setIsLoading(false);
    }, 1000);
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={clsx(
          "w-full flex flex-col items-center justify-center space-y-6 bg-slate-800 rounded hover:bg-slate-700 py-6 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 outline-none focus-visible:ring-yellow-400"
        )}
      >
        <button>Cadastrar eletiva</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60">
          <Dialog.Content className="text-slate-400 bg-slate-700 flex flex-col md:max-w-[640px] w-full fixed md:rounded-md inset-0 md:inset-auto outline-none md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 md:min-h-[60vh] overflow-hidden">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 roudend-md hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>
            {isLoading ? (
              <div className="w-full flex-1 md:flex-auto flex items-center justify-center md:min-h-[60vh]">
                <Loading />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex items-center flex-col justify-start text-center h-screen"
              >
                <div className="w-full flex flex-col space-y-4 items-start text-left pt-8 px-2">
                  <Input
                    onChange={(e) => setNome(e.target.value)}
                    value={nome}
                    label="Nome da eletiva"
                    type="text"
                    placeholder="Ex: Morfologia das plantas"
                  />
                  <Input
                    onChange={(e) => setProfessor(e.target.value)}
                    value={professor}
                    label="Professor"
                    type="text"
                    placeholder="Ex: Monteiro Lobato"
                  />
                  <Input
                    onChange={(e) => setVagas(e.target.valueAsNumber)}
                    value={vagas}
                    label="Vagas"
                    type="number"
                    placeholder="Ex: 45"
                    min={1}
                    max={100}
                  />
                  <Input
                    onChange={(e) => setSerie(e.target.valueAsNumber)}
                    value={serie}
                    label="Série"
                    type="number"
                    placeholder="Ex: 1"
                    min={1}
                    max={3}
                  />
                  <Input
                    onChange={(e) => setDiaDaSemana(e.target.value)}
                    value={diaDaSemana}
                    label="Dia da Semana"
                    type="text"
                    placeholder="Ex: SEGUNDA"
                    min={1}
                    max={100}
                  />
                </div>
                <div className="w-full absolute bottom-0">
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 hover:cursor-pointer w-full rounded text-zinc-900 font-bold text-lg py-4 focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Sim
                  </button>
                </div>
              </form>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default FormCadastroEletiva;
