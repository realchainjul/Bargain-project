import { useEffect, useState } from 'react';
import axios from 'axios';

const GrainPage = () => {
  const [grains, setGrains] = useState([]);

  useEffect(() => {
    axios.get('/api') // 곡물 API 엔드포인트
      .then(response => setGrains(response.data))
      .catch(error => console.error("곡물 데이터를 가져오는 중 오류:", error));
  }, []);

  return (
    <div>
      <h1>곡물 목록</h1>
      <ul>
        {grains.map(grain => (
          <li key={grain.id}>{grain.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GrainPage;
