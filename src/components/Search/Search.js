import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './Search.module.scss';

const Search = () => {
  const { query } = useParams(); // 검색어 가져오기
  const [results, setResults] = useState([]); // 검색 결과
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`https://bargainus.kr/search`, {
          params: {
            keyword: query, // 검색 키워드를 파라미터로 전달
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data && response.data.products) {
          setResults(response.data.products); // 검색 결과 저장
        } else {
          setResults([]); // 결과가 없을 때 빈 배열로 설정
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('검색 결과를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleItemClick = (category, pcode) => {
    // 카테고리와 pcode를 사용해 상세 페이지로 이동
    navigate(`/${category.name}/products/${pcode}`);
  };

  if (loading) return <div className={style.loading}>로딩 중...</div>;
  if (error) return <div className={style.error}>{error}</div>;

  return (
    <div className={style.searchPage}>
      <h1 className={style.title}>"{query}" 검색 결과</h1>
      {results.length > 0 ? (
        <div className={style.results}>
          {results.map((item) => (
            <div
              key={item.pcode}
              className={style.resultItem}
              onClick={() => handleItemClick(item.category, item.pcode)}
              style={{ cursor: 'pointer' }} // 클릭 가능한 스타일 추가
            >
              <img src={item.photo || '/images/default.jpg'} alt={item.name} />
              <div className={style.info}>
                <h2>{item.name}</h2>
                <p>{Number(item.price).toLocaleString()} 원</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={style.noResults}>
          <p>검색 결과가 없습니다.</p>
          <button onClick={() => navigate('/')} className={style.homeButton}>
            홈으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
