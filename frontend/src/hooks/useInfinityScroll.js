import { useRef, useEffect, useState, useCallback } from "react";
import useMessageStore from "../store/messageStore.js";
import useGlobalStore from "../store/globalStore.js";


const useInfinityScroll = (conversationId) => {
    const fetchNextPage = useMessageStore((state) => state.fetchNextPage);
    const hasMore = useGlobalStore((state) => state.hasMore);
    const rootRef = useRef(null);
    const observerRef = useRef(null);
    const [isFetchingNext, setIsFetchingNext] = useState(false);

    const loader = useCallback((node) => {
        if(!node || isFetchingNext) return;

        const options = {
            root: rootRef?.current,
            threshold: 1.0,
        }

        const callback = async(entries) => {
            const entry = entries[0];
            if(!entry.isIntersecting || !hasMore) return;
            setIsFetchingNext(true);
            await fetchNextPage(conversationId);
            setIsFetchingNext(false);
        }

        observerRef?.current?.disconnect();
        observerRef.current = new IntersectionObserver(callback, options);
        observerRef.current.observe(node);
    }, [isFetchingNext, hasMore, conversationId]);

    return { rootRef, loader };
};

export default useInfinityScroll;