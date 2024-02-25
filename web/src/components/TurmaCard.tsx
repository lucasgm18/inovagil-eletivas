import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ClassesProps } from "../context/classes";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { useClasses } from "../hooks/useClasses";

function TurmaCard({ turma }: { turma: ClassesProps }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { registerClasses } = useClasses();

  if (!user) {
    return <div>Carregando ...</div>;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    registerClasses({ matricula: user!.matricula, classId: turma.id });
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="w-full flex flex-col items-center justify-center space-y-4 bg-slate-800 rounded hover:bg-slate-700 py-6 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 outline-none focus-visible:ring-lime-400">
        <span>{turma.nome}</span>
        <span>{turma.professor}</span>
        <span>{turma.quantidadeDeAlunos}/45</span>
        <span className="text-sm text-zinc-600">{turma.id}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60">
          <Dialog.Content className="text-slate-400 bg-slate-700 flex flex-col md:max-w-[640px] w-full fixed md:rounded-md inset-0 md:inset-auto outline-none md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 md:h-[60vh] overflow-hidden">
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 roudend-md hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>
            <form
              onSubmit={handleSubmit}
              className="flex items-center flex-col justify-start text-center h-screen"
            >
              {user.turmasCadastradas[0] ? (
                <div>
                  <p>
                    Você esta cadastrado na turma:
                    <span>
                      {turma.id === user.turmasCadastradas[0].classesId
                        ? turma.nome
                        : null}
                    </span>
                  </p>
                </div>
              ) : null}
              <p className="text-xl text-zinc-50 py-12 px-4">
                Você tem certeza que deseja se cadastrar na eletiva{" "}
                <span className="text-lime-500 relative">{turma.nome}</span>
              </p>
              <div className="w-full absolute bottom-0">
                <button
                  type="submit"
                  className="bg-lime-500 hover:bg-lime-600 hover:cursor-pointer w-full rounded text-zinc-900 py-4"
                >
                  Sim
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default TurmaCard;
