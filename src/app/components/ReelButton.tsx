"use client";

import React, { useRef } from "react";

/**
 * Hero trigger for the showreel. The video only starts downloading when the
 * dialog opens (preload="none"), so it adds nothing to the page load.
 */
export const ReelButton = ({ children }: { children: React.ReactNode }) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  const open = () => {
    dialog.current?.showModal();
    // Autoplay can still be refused (e.g. low-power mode); the controls remain.
    video.current?.play().catch(() => {});
  };
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        className="reel-trigger"
        onClick={open}
        aria-haspopup="dialog"
      >
        {children}
        <span>Watch the reel</span>
        <span className="reel-time">0:36</span>
      </button>

      <dialog
        ref={dialog}
        className="reel-dialog"
        aria-label="Showreel"
        onClose={() => video.current?.pause()}
        // A click on the backdrop lands on the dialog element itself.
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <video
          ref={video}
          // Hosted on Vercel Blob (store "portfolio-media") to keep the video out of git.
          src="https://hukstsfryfrsyjai.public.blob.vercel-storage.com/reel.mp4"
          poster="/reel-poster.jpg"
          controls
          playsInline
          preload="none"
        />
        <div className="reel-meta">
          <p>
            Music: “Voltaic” by Kevin MacLeod (incompetech.com), licensed under{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY 4.0
            </a>
          </p>
          <button type="button" className="reel-close" onClick={close}>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
};

export default ReelButton;
