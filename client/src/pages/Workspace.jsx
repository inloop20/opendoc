import { useOutletContext } from "react-router-dom";
import WorkspaceHeader from "../features/workspace/components/WorkspaceHeader";
import DocumentView from "../features/workspace/components/DocumentView";

const WorkspacePage = () => {
  const { activeDocId } = useOutletContext();

  return (
    <div className="flex flex-col flex-1 h-full">

      <WorkspaceHeader />

      <main className="flex-1 overflow-y-auto">
        {activeDocId ? (
          <DocumentView docId={activeDocId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a document
          </div>
        )}
      </main>

    </div>
  );
};

export default WorkspacePage;