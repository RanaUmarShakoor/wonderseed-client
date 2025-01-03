import { Link } from "react-router-dom";
import "./KnowledgeBase.scss";

import Guide from "./images/guide.png";
import Tutorial from "./images/tutorial.png";
import { resolveUploadUrl, useGetGuides } from "apiconn";
import { useAppStoreKey } from "stores/main";
import { filterPanel } from "utils";

import "react-modal-video/scss/modal-video.scss";
import ModalVideo from "react-modal-video";
import { useState } from "react";

export function KnowledgeBase() {
  const auth = useAppStoreKey("auth");
  const { data: guides } = useGetGuides({
    keepPreviousData: true,
    initialData: []
  });
  let current = guides.find((g: any) => filterPanel(g.panel, auth.user?.role));

  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div className='sideview-content'>
      <h1 className='mt-10 text-4xl font-bold'>FAQs / Knowledge Base</h1>

      <section className='mt-10 flex flex-col gap-x-14 gap-y-12 lg:flex-row'>
        <div className='kb-card flex-1 pb-12'>
          <header className='image-wrapper'>
            <img src={Guide} />
          </header>
          <h2 className='text-2xl font-bold'>Platform Guide</h2>
          <p className='mt-2 opacity-70'>{current?.platform}</p>
          <Link to='faqs'>
            <button className='w-button w-button-outline mt-8 !px-10'>
              View
            </button>
          </Link>
        </div>
        <div className='kb-card flex-1 pb-12'>
          <header className='image-wrapper'>
            <img src={Tutorial} />
          </header>
          <h2 className='text-2xl font-bold'>Platform Tutorial</h2>
          <p className='mt-2 opacity-70'>{current?.training}</p>
          {current?.media && (
            <>
              <button
                onClick={() => setVideoOpen(true)}
                className='w-button w-button-outline mb-12 mt-8 !px-10'
              >
                Play
              </button>
              <ModalVideo
                channel='custom'
                url={resolveUploadUrl(current?.media.filePath)}
                isOpen={videoOpen}
                onClose={() => setVideoOpen(false)}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
