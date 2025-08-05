// Feed.js
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchFeed,
  fetchSingle,
  isLiked,
  setLiked,
  getProfilePic,
  serverLike,
  serverAddComment
} from "./feedLogic";
import {
  HeartSVG,
  PauseIcon,
  PulseHeart,
  MuteMicIcon,
  SkeletonShort,
  CommentsModal,
  NotFoundBlock,
  EmptyFeedBlock,
  FeedList,
  MainWrapper,
  AppFont,
  BlockContextMenu,
  AntiInspectScript,
} from "./FeedUI";

export default function Feed() {
  // State
  const location = useLocation();
  const navigate = useNavigate();

  const [shorts, setShorts] = useState([]);
  const [aloneVideo, setAloneVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Comments modal state
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentingOn, setCommentingOn] = useState(null);

  // Parse param
  const params = new URLSearchParams(location.search);
  const filename = params.get("v");

  // Initial data fetch
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setAloneVideo(null);
    setShorts([]);
    setCommentsModalOpen(false);
    setAllComments([]);
    setCommentInput("");
    setCommentingOn(null);

    if (filename) {
      fetchSingle(filename)
        .then((video) => {
          if (!video || !video.filename) {
            if (!cancelled) setNotFound(true);
          } else if (!cancelled) {
            setAloneVideo(video);
          }
        })
        .catch(() => {
          if (!cancelled) setNotFound(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else {
      fetchFeed()
        .then((data) => {
          if (!cancelled) setShorts([...data]);
        })
        .catch(() => {
          if (!cancelled) setShorts([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }
    return () => { cancelled = true; };
  }, [location.search, filename]);

  // Like
  const handleLike = useCallback((short) => {
    const currLiked = isLiked(short.filename);
    setLiked(short.filename, !currLiked);
    serverLike(short.filename, !currLiked);
    // UI feedback: update likes
    setAloneVideo((old) =>
      old && old.filename === short.filename
        ? { ...old, likes: Math.max(0, (old.likes || 0) + (currLiked ? -1 : 1)) }
        : old
    );
    setShorts((arr) =>
      arr.map((item) =>
        item.filename === short.filename
          ? { ...item, likes: Math.max(0, (item.likes || 0) + (currLiked ? -1 : 1)) }
          : item
      )
    );
  }, []);

  // Open comment modal
  const handleOpenComments = useCallback((short) => {
    setCommentInput("");
    setCommentingOn(short);
    setCommentsModalOpen(true);
    if (short.comments) setAllComments(short.comments);
    else setAllComments([]);
  }, []);

  // Add comment
  const handleAddComment = useCallback(() => {
    if (!commentInput.trim() || !commentingOn) return;
    serverAddComment(commentingOn.filename, {
      name: "You",
      text: commentInput.trim()
    });
    const newCommentObj = {
      name: "You",
      text: commentInput.trim(),
      createdAt: new Date().toISOString(),
    };
    setAllComments((old) => [...old, newCommentObj]);
    setCommentInput("");
    // Update feed too on add
    setAloneVideo((old) =>
      old && old.filename === commentingOn.filename
        ? { ...old, comments: [...(old.comments || []), newCommentObj] }
        : old
    );
    setShorts((arr) =>
      arr.map((item) =>
        item.filename === commentingOn.filename
          ? { ...item, comments: [...(item.comments || []), newCommentObj] }
          : item
      )
    );
  }, [commentInput, commentingOn]);

  // Share
  const handleShare = useCallback((short) => {
    const shareUrl = `${window.location.origin}/?v=${encodeURIComponent(short.filename)}`;
    if (navigator.share) {
      navigator.share({ url: shareUrl, title: short.title || "Watch this short!" });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    }
  }, []);

  // ---- Render ----
  return (
    <>
      <AppFont />
      <AntiInspectScript />
      <BlockContextMenu />
      <MainWrapper>
        {loading && <SkeletonShort />}
        {!loading && notFound && (
          <NotFoundBlock onBack={() => navigate("/", { replace: true })} />
        )}
        {!loading && !notFound && !filename && shorts.length === 0 && <EmptyFeedBlock />}

        {/* FEED mode */}
        {!loading && !notFound && !filename && shorts.length > 0 &&
          <>
            <FeedList
              shorts={shorts}
              onLike={handleLike}
              onOpenComments={handleOpenComments}
              onShare={handleShare}
              isLiked={isLiked}
              getProfilePic={getProfilePic}
              isSingle={false}
            />
            <CommentsModal
              visible={commentsModalOpen}
              allComments={allComments}
              onClose={() => setCommentsModalOpen(false)}
              commentInput={commentInput}
              onCommentChange={setCommentInput}
              onAddComment={handleAddComment}
            />
          </>
        }

        {/* SINGLE VIDEO mode */}
        {!loading && !notFound && filename && aloneVideo &&
          <>
            <FeedList
              shorts={[aloneVideo]}
              onLike={handleLike}
              onOpenComments={handleOpenComments}
              onShare={handleShare}
              isLiked={isLiked}
              getProfilePic={getProfilePic}
              isSingle
              onBack={() => navigate("/", { replace: true })}
            />
            <CommentsModal
              visible={commentsModalOpen}
              allComments={allComments}
              onClose={() => setCommentsModalOpen(false)}
              commentInput={commentInput}
              onCommentChange={setCommentInput}
              onAddComment={handleAddComment}
            />
          </>
        }
      </MainWrapper>
    </>
  );
}
