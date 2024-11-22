import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import style from './Search.module.scss';

const Search = () => {
  const { query } = useParams(); // 검색어 가져오기
  const [results, setResults] = useState([]); // 검색 결과
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`https://bargainus.kr/bills/add?query=${query}`, {
          withCredentials: true,
        });
        setResults(response.data); // 검색 결과 저장
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('검색 결과를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) return <div className={style.loading}>로딩 중...</div>;
  if (error) return <div className={style.error}>{error}</div>;

  return (
    <div className={style.searchPage}>
      <h1 className={style.title}>"{query}" 검색 결과</h1>
      {results.length > 0 ? (
        <div className={style.results}>
          {results.map((item) => (
            <div key={item.productCode} className={style.resultItem}>
              <img src={item.photo || '/images/default.jpg'} alt={item.productName} />
              <div className={style.info}>
                <h2>{item.productName}</h2>
                <p>가격: {Number(item.price).toLocaleString()} 원</p>
                <p>수량: {item.count}</p>
                <p>총 금액: {Number(item.totalPrice).toLocaleString()} 원</p>
                <Link to={`/products/${item.productCode}`} className={style.detailLink}>
                  상품 상세 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={style.noResults}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
