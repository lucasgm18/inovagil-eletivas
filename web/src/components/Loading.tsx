import { Loader } from "lucide-react";
function Loading() {
  return (
    <div className="animate-spin">
      <div className="animate-pulse">
        <Loader />
      </div>
    </div>
  );
}

export default Loading;
