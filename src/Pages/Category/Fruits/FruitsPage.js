import { useEffect, useState } from 'react';
import axios from 'axios';

const FruitsPage = () => {
  const [fruits, setFruits] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}?`) // 과일 API 엔드포인트
      .then(response => setFruits(response.data))
      .catch(error => console.error("과일 데이터를 가져오는 중 오류:", error));
  }, []);

  return (
    <div>
      <h1>과일 목록</h1>
      <ul>
        {fruits.map(fruit => (
          <li key={fruit.id}>{fruit.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FruitsPage;
