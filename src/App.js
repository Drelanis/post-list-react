/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PostList from './components/PostList';
import './styles/app.css';
import PostForm from './components/PostForm';
import PostFilter from './components/PostFilter';
import MyModal from './components/UI/modalWindow/MyModal';
import MyButton from './components/UI/button/MyButton';
import usePosts from './hooks/usePosts';
import PostService from './API/PostService';
import Loader from './components/UI/loader/Loader';
import useFetching from './hooks/useFetching';
import { getPageCount } from './utils/pages';
import Pagination from './components/UI/Pagination/Pagintaion';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({ sort: '', query: '' });
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
    const response = await PostService.getAll(limit, page);
    setPosts(response.data);
    const totalCount = response.headers['x-total-count'];
    setTotalPages(getPageCount(totalCount, limit));
  });
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);

  const createPost = (post) => {
    setPosts([...posts, post]);
    setModal(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const removePost = (post) => {
    setPosts(posts.filter((element) => element.id !== post.id));
  };

  const changePage = (page) => {
    setPage(page);
  };

  return (
    <div className="App">
      <MyButton style={{ marginTop: '30px' }} onClick={() => setModal(true)}>
        Создать статью
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>
      <hr style={{ margin: '15px 0' }} />
      <PostFilter filter={filter} setFilter={setFilter} />
      {postError ? (
        <h1>Произошла ошибка: {postError}</h1>
      ) : isPostsLoading ? (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}
        >
          <Loader></Loader>
        </div>
      ) : (
        <PostList
          remove={removePost}
          posts={sortedAndSearchedPosts}
          title={'Статьи про JavaScript'}
        />
      )}
      <Pagination
        totalPages={totalPages}
        page={page}
        changePage={changePage}
      ></Pagination>
    </div>
  );
};

export default App;
