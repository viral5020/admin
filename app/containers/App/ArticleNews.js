import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { Routes, Route } from 'react-router-dom';
import Blog from '../Templates/Blog';
import { ThemeContext } from './ThemeWrapper';
import { BlogHome, Article } from '../pageListAsync';

function ArticleNews(props) {
  const { history } = props;
  const changeMode = useContext(ThemeContext);
  return (
    <Blog history={history} changeMode={changeMode}>
      <Routes>
        <Route path="/" element={<BlogHome />} />
        <Route path="/article" element={<Article />} />
      </Routes>
    </Blog>
  );
}

ArticleNews.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ArticleNews;
