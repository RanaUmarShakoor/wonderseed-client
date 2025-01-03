import { apiConn } from "apiconn";
import "./ProgressIndicator.scss";
import { ProgressBar } from "components/ProgressBar/ProgressBar";
import { produce } from "immer";
import React, {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { Ellipsis } from "react-css-spinners";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { CounterID, ParamVoidCallback, VoidCallback } from "utils";

const ElemHeading = ({ heading }: { heading: string }) => (
  <h3 className='text-md mb-2 font-bold leading-none text-grey-1/80'>
    {heading}
  </h3>
);

export type ElementHandle = {
  id: string;
  name: string;
};

export type ElementInstance<T = any> = ElementHandle & {
  __ctype?: T;
  renderedId: number;
  hydratedState?: any;
};

export type RenderableElement<T = any> = ElementHandle & {
  __ctype?: T;
  preview: React.ReactNode;
  Master: React.ComponentType<{
    instance: ElementInstance<T>;
  }>;
  skip?: (collected: T) => boolean;
  transform?: (collected: T) => Promise<any | null>;
};

export type CollectedElement<T = any> = {
  id: string;
  data: T;
};

type RenderableElementInstance = RenderableElement & ElementInstance;

export type ExtractCollectionType<T> = T extends RenderableElement<infer R>
  ? R
  : never;
export type CollectedElementOf<T> = CollectedElement<ExtractCollectionType<T>>;

const ElementOption = forwardRef(
  (
    { element, onClick }: { element: RenderableElement; onClick?: () => void },
    ref
  ) => {
    return (
      <div
        onClick={onClick}
        ref={ref as any}
        className='max-w-full cursor-pointer rounded-lg p-2.5 transition-colors hover:bg-black/10'
      >
        <ElemHeading heading={element.name} />
        {element.preview}
      </div>
    );
  }
);

const RenderedElement = memo(
  ({
    onDelete,
    instance
  }: {
    instance: RenderableElementInstance;
    onDelete: ParamVoidCallback<number>;
  }) => {
    return (
      <>
        <div className='flex items-start gap-x-4'>
          <h1 className='mb-2.5 flex-1 text-lg font-bold'>{instance.name}</h1>
          <button
            tabIndex={-1}
            onClick={() => onDelete(instance.renderedId)}
            className='shrink-0 rounded-full bg-black/20 p-2 text-white hover:bg-red-400 hover:text-red-700'
          >
            <DeleteSVG />
          </button>
        </div>
        <instance.Master instance={instance} />
        <hr className='border-1 !my-8 border-black' />
      </>
    );
  }
);

const elemCounter = new CounterID();

export class ContentController {
  private callbacks: Record<number, VoidCallback> = {};

  public subscribe(instance: ElementInstance, func: VoidCallback) {
    this.callbacks[instance.renderedId] = func;
  }

  public unsubscribe(instance: ElementInstance) {
    delete this.callbacks[instance.renderedId];
  }

  public broadcast(instance: ElementInstance) {
    let func = this.callbacks[instance.renderedId] || null;
    if (func !== null)
      //
      func();
  }
}

class ContentSink {
  private sinks: Record<number, any> = {};

  public reset() {
    this.sinks = {};
  }

  public fill(instance: ElementInstance, data: any) {
    this.sinks[instance.renderedId] = data;
  }

  public get(instance: ElementInstance): any {
    return this.sinks[instance.renderedId] || null;
  }
}

export const CollectionContext = createContext<
  | undefined
  | {
      controller: ContentController;
      sink: ContentSink;
    }
>(undefined);

export function DayDesignBase({
  title,
  elementStore,
  onSave,
  onHydrate
}: {
  title: string;
  elementStore: RenderableElement[];
  onSave: (elems: CollectedElement[]) => Promise<void>;
  onHydrate?: () => Promise<any[]>;
}) {
  const navigate = useNavigate();
  let [rendered, setRendered] = useState<RenderableElementInstance[]>([]);
  const [uploading, setUploading] = useState(false);
  const [transformedCount, setTransformedCount] = useState(0);

  const controllerRef = useRef(new ContentController());
  const sinkRef = useRef(new ContentSink());

  // hydration
  useEffect(() => {
    (async function () {
      let elements = (await onHydrate?.()) || [];
      if (elements.length == 0) return;

      let hydratedRendered: RenderableElementInstance[] = [];
      for (let i = 0; i < elements.length; ++i) {
        let current = elements[i];
        let elemInfo = elementStore.find(e => e.id == current.id);

        if (elemInfo == undefined) continue;

        hydratedRendered.push({
          ...elemInfo,
          renderedId: elemCounter.generate(),
          hydratedState: current.data
        });
      }

      setRendered(hydratedRendered);
    })();
  }, []);

  const handleNewElement = useCallback((elem: RenderableElement) => {
    setRendered(old => [
      ...old,
      {
        ...elem,
        renderedId: elemCounter.generate()
      }
    ]);
  }, []);

  const handleDelete = useCallback((id: number) => {
    setRendered(
      produce(draft => {
        let index = draft.findIndex(x => x.renderedId === id);
        if (index != -1) draft.splice(index, 1);
      })
    );
  }, []);

  const handleSave = async () => {
    setUploading(true);
    setTransformedCount(0);
    try {
      sinkRef.current.reset();

      let results: CollectedElement[] = [];

      for (let i = 0; i < rendered.length; ++i) {
        let instance = rendered[i];
        controllerRef.current.broadcast(instance);
        let collected = sinkRef.current.get(instance);

        const { skip, transform } = instance;

        if (skip && skip(collected)) continue;

        let afterTransform = (await transform?.(collected)) ?? collected;

        results.push({
          id: instance.id,
          data: afterTransform
        });

        setTransformedCount(i + 1);
      }

      await onSave(results);
      setTransformedCount(rendered.length+1);
      navigate(-1);
    } catch {
      setUploading(false);
    }
  };

  let __e = (r: any) =>
    ({ ...elementStore[r], renderedId: elemCounter.generate() } as any);

  const renderActive = rendered.map(elem => (
    <RenderedElement
      onDelete={handleDelete}
      instance={elem}
      key={elem.renderedId}
    />
  ));

  return (
    <section className='mt-8'>
      <header className='mb-4 flex items-center gap-x-4'>
        <h4 className='mb-4 text-3xl font-bold'>{title}</h4>
        <button
          onClick={() => navigate(-1)}
          className='w-button w-button-outline ml-auto'
        >
          Back
        </button>
        <button disabled={uploading} onClick={handleSave} className='w-button'>
          {uploading ? <Ellipsis size={20} /> : "Save"}
        </button>
      </header>

      {uploading && (
        <div className='mb-4'>
          <div
            className='striploader-main'
            style={{
              backgroundPosition: `${
                (100 * transformedCount) / Math.max(1, 1 + rendered.length)
              }%`,
              backgroundColor: "green"
            }}
          ></div>
        </div>
      )}

      {/* {uploading && (
        <ProgressBar
          className='mb-4 [&>.w-pg-mainbar]:!bg-[#bcbcbc]'
          time={transformedCount / Math.max(1, 1 + rendered.length)}
        />
      )} */}

      <section className='grid grid-cols-[1fr_180px]'>
        {/* Design pane */}
        <CollectionContext.Provider
          value={{
            controller: controllerRef.current,
            sink: sinkRef.current
          }}
        >
          <div className='space-y-2 pr-4'>
            {renderActive}
            {/* <RenderedElement onDelete={handleDelete} instance={__e(2)} /> */}
          </div>
        </CollectionContext.Provider>
        {/* Elements pane */}
        <div className='min-h-screen border-l-2 border-black/20 px-4'>
          <h2 className='mb-3 text-xl font-bold'>Elements</h2>
          <div className='space-y-1'>
            {elementStore.map(element => (
              <ElementOption
                onClick={() => handleNewElement(element)}
                element={element}
                key={element.name}
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

const DeleteSVG = () => (
  <svg
    fill='currentColor'
    version='1.1'
    id='Capa_1'
    xmlns='http://www.w3.org/2000/svg'
    width='10'
    height='10'
    viewBox='0 0 94.926 94.926'
  >
    <g>
      <path
        d='M55.931,47.463L94.306,9.09c0.826-0.827,0.826-2.167,0-2.994L88.833,0.62C88.436,0.224,87.896,0,87.335,0
		c-0.562,0-1.101,0.224-1.498,0.62L47.463,38.994L9.089,0.62c-0.795-0.795-2.202-0.794-2.995,0L0.622,6.096
		c-0.827,0.827-0.827,2.167,0,2.994l38.374,38.373L0.622,85.836c-0.827,0.827-0.827,2.167,0,2.994l5.473,5.476
		c0.397,0.396,0.936,0.62,1.498,0.62s1.1-0.224,1.497-0.62l38.374-38.374l38.374,38.374c0.397,0.396,0.937,0.62,1.498,0.62
		s1.101-0.224,1.498-0.62l5.473-5.476c0.826-0.827,0.826-2.167,0-2.994L55.931,47.463z'
      />
    </g>
  </svg>
);

export function useOnCollected<T>(
  instance: ElementInstance<T>,
  collector: () => T
) {
  const { controller, sink } = useContext(CollectionContext)!;

  useEffect(() => {
    function callback() {
      sink.fill(instance, collector());
    }

    controller.subscribe(instance, callback);

    return () => {
      controller.unsubscribe(instance);
    };
  }, [instance, collector]);
}

export function useOnHydrated(
  instance: ElementInstance,
  func: ParamVoidCallback<any>
) {
  useEffect(() => {
    let state = instance.hydratedState;
    if (state == undefined) return;
    func(state);
  }, [instance]);
}
