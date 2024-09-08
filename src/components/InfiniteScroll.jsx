import React, { useState, useEffect, useRef } from 'react';
import styles from './InfiniteScroll.module.css';

const InfiniteScroll = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  useEffect(() => {
    const loadMoreItems = () => {
      setLoading(true);
      fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
      )
        .then((response) => response.json())
        .then((data) => {
          setItems((prevItems) => [...prevItems, ...data]);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    loadMoreItems();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (loaderRef.current) {
        const { scrollTop, clientHeight, scrollHeight } =
          document.documentElement;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
      <div ref={loaderRef} className={styles.loader}>
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default InfiniteScroll;
