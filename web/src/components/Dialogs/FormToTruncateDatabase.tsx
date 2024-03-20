import * as Dialog from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import Input from "../Input";
import Loading from "../Loading";
import { useAdmin } from "../../hooks/useAdmin";

function FormToTruncateDatabase() {
  const [open, setOpen] = useState(false);

  const [secret, setSecret] = useState("");

  const { truncateDatabase, isLoading } = useAdmin();

  function handleParse(e: FormEvent) {
    e.preventDefault();
    setSecret("");
    truncateDatabase({ secret });
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={clsx(
          "w-full flex flex-col items-center justify-center space-y-6 bg-slate-800 rounded hover:bg-slate-700 py-2 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 outline-none focus-visible:ring-red-400 px-4"
        )}
      >
        <span>Zerar banco de dados</span>
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
                onSubmit={handleParse}
                className="flex md:text-justify items-center flex-col justify-start text-center h-screen"
              >
                <div className="w-full flex flex-col space-y-4 items-start text-left pt-8 px-4">
                  <span>
                    Você deseja detetar{" "}
                    <span className="text-red-500">todas</span> as informações
                    do banco de dadosn incluindo{" "}
                    <span className="text-red-500">eletivas e estudantes</span>?
                  </span>
                  <p>
                    Esse processo é{" "}
                    <span className="text-red-500">irreversível</span>.
                  </p>
                </div>
                <div className="w-full flex items-start justify-center text-left pt-6">
                  <Input
                    onChange={(e) => setSecret(e.target.value)}
                    value={secret}
                    label="Código admin"
                    type="text"
                    placeholder="Digite o código de administrador"
                  />
                </div>
                <div className="w-full absolute bottom-0">
                  <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 hover:cursor-pointer w-full rounded text-zinc-900 font-bold text-lg py-4 focus-visible:ring-2 focus-visible:ring-white"
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

export default FormToTruncateDatabase;
