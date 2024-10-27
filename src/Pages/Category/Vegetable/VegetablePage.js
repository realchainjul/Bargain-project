import { useEffect, useState } from 'react';
import axios from 'axios';

const VegetablePage = () => {
  const [vegetables, setVegetables] = useState([]);

  useEffect(() => {
    axios.get('/api') // 채소 API 엔드포인트
      .then(response => setVegetables(response.data))
      .catch(error => console.error("채소 데이터를 가져오는 중 오류:", error));
  }, []);

  return (
    <div>
      <h1>채소 목록</h1>
      <ul>
        {vegetables.map(veg => (
          <li key={veg.id}>{veg.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default VegetablePage;