import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/dialog/dialog";
function promptDataReducer(
  state: any[],
  action: {
    index?: number;
    answer?: string | undefined;
    status?: string;
    query?: string | undefined;
    type?: "remove-last-item" | string;
  }
) {
  // set a standard state to use later
  let current = [...state];

  if (action.type) {
    switch (action.type) {
      case "remove-last-item":
        current.pop();
        return [...current];
      default:
        break;
    }
  }

  // check that an index is present
  if (action.index === undefined) return [...state];

  if (!current[action.index]) {
    current[action.index] = { query: "", answer: "", status: "" };
  }

  current[action.index].answer = action.answer;

  if (action.query) {
    current[action.index].query = action.query;
  }
  if (action.status) {
    current[action.index].status = action.status;
  }

  return [...current];
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string | undefined>("");
  const eventSourceRef = useRef<EventSource>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [promptData, dispatchPromptData] = useReducer(promptDataReducer, []);

  const cantHelp =
    answer?.trim() === "Sorry, I don't know how to help with that.";

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen(true);
      }

      if (e.key === "Escape") {
        console.log("esc");
        handleModalToggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function handleModalToggle() {
    setOpen(!open);
    setSearch("");
    setQuestion("");
    setAnswer(undefined);
    setPromptIndex(0);
    dispatchPromptData({ type: "remove-last-item" });
    setHasError(false);
    setIsLoading(false);
  }

  const handleConfirm = useCallback(
    async (query: string) => {
      setAnswer(undefined);
      setQuestion(query);
      setSearch("");
      dispatchPromptData({ index: promptIndex, answer: undefined, query });
      setHasError(false);
      setIsLoading(true);

      const eventSource = new EventSource(`api/vector-search`);

      function handleError<T>(err: T) {
        setIsLoading(false);
        setHasError(true);
        console.error(err);
      }

      eventSource.addEventListener("error", handleError);
      eventSource.addEventListener("message", (e: any) => {
        try {
          setIsLoading(false);

          if (e.data === "[DONE]") {
            setPromptIndex((x) => {
              return x + 1;
            });
            return;
          }

          const completionResponse: any = JSON.parse(e.data);
          const text = completionResponse.choices[0].text;

          setAnswer((answer) => {
            const currentAnswer = answer ?? "";

            dispatchPromptData({
              index: promptIndex,
              answer: currentAnswer + text,
            });

            return (answer ?? "") + text;
          });
        } catch (err) {
          handleError(err);
        }
      });

      // eventSource.stream()

      eventSourceRef.current = eventSource;

      setIsLoading(true);
    },
    [promptIndex, promptData]
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log(search);

    handleConfirm(search);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-base flex gap-2 items-center px-4 py-2 z-50 relative
          text-slate-500 dark:text-slate-400  hover:text-slate-700 dark:hover:text-slate-300
          transition-colors
          rounded-md
          border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500
          min-w-[300px] "
      >
        <input width={15} />
        <span className="border border-l h-5"></span>
        <span className="inline-block ml-4">Search...</span>
        <kbd
          className="absolute right-3 top-2.5
            pointer-events-none inline-flex h-5 select-none items-center gap-1
            rounded border border-slate-100 bg-slate-100 px-1.5
            font-mono text-[10px] font-medium
            text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400
            opacity-100 "
        >
          <span className="text-xs">⌘</span>K
        </kbd>{" "}
      </button>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[850px] text-black">
          <DialogHeader>
            <DialogTitle>OpenAI powered doc search</DialogTitle>
            <DialogDescription>
              Build your own ChatGPT style search with Next.js, OpenAI &
              Supabase.
            </DialogDescription>
            <hr />
            <button
              className="absolute top-0 right-2 p-2"
              onClick={() => setOpen(false)}
            >
              <div className="h-4 w-4 dark:text-gray-100" />
            </button>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 text-slate-700">
              {question && (
                <div className="flex gap-4">
                  <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <div />{" "}
                  </span>
                  <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">
                    {question}
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="animate-spin relative flex w-5 h-5 ml-2">
                  <>
                    <div className="absolute top-0 mt-1 w-3 h-3 border-t-2 border-r-2 border-slate-500 rounded-full opacity-75"></div>
                  </>
                </div>
              )}

              {hasError && (
                <div className="flex items-center gap-4">
                  <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <div />
                  </span>
                  <span className="text-slate-700 dark:text-slate-100">
                    Sad news, the search has failed! Please try again.
                  </span>
                </div>
              )}

              {answer && !hasError ? (
                <div className="flex items-center gap-4 dark:text-white">
                  <span className="bg-green-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <div className="text-white" />
                  </span>
                  <h3 className="font-semibold">Answer:</h3>
                  {answer}
                </div>
              ) : null}

              <div className="relative">
                <input
                  placeholder="Ask a question..."
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="col-span-3"
                />
                <div
                  className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
                    search ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-100">
                Or try:{" "}
                <button
                  type="button"
                  className="px-1.5 py-0.5
                    bg-slate-50 dark:bg-gray-500
                    hover:bg-slate-100 dark:hover:bg-gray-600
                    rounded border border-slate-200 dark:border-slate-600
                    transition-colors"
                  onClick={(_) =>
                    setSearch(
                      "Create a table called profiles with fields id, name, email"
                    )
                  }
                >
                  Create a table called profiles with fields id, name, email
                </button>
              </div>
            </div>
            <div>
              <button type="submit" className="bg-red-500">
                Ask
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
